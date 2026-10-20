import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { connectToDatabase, isMongoConfigured } from "../db/mongodb.js";
import {
  OrderModel,
  MenuItemModel,
  TableModel,
  ReservationModel,
  InventoryModel,
  CategoryModel,
  CustomerModel,
  TransactionModel,
  OfferModel,
  StaffModel,
  ReviewModel,
  NotificationModel,
  SystemDocModel,
} from "../db/models.js";
import {
  MASTER_ADMIN,
  INITIAL_MENU_ITEMS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_TABLES,
  INITIAL_RESERVATIONS,
  INITIAL_INVENTORY,
  INITIAL_CUSTOMERS,
  INITIAL_TRANSACTIONS,
  INITIAL_OFFERS,
  INITIAL_STAFF,
  INITIAL_REVIEWS,
  INITIAL_CMS_CONTENT,
  INITIAL_NOTIFICATIONS,
} from "./seedData.js";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "admin-store.json");

// In-memory fallback cache
let memoryStore = null;
let currentEtag = null;
let currentVersion = 1;
let lastModified = new Date().toISOString();
let writeQueue = Promise.resolve();
let isMongoSeeded = false;

// Default initial state snapshot
function getSeedState() {
  return {
    version: 1,
    lastModified: new Date().toISOString(),
    currentUser: MASTER_ADMIN,
    menuItems: INITIAL_MENU_ITEMS,
    categories: INITIAL_CATEGORIES,
    orders: INITIAL_ORDERS,
    tables: INITIAL_TABLES,
    reservations: INITIAL_RESERVATIONS,
    inventory: INITIAL_INVENTORY,
    customers: INITIAL_CUSTOMERS,
    transactions: INITIAL_TRANSACTIONS,
    offers: INITIAL_OFFERS,
    staff: INITIAL_STAFF,
    reviews: INITIAL_REVIEWS,
    cmsContent: INITIAL_CMS_CONTENT,
    notifications: INITIAL_NOTIFICATIONS,
  };
}

// Compute strong ETag for HTTP caching & sync validation
function computeEtag(data, version) {
  const hash = crypto.createHash("md5");
  hash.update(
    `${version}:${data.lastModified || lastModified}:${data.orders?.length || 0}:${data.tables?.length || 0}:${data.menuItems?.length || 0}`
  );
  return `"${hash.digest("hex")}"`;
}

function sanitizeDoc(doc) {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return { ...rest, id: rest.id || _id?.toString() };
}

// Ensure MongoDB has initial restaurant records if empty
async function ensureMongoSeeded() {
  if (isMongoSeeded) return;
  try {
    const count = await MenuItemModel.countDocuments();
    if (count === 0) {
      console.log("[MongoDB] Empty database detected. Seeding restaurant catalog, tables & inventory...");
      await Promise.all([
        MenuItemModel.insertMany(INITIAL_MENU_ITEMS),
        CategoryModel.insertMany(INITIAL_CATEGORIES),
        TableModel.insertMany(INITIAL_TABLES),
        InventoryModel.insertMany(INITIAL_INVENTORY),
        OrderModel.insertMany(INITIAL_ORDERS),
        ReservationModel.insertMany(INITIAL_RESERVATIONS),
        CustomerModel.insertMany(INITIAL_CUSTOMERS),
        TransactionModel.insertMany(INITIAL_TRANSACTIONS),
        OfferModel.insertMany(INITIAL_OFFERS),
        StaffModel.insertMany(INITIAL_STAFF),
        ReviewModel.insertMany(INITIAL_REVIEWS),
        NotificationModel.insertMany(INITIAL_NOTIFICATIONS),
        SystemDocModel.findOneAndUpdate(
          { key: "cmsContent" },
          { key: "cmsContent", value: INITIAL_CMS_CONTENT },
          { upsert: true }
        ),
      ]);
      console.log("[MongoDB] Initial seeding completed successfully.");
    }
    isMongoSeeded = true;
  } catch (err) {
    console.error("[MongoDB] Seeding check failed:", err.message);
  }
}

