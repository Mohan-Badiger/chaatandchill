import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
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

// In-memory cache for ultra-fast responses
let memoryStore = null;
let currentEtag = null;
let currentVersion = 1;
let lastModified = new Date().toISOString();
let writeQueue = Promise.resolve();

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
  hash.update(`${version}:${data.lastModified}:${data.orders?.length || 0}:${data.tables?.length || 0}`);
  return `"${hash.digest("hex")}"`;
}

// Ensure the storage directory and file exist
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
      // File doesn't exist yet or is invalid, seed it
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

// Atomic file write using temporary file to prevent corruption under load
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
    throw err;
  }
}

// Enqueue write operations sequentially
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

// Public API for server-side store
export async function getAdminData() {
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
  return scheduleWrite((store) => {
    const updated = { ...store };

    if (Array.isArray(clientPayload.orders)) {
      // Merge orders preserving existing, unique by id
      const orderMap = new Map();
      (updated.orders || []).forEach((o) => orderMap.set(o.id, o));
      clientPayload.orders.forEach((o) => orderMap.set(o.id, o));
      updated.orders = Array.from(orderMap.values());
    }

    if (Array.isArray(clientPayload.tables)) {
      updated.tables = clientPayload.tables;
    }

    if (Array.isArray(clientPayload.menuItems)) {
      updated.menuItems = clientPayload.menuItems;
    }

    if (Array.isArray(clientPayload.inventory)) {
      updated.inventory = clientPayload.inventory;
    }

    if (Array.isArray(clientPayload.reservations)) {
      updated.reservations = clientPayload.reservations;
    }

    if (Array.isArray(clientPayload.categories)) {
      updated.categories = clientPayload.categories;
    }

    if (Array.isArray(clientPayload.notifications)) {
      updated.notifications = clientPayload.notifications;
    }


    return updated;
  });
}

export async function createOrder(orderPayload) {
  return scheduleWrite((store) => {
    const newOrder = {
      id: orderPayload.id || `ORD-${Date.now().toString().slice(-4)}`,
      timestamp: orderPayload.timestamp || new Date().toISOString(),
      status: orderPayload.status || "pending",
      paymentStatus: orderPayload.paymentStatus || "unpaid",
      ...orderPayload,
    };

    const newNotification = {
      id: `notif-${Date.now()}`,
      type: "order",
      priority: "urgent",
      title: `⚡ New Order: ${newOrder.id}`,
      message: `${newOrder.customer?.name || "Guest"} placed an order for ₹${newOrder.total}.`,
      time: "Just now",
      read: false,
    };

    return {
      ...store,
      orders: [newOrder, ...(store.orders || [])],
      notifications: [newNotification, ...(store.notifications || [])],
    };
  });
}

export async function updateOrderStatus(orderId, status) {
  return scheduleWrite((store) => {
    const orders = (store.orders || []).map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    return { ...store, orders };
  });
}

export async function updateTableStatus(tableId, status, payload = {}) {
  return scheduleWrite((store) => {
    const tables = (store.tables || []).map((t) =>
      t.id === tableId ? { ...t, status, ...payload } : t
    );
    return { ...store, tables };
  });
}

export async function updateStock(itemId, quantityChange) {
  return scheduleWrite((store) => {
    const inventory = (store.inventory || []).map((item) => {
      if (item.id === itemId) {
        const newStock = Math.max(0, (item.currentStock || 0) + quantityChange);
        const isLow = newStock <= (item.threshold || 10);
        return {
          ...item,
          currentStock: newStock,
          status: isLow ? "low" : "in_stock",
        };
      }
      return item;
    });
    return { ...store, inventory };
  });
}

export async function addMenuItemServer(itemPayload) {
  return scheduleWrite((store) => {
    const newItem = {
      id: itemPayload.id || `item-${Math.floor(200 + Math.random() * 800)}`,
      ordersCount: 0,
      isAvailable: true,
      ...itemPayload,
    };
    return {
      ...store,
      menuItems: [newItem, ...(store.menuItems || [])],
    };
  });
}

export async function updateMenuItemServer(itemId, updatedFields) {
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
  return scheduleWrite((store) => {
    const menuItems = (store.menuItems || []).filter((item) => item.id !== itemId);
    return {
      ...store,
      menuItems,
    };
  });
}

export async function toggleMenuItemAvailabilityServer(itemId) {
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
  return scheduleWrite(() => {
    return getSeedState();
  });
}