// Fetch all data from MongoDB
async function getMongoData() {
  await connectToDatabase();
  await ensureMongoSeeded();

  const [
    orders,
    tables,
    menuItems,
    inventory,
    reservations,
    categories,
    notifications,
    customers,
    transactions,
    offers,
    staff,
    reviews,
    cmsDoc,
  ] = await Promise.all([
    OrderModel.find().sort({ createdAt: -1 }).lean(),
    TableModel.find().sort({ code: 1 }).lean(),
    MenuItemModel.find().lean(),
    InventoryModel.find().lean(),
    ReservationModel.find().sort({ createdAt: -1 }).lean(),
    CategoryModel.find().sort({ sortOrder: 1 }).lean(),
    NotificationModel.find().sort({ createdAt: -1 }).limit(50).lean(),
    CustomerModel.find().lean(),
    TransactionModel.find().sort({ timestamp: -1 }).lean(),
    OfferModel.find().lean(),
    StaffModel.find().lean(),
    ReviewModel.find().sort({ date: -1 }).lean(),
    SystemDocModel.findOne({ key: "cmsContent" }).lean(),
  ]);

  currentVersion += 1;
  lastModified = new Date().toISOString();

  const data = {
    version: currentVersion,
    lastModified,
    currentUser: MASTER_ADMIN,
    orders: orders.map(sanitizeDoc),
    tables: tables.map(sanitizeDoc),
    menuItems: menuItems.map(sanitizeDoc),
    inventory: inventory.map(sanitizeDoc),
    reservations: reservations.map(sanitizeDoc),
    categories: categories.map(sanitizeDoc),
    notifications: notifications.map(sanitizeDoc),
    customers: customers.map(sanitizeDoc),
    transactions: transactions.map(sanitizeDoc),
    offers: offers.map(sanitizeDoc),
    staff: staff.map(sanitizeDoc),
    reviews: reviews.map(sanitizeDoc),
    cmsContent: cmsDoc?.value || INITIAL_CMS_CONTENT,
  };

  currentEtag = computeEtag(data, currentVersion);

  return {
    version: currentVersion,
    lastModified,
    etag: currentEtag,
    data,
  };
}

// ==========================================
// LOCAL DISK FALLBACK (Used if MONGODB_URI is not set)
// ==========================================
async function initStoreOnDisk() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(STORE_FILE, "utf8");
      const parsed = JSON.parse(content);
      memoryStore = parsed;
      currentVersion = parsed.version || 1;
      lastModified = parsed.lastModified || new Date().toISOString();
      currentEtag = computeEtag(memoryStore, currentVersion);
    } catch {
      memoryStore = getSeedState();
      currentVersion = memoryStore.version;
      lastModified = memoryStore.lastModified;
      currentEtag = computeEtag(memoryStore, currentVersion);
      await atomicSave(memoryStore);
    }
  } catch (err) {
    console.error("[serverStore] Failed to initialize storage:", err);
    memoryStore = getSeedState();
  }
}

async function atomicSave(data) {
  const tmpFile = `${STORE_FILE}.${Date.now()}.${Math.random().toString(36).substring(2, 6)}.tmp`;
  try {
    await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), "utf8");
    await fs.rename(tmpFile, STORE_FILE);
  } catch (err) {
    try {
      await fs.unlink(tmpFile);
    } catch {
      // ignore
    }
    if (err.code === "EROFS" || err.code === "EACCES") {
      console.warn("[serverStore] Read-only filesystem detected (Vercel runtime). Changes retained in memoryStore.");
      return;
    }
    throw err;
  }
}

function scheduleWrite(mutateFn) {
  writeQueue = writeQueue.then(async () => {
    if (!memoryStore) {
      await initStoreOnDisk();
    }
    const updated = await mutateFn(memoryStore);
    if (updated) {
      currentVersion += 1;
      lastModified = new Date().toISOString();
      updated.version = currentVersion;
      updated.lastModified = lastModified;
      memoryStore = updated;
      currentEtag = computeEtag(memoryStore, currentVersion);
      await atomicSave(memoryStore);
    }
    return {
      version: currentVersion,
      lastModified,
      etag: currentEtag,
      data: memoryStore,
    };
  }).catch((err) => {
    console.error("[serverStore] Write queue error:", err);
    throw err;
  });
  return writeQueue;
}

// ==========================================
// PUBLIC SERVER STORE APIS
// ==========================================

export async function getAdminData() {
  if (isMongoConfigured()) {
    try {
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB fetch error, falling back to disk/memory:", err.message);
    }
  }

  if (!memoryStore) {
    await initStoreOnDisk();
  }
  return {
    version: currentVersion,
    lastModified,
    etag: currentEtag,
    data: memoryStore,
  };
}

export async function syncAdminData(clientPayload) {
  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      if (Array.isArray(clientPayload.orders)) {
        for (const order of clientPayload.orders) {
          if (order.id) {
            await OrderModel.findOneAndUpdate({ id: order.id }, { $set: order }, { upsert: true });
          }
        }
      }
      if (Array.isArray(clientPayload.menuItems)) {
        for (const item of clientPayload.menuItems) {
          if (item.id) {
            await MenuItemModel.findOneAndUpdate({ id: item.id }, { $set: item }, { upsert: true });
          }
        }
      }
      if (Array.isArray(clientPayload.tables)) {
        for (const table of clientPayload.tables) {
          if (table.id) {
            await TableModel.findOneAndUpdate({ id: table.id }, { $set: table }, { upsert: true });
          }
        }
      }
      if (Array.isArray(clientPayload.inventory)) {
        for (const inv of clientPayload.inventory) {
          if (inv.id) {
            await InventoryModel.findOneAndUpdate({ id: inv.id }, { $set: inv }, { upsert: true });
          }
        }
      }
      if (Array.isArray(clientPayload.reservations)) {
        for (const res of clientPayload.reservations) {
          if (res.id) {
            await ReservationModel.findOneAndUpdate({ id: res.id }, { $set: res }, { upsert: true });
          }
        }
      }
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB sync error, falling back to disk write:", err.message);
    }
  }

  return scheduleWrite((store) => {
    const updated = { ...store };
    if (Array.isArray(clientPayload.orders)) {
      const orderMap = new Map();
      (updated.orders || []).forEach((o) => orderMap.set(o.id, o));
      clientPayload.orders.forEach((o) => orderMap.set(o.id, o));
      updated.orders = Array.from(orderMap.values());
    }
    if (Array.isArray(clientPayload.tables)) updated.tables = clientPayload.tables;
    if (Array.isArray(clientPayload.menuItems)) updated.menuItems = clientPayload.menuItems;
    if (Array.isArray(clientPayload.inventory)) updated.inventory = clientPayload.inventory;
    if (Array.isArray(clientPayload.reservations)) updated.reservations = clientPayload.reservations;
    if (Array.isArray(clientPayload.categories)) updated.categories = clientPayload.categories;
    if (Array.isArray(clientPayload.notifications)) updated.notifications = clientPayload.notifications;
    return updated;
  });
}

export async function createOrder(orderPayload) {
  // Prevent duplicate ID collisions: generate timestamp + secure random code
  const orderId =
    orderPayload.id ||
    `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const newOrder = {
    id: orderId,
    timestamp: orderPayload.timestamp || new Date().toISOString(),
    status: orderPayload.status || "pending",
    paymentStatus: orderPayload.paymentStatus || "unpaid",
    ...orderPayload,
  };

  const newNotification = {
    id: `notif-${Date.now()}`,
    type: "order",
    priority: "urgent",
    title: `⚡ New Order: ${orderId}`,
    message: `${newOrder.customer?.name || "Guest"} placed an order for ₹${newOrder.total}.`,
    time: "Just now",
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      await OrderModel.create(newOrder);
      await NotificationModel.create(newNotification);

      // If Dine-in, atomically update table status in MongoDB
      if (newOrder.type === "Dine-in" && newOrder.table) {
        await TableModel.findOneAndUpdate(
          { code: newOrder.table },
          { $set: { status: "dining", currentOrder: orderId, guests: 2, elapsedMins: 1 } }
        );
      }

      // Log financial transaction for payments ledger
      await TransactionModel.create({
        id: `TXN-${Date.now().toString().slice(-6)}`,
        orderId,
        outlet: newOrder.outlet || "Jamakhandi",
        customer: newOrder.customer?.name || "Walk-in Guest",
        amount: Number(newOrder.total) || 0,
        mode: newOrder.paymentMode || "UPI / PhonePe",
        gatewayRef: `UPI-POS-${Math.floor(100000 + Math.random() * 900000)}`,
        status: newOrder.paymentStatus === "paid" ? "Successful" : "Pending",
        timestamp: new Date().toISOString(),
      });

      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB createOrder error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    return {
      ...store,
      orders: [newOrder, ...(store.orders || [])],
      notifications: [newNotification, ...(store.notifications || [])],
    };
  });
}

export async function createReservationServer(resPayload) {
  const resId = resPayload.id || `RES-${Date.now().toString().slice(-4)}`;
  const bookingCode = resPayload.bookingCode || `CC-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRes = {
    id: resId,
    bookingCode,
    status: resPayload.status || "confirmed",
    createdAt: new Date().toISOString(),
    ...resPayload,
  };

  const newNotification = {
    id: `notif-${Date.now()}`,
    type: "reservation",
    priority: "urgent",
    title: `📅 New Booking: ${bookingCode}`,
    message: `${newRes.name} booked a table for ${newRes.guests} guests on ${newRes.date} at ${newRes.time} (${newRes.outlet || "All"}).`,
    time: "Just now",
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      await ReservationModel.create(newRes);
      await NotificationModel.create(newNotification);
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB createReservation error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    return {
      ...store,
      reservations: [newRes, ...(store.reservations || [])],
      notifications: [newNotification, ...(store.notifications || [])],
    };
  });
}

export async function createCustomerReviewOrInquiry(payload) {
  const newReview = {
    id: `rev-${Date.now()}`,
    author: payload.name || "Customer",
    rating: payload.rating || 5,
    date: new Date().toISOString().split("T")[0],
    source: "Website Feedback Form",
    comment: payload.message,
    outlet: payload.outlet || "Jamakhandi",
    status: "pending_moderation", // Safe: default to pending review to prevent public spam
  };

  const newNotification = {
    id: `notif-${Date.now()}`,
    type: "review",
    priority: "normal",
    title: `💬 New Feedback from ${payload.name}`,
    message: `${payload.inquiryType || "Inquiry"}: "${(payload.message || "").slice(0, 60)}..."`,
    time: "Just now",
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      await ReviewModel.create(newReview);
      await NotificationModel.create(newNotification);
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB review error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    return {
      ...store,
      reviews: [newReview, ...(store.reviews || [])],
      notifications: [newNotification, ...(store.notifications || [])],
    };
  });
}

export async function updateOrderStatus(orderId, status) {
  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      const updatedOrder = await OrderModel.findOneAndUpdate(
        { id: orderId },
        { $set: { status } },
        { new: true }
      ).lean();

      // Automatically release table when order finishes
      if ((status === "completed" || status === "cancelled") && updatedOrder?.table) {
        await TableModel.findOneAndUpdate(
          { code: updatedOrder.table },
          { $set: { status: "available", currentOrder: null } }
        );
      }
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB updateOrderStatus error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    const orders = (store.orders || []).map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    return { ...store, orders };
  });
}

export async function updateTableStatus(tableId, status, payload = {}) {
  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      await TableModel.findOneAndUpdate(
        { id: tableId },
        { $set: { status, ...payload } },
        { new: true }
      );
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB updateTableStatus error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    const tables = (store.tables || []).map((t) =>
      t.id === tableId ? { ...t, status, ...payload } : t
    );
    return { ...store, tables };
  });
}

export async function updateStock(itemId, quantityChange) {
  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      const item = await InventoryModel.findOne({ id: itemId });
      if (item) {
        const newStock = Math.max(0, (item.currentStock || 0) + quantityChange);
        const isLow = newStock <= (item.minThreshold || 10);
        await InventoryModel.findOneAndUpdate(
          { id: itemId },
          { $set: { currentStock: newStock, status: isLow ? "low" : "good" } },
          { new: true }
        );
      }
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB updateStock error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    const inventory = (store.inventory || []).map((item) => {
      if (item.id === itemId) {
        const newStock = Math.max(0, (item.currentStock || 0) + quantityChange);
        const isLow = newStock <= (item.minThreshold || 10);
        return {
          ...item,
          currentStock: newStock,
          status: isLow ? "low" : "good",
        };
      }
      return item;
    });
    return { ...store, inventory };
  });
}

export async function addMenuItemServer(itemPayload) {
  const newItem = {
    id: itemPayload.id || `item-${Date.now().toString().slice(-4)}`,
    ordersCount: 0,
    isAvailable: true,
    ...itemPayload,
  };

  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      await MenuItemModel.create(newItem);
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB addMenuItem error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    return {
      ...store,
      menuItems: [newItem, ...(store.menuItems || [])],
    };
  });
}

export async function updateMenuItemServer(itemId, updatedFields) {
  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      await MenuItemModel.findOneAndUpdate(
        { id: itemId },
        { $set: updatedFields },
        { new: true }
      );
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB updateMenuItem error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    const menuItems = (store.menuItems || []).map((item) =>
      item.id === itemId ? { ...item, ...updatedFields } : item
    );
    return {
      ...store,
      menuItems,
    };
  });
}

export async function deleteMenuItemServer(itemId) {
  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      await MenuItemModel.findOneAndDelete({ id: itemId });
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB deleteMenuItem error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    const menuItems = (store.menuItems || []).filter((item) => item.id !== itemId);
    return {
      ...store,
      menuItems,
    };
  });
}

export async function toggleMenuItemAvailabilityServer(itemId) {
  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      const item = await MenuItemModel.findOne({ id: itemId });
      if (item) {
        await MenuItemModel.findOneAndUpdate(
          { id: itemId },
          { $set: { isAvailable: !item.isAvailable } }
        );
      }
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB toggleMenuItem error:", err.message);
    }
  }

  return scheduleWrite((store) => {
    const menuItems = (store.menuItems || []).map((item) =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    return {
      ...store,
      menuItems,
    };
  });
}

export async function resetDatabaseToDefaults() {
  if (isMongoConfigured()) {
    try {
      await connectToDatabase();
      await Promise.all([
        OrderModel.deleteMany({}),
        MenuItemModel.deleteMany({}),
        TableModel.deleteMany({}),
        ReservationModel.deleteMany({}),
        InventoryModel.deleteMany({}),
        CategoryModel.deleteMany({}),
        CustomerModel.deleteMany({}),
        TransactionModel.deleteMany({}),
        OfferModel.deleteMany({}),
        StaffModel.deleteMany({}),
        ReviewModel.deleteMany({}),
        NotificationModel.deleteMany({}),
        SystemDocModel.deleteMany({}),
      ]);
      isMongoSeeded = false;
      await ensureMongoSeeded();
      return await getMongoData();
    } catch (err) {
      console.error("[serverStore] MongoDB reset error:", err.message);
    }
  }

  return scheduleWrite(() => {
    return getSeedState();
  });
}
