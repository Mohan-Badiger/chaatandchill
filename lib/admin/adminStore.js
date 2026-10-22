"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

// Re-export all seed definitions and data structures for 100% backward compatibility
export * from "./seedData";

import {
  MASTER_ADMIN,
  ADMIN_ROLES,
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
} from "./seedData";

// ==========================================
// REACT CONTEXT & STORE IMPLEMENTATION
// ==========================================
const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState("synced"); // "synced" | "syncing" | "offline" | "error"
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // Authentication & Active User (Secured Server Session)
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [selectedOutlet, setSelectedOutlet] = useState("ALL");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States (Initialized identically on server and initial client render to prevent hydration mismatch)
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [cmsContent, setCmsContent] = useState(INITIAL_CMS_CONTENT);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // UI helpers: Toasts, Modals
  const [toasts, setToasts] = useState([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isPosOpen, setIsPosOpen] = useState(false);

  // Save changes to localStorage safely
  const saveToStorage = useCallback((key, data) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch {
      // storage error fallback
    }
  }, []);

  // Cross-tab real-time sync broadcaster
  const broadcastMutation = useCallback((type, payload) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("chaat_admin_bus");
        channel.postMessage({ type, payload, timestamp: Date.now() });
        channel.close();
      } catch {
        // ignore
      }
    }
  }, []);

  // Toast Notification Dispatcher
  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = "toast-" + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Play subtle audio cue if supported
    try {
      if (typeof window !== "undefined" && window.AudioContext) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = type === "error" ? 220 : type === "success" ? 880 : 540;
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      }
    } catch {
      // ignore audio context restrictions
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // BACKEND SYNC ENGINE (ETag + 304 Caching + Resilience)
  const syncWithBackend = useCallback(async (isInitial = false) => {
    try {
      setSyncStatus("syncing");
      const headers = {};
      const storedEtag = typeof window !== "undefined" ? localStorage.getItem("chaat_admin_etag") : null;
      if (storedEtag && !isInitial) {
        headers["If-None-Match"] = storedEtag;
      }

      const res = await fetch("/api/admin/data", { headers });

      if (res.status === 304) {
        // Data is 100% current on client
        setSyncStatus("synced");
        setLastSyncedAt(new Date());
        return;
      }

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          if (Array.isArray(d.orders)) {
            setOrders(d.orders);
            saveToStorage("chaat_admin_orders", d.orders);
          }
          if (Array.isArray(d.tables)) {
            setTables(d.tables);
            saveToStorage("chaat_admin_tables", d.tables);
          }
          if (Array.isArray(d.menuItems)) {
            setMenuItems(d.menuItems);
            saveToStorage("chaat_admin_menu", d.menuItems);
          }
          if (Array.isArray(d.categories)) {
            setCategories(d.categories);
            saveToStorage("chaat_admin_categories", d.categories);
          }
          if (Array.isArray(d.inventory)) {
            setInventory(d.inventory);
            saveToStorage("chaat_admin_inventory", d.inventory);
          }
          if (Array.isArray(d.reservations)) {
            setReservations(d.reservations);
            saveToStorage("chaat_admin_reservations", d.reservations);
          }
          if (Array.isArray(d.notifications)) {
            setNotifications(d.notifications);
            saveToStorage("chaat_admin_notifs", d.notifications);
          }

          const newEtag = res.headers.get("ETag");
          if (newEtag && typeof window !== "undefined") {
            localStorage.setItem("chaat_admin_etag", newEtag);
          }
          setSyncStatus("synced");
          setLastSyncedAt(new Date());
        }
      } else {
        setSyncStatus("offline");
      }
    } catch {
      setSyncStatus("offline");
    }
  }, [saveToStorage]);

  // Initial Post-Hydration Load & Storage Fallback
  useEffect(() => {
    setIsHydrated(true);

    // Verify active administrator session with server
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          saveToStorage("chaat_admin_user", data.user);
        } else {
          setCurrentUser(null);
          if (typeof window !== "undefined") localStorage.removeItem("chaat_admin_user");
        }
      })
      .catch(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("chaat_admin_user") : null;
        if (stored) {
          try {
            setCurrentUser(JSON.parse(stored));
          } catch {
            setCurrentUser(null);
          }
        }
      })
      .finally(() => {
        setIsAuthLoading(false);
      });

    try {

      const storedOrders = localStorage.getItem("chaat_admin_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedTables = localStorage.getItem("chaat_admin_tables");
      if (storedTables) {
        const parsed = JSON.parse(storedTables);
        if (Array.isArray(parsed) && parsed.length === 12 && !parsed.some((t) => t.section)) {
          setTables(parsed);
        } else {
          setTables(INITIAL_TABLES);
        }
      }

      const storedMenu = localStorage.getItem("chaat_admin_menu");
      if (storedMenu) setMenuItems(JSON.parse(storedMenu));

      const storedCat = localStorage.getItem("chaat_admin_categories");
      if (storedCat) setCategories(JSON.parse(storedCat));

      const storedInv = localStorage.getItem("chaat_admin_inventory");
      if (storedInv) setInventory(JSON.parse(storedInv));

      const storedRes = localStorage.getItem("chaat_admin_reservations");
      if (storedRes) setReservations(JSON.parse(storedRes));

      const storedCust = localStorage.getItem("chaat_admin_customers");
      if (storedCust) setCustomers(JSON.parse(storedCust));

      const storedTx = localStorage.getItem("chaat_admin_transactions");
      if (storedTx) setTransactions(JSON.parse(storedTx));

      const storedOffers = localStorage.getItem("chaat_admin_offers");
      if (storedOffers) setOffers(JSON.parse(storedOffers));

      const storedStaff = localStorage.getItem("chaat_admin_staff");
      if (storedStaff) setStaff(JSON.parse(storedStaff));

      const storedReviews = localStorage.getItem("chaat_admin_reviews");
      if (storedReviews) setReviews(JSON.parse(storedReviews));

      const storedCms = localStorage.getItem("chaat_admin_cms");
      if (storedCms) setCmsContent(JSON.parse(storedCms));

      const storedNotifs = localStorage.getItem("chaat_admin_notifs");
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
    } catch (e) {
      console.warn("Storage sync failed:", e);
    }

    // Connect to server backend
    syncWithBackend(true);

    // Heartbeat sync every 20 seconds
    const interval = setInterval(() => {
      if (typeof navigator !== "undefined" && navigator.onLine) {
        syncWithBackend(false);
      }
    }, 20000);

    const handleOnline = () => {
      setSyncStatus("syncing");
      syncWithBackend(false);
    };
    const handleOffline = () => setSyncStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncWithBackend]);

  // Cross-Tab Broadcast Receiver
  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel("chaat_admin_bus");
    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === "ORDER_CREATED" && payload) {
        setOrders((prev) => [payload, ...prev.filter((o) => o.id !== payload.id)]);
      } else if (type === "ORDER_STATUS" && payload) {
        setOrders((prev) =>
          prev.map((o) => (o.id === payload.orderId ? { ...o, status: payload.status } : o))
        );
      } else if (type === "TABLE_STATUS" && payload) {
        setTables((prev) =>
          prev.map((t) => (t.id === payload.tableId ? { ...t, status: payload.status, ...payload.extraData } : t))
        );
      } else if (type === "STOCK_UPDATE" && payload) {
        setInventory((prev) =>
          prev.map((item) => (item.id === payload.id ? { ...item, currentStock: payload.newQty } : item))
        );
      } else if (type === "MENU_ITEM_ADDED" && payload) {
        setMenuItems((prev) => [payload, ...prev.filter((i) => i.id !== payload.id)]);
      } else if (type === "MENU_ITEM_UPDATED" && payload) {
        setMenuItems((prev) =>
          prev.map((i) => (i.id === payload.id ? { ...i, ...payload } : i))
        );
      } else if (type === "MENU_ITEM_DELETED" && payload) {
        setMenuItems((prev) => prev.filter((i) => i.id !== payload.id));
      } else if (type === "MENU_ITEM_TOGGLE" && payload) {
        setMenuItems((prev) =>
          prev.map((i) => (i.id === payload.id ? { ...i, isAvailable: !i.isAvailable } : i))
        );
      } else if (type === "RESERVATION_ADDED" && payload) {
        setReservations((prev) => [payload, ...prev.filter((r) => r.id !== payload.id)]);
        addToast(`New Table Booking: ${payload.name} (${payload.time})`, "success");
      } else if (type === "NOTIFICATION_ADDED" && payload) {
        setNotifications((prev) => [payload, ...prev.filter((n) => n.id !== payload.id)]);
        addToast(payload.title || "New notification received", "info");
      } else if (type === "FULL_SYNC") {
        syncWithBackend(false);
      }
    };
    return () => channel.close();
  }, [syncWithBackend, addToast]);

  // AUTH ACTIONS
  const loginUser = useCallback(async (credentialsOrUser) => {
    // If credentials passed (email & password), authenticate with backend
    if (credentialsOrUser?.email && credentialsOrUser?.password) {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentialsOrUser.email,
            password: credentialsOrUser.password,
          }),
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          saveToStorage("chaat_admin_user", data.user);
          addToast(`Signed in as ${data.user.name}`, "success");
          return { success: true, user: data.user };
        } else {
          const errMsg = data.error || "Invalid administrator credentials";
          addToast(errMsg, "error");
          return { success: false, error: errMsg };
        }
      } catch (err) {
        addToast("Authentication server connection failed", "error");
        return { success: false, error: err.message };
      }
    }

    // Direct object assignment (e.g. from session refresh)
    const adminUser = credentialsOrUser || null;
    setCurrentUser(adminUser);
    if (adminUser) {
      saveToStorage("chaat_admin_user", adminUser);
      addToast(`Signed in as ${adminUser.name}`, "success");
    }
    return { success: true, user: adminUser };
  }, [saveToStorage, addToast]);

  const logoutUser = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("chaat_admin_user");
      localStorage.removeItem("chaat_admin_etag");
    }
    addToast("Logged out successfully", "info");
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }, [addToast]);

  const switchUserRole = useCallback(() => {
    addToast("Single Master Administrator mode active", "info");
  }, [addToast]);

  // MENU ACTIONS (Optimistic UI + Background Server Sync)
  const addMenuItem = useCallback((item) => {
    const newItem = {
      id: "item-" + Math.floor(200 + Math.random() * 800),
      ordersCount: 0,
      ...item,
    };
    setMenuItems((prev) => {
      const updated = [newItem, ...prev];
      saveToStorage("chaat_admin_menu", updated);
      return updated;
    });
    broadcastMutation("MENU_ITEM_ADDED", newItem);

    // Asynchronous backend push
    fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    }).catch(() => setSyncStatus("offline"));

    addToast(`Menu item "${item.title}" added successfully`, "success");
    return newItem;
  }, [saveToStorage, broadcastMutation, addToast]);

  const updateMenuItem = useCallback((id, updatedFields) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      saveToStorage("chaat_admin_menu", updated);
      return updated;
    });
    broadcastMutation("MENU_ITEM_UPDATED", { id, ...updatedFields });

    // Asynchronous backend push
    fetch("/api/admin/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updatedFields }),
    }).catch(() => setSyncStatus("offline"));

    addToast("Item updated successfully", "success");
  }, [saveToStorage, broadcastMutation, addToast]);

  const deleteMenuItem = useCallback((id) => {
    setMenuItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveToStorage("chaat_admin_menu", updated);
      return updated;
    });
    broadcastMutation("MENU_ITEM_DELETED", { id });

    // Asynchronous backend push
    fetch(`/api/admin/menu?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch(() => setSyncStatus("offline"));

    addToast("Menu item removed", "info");
  }, [saveToStorage, broadcastMutation, addToast]);

  const toggleItemAvailability = useCallback((id) => {
    setMenuItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      );
      saveToStorage("chaat_admin_menu", updated);
      return updated;
    });
    broadcastMutation("MENU_ITEM_TOGGLE", { id });

    // Asynchronous backend push
    fetch("/api/admin/menu", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "toggle" }),
    }).catch(() => setSyncStatus("offline"));
  }, [saveToStorage, broadcastMutation]);

  // CATEGORY ACTIONS
  const addCategory = useCallback((category) => {
    const newCat = {
      id: "cat-" + Date.now(),
      itemsCount: 0,
      isActive: true,
      sortOrder: categories.length + 1,
      ...category,
    };
    setCategories((prev) => {
      const updated = [...prev, newCat];
      saveToStorage("chaat_admin_categories", updated);
      return updated;
    });
    addToast(`Category "${category.name}" created`, "success");
  }, [categories.length, saveToStorage, addToast]);

  const updateCategory = useCallback((id, fields) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...fields } : c));
      saveToStorage("chaat_admin_categories", updated);
      return updated;
    });
    addToast("Category updated", "success");
  }, [saveToStorage, addToast]);

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveToStorage("chaat_admin_categories", updated);
      return updated;
    });
    addToast("Category removed", "info");
  }, [saveToStorage, addToast]);

  // ORDER ACTIONS (Optimistic UI + Background Server Sync)
  const createOrder = useCallback((orderData) => {
    const orderId =
      orderData.id ||
      `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = {
      id: orderId,
      timestamp: new Date().toISOString(),
      status: "pending",
      paymentStatus: orderData.paymentMode === "Cash at Desk" ? "unpaid" : "paid",
      kotPrinted: false,
      ...orderData,
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      saveToStorage("chaat_admin_orders", updated);
      return updated;
    });

    // Also automatically log to transactions ledger
    const newTxn = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      orderId: newOrder.id,
      outlet: newOrder.outlet || "Jamakhandi",
      customer: newOrder.customer?.name || "Walk-in Guest",
      amount: Number(newOrder.total) || 0,
      mode: newOrder.paymentMode || "UPI / PhonePe",
      gatewayRef: `UPI-POS-${Math.floor(100000 + Math.random() * 900000)}`,
      status: newOrder.paymentStatus === "paid" ? "Successful" : "Pending",
      timestamp: new Date().toISOString(),
    };

    setTransactions((prev) => {
      const updated = [newTxn, ...prev];
      saveToStorage("chaat_admin_transactions", updated);
      return updated;
    });

    if (newOrder.type === "Dine-in" && newOrder.table) {
      setTables((prev) =>
        prev.map((tbl) =>
          tbl.code === newOrder.table && (tbl.outlet === newOrder.outlet || newOrder.outlet === "ALL")
            ? { ...tbl, status: "dining", currentOrder: newOrder.id, guests: 2, elapsedMins: 1 }
            : tbl
        )
      );
    }

    broadcastMutation("ORDER_CREATED", newOrder);

    // Asynchronous backend push
    fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    }).catch(() => setSyncStatus("offline"));

    addToast(`Order ${newOrder.id} created successfully`, "success");
    return newOrder;
  }, [saveToStorage, broadcastMutation, addToast]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
      saveToStorage("chaat_admin_orders", updated);
      return updated;
    });

    broadcastMutation("ORDER_STATUS", { orderId, status: newStatus });

    // Asynchronous backend push
    fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    }).catch(() => setSyncStatus("offline"));

    addToast(`Order ${orderId} status changed to ${newStatus.toUpperCase()}`, "info");
  }, [saveToStorage, broadcastMutation, addToast]);

  const markOrderPaid = useCallback((orderId, mode = "Cash") => {
    setOrders((prev) => {
      const updated = prev.map((ord) =>
        ord.id === orderId ? { ...ord, paymentStatus: "paid", paymentMode: mode } : ord
      );
      saveToStorage("chaat_admin_orders", updated);
      return updated;
    });
    addToast(`Order ${orderId} marked as PAID via ${mode}`, "success");
  }, [saveToStorage, addToast]);

  // REFUND ACTION
  const processRefund = useCallback((txnId, reason = "Customer Request") => {
    setTransactions((prev) => {
      const updated = prev.map((t) =>
        t.id === txnId ? { ...t, status: "Refunded", refundReason: reason } : t
      );
      saveToStorage("chaat_admin_transactions", updated);
      return updated;
    });
    addToast(`Refund processed for transaction ${txnId}`, "warning");
  }, [saveToStorage, addToast]);

  // TABLE ACTIONS (Optimistic UI + Background Server Sync)
  const updateTableStatus = useCallback((tableId, newStatus, extraData = {}) => {
    setTables((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== tableId) return t;
        if (newStatus === "available") {
          return {
            ...t,
            status: "available",
            currentOrder: null,
            guests: 0,
            elapsedMins: 0,
            reservedFor: null,
            ...extraData,
          };
        }
        if (newStatus === "dining") {
          return {
            ...t,
            status: "dining",
            guests: extraData.guests || (t.guests > 0 ? t.guests : 2),
            elapsedMins: extraData.elapsedMins || (t.elapsedMins > 0 ? t.elapsedMins : 1),
            ...extraData,
          };
        }
        if (newStatus === "reserved") {
          return {
            ...t,
            status: "reserved",
            reservedFor: extraData.reservedFor || t.reservedFor || "Guest Reservation",
            ...extraData,
          };
        }
        return { ...t, status: newStatus, ...extraData };
      });
      saveToStorage("chaat_admin_tables", updated);
      return updated;
    });

    broadcastMutation("TABLE_STATUS", { tableId, status: newStatus, extraData });

    // Asynchronous backend push
    fetch("/api/admin/tables", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId, status: newStatus, payload: extraData }),
    }).catch(() => setSyncStatus("offline"));

    addToast(`Table marked as ${newStatus.toUpperCase()}`, "success");
  }, [saveToStorage, broadcastMutation, addToast]);

  const releaseTable = useCallback((tableId) => {
    updateTableStatus(tableId, "available");
    addToast("Table vacated and marked Available", "info");
  }, [updateTableStatus, addToast]);

  // RESERVATION ACTIONS
  const updateReservationStatus = useCallback((resId, newStatus) => {
    setReservations((prev) => {
      const updated = prev.map((r) => (r.id === resId ? { ...r, status: newStatus } : r));
      saveToStorage("chaat_admin_reservations", updated);
      return updated;
    });
    addToast(`Reservation marked as ${newStatus}`, "info");
  }, [saveToStorage, addToast]);

  const addReservation = useCallback((booking) => {
    const newRes = {
      id: "RES-" + Math.floor(8900 + Math.random() * 500),
      bookingCode: "CC-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      status: "confirmed",
      ...booking,
    };
    setReservations((prev) => {
      const updated = [newRes, ...prev];
      saveToStorage("chaat_admin_reservations", updated);
      return updated;
    });
    addToast(`Reservation created for ${booking.name}`, "success");
  }, [saveToStorage, addToast]);

  // INVENTORY ACTIONS (Optimistic UI + Background Server Sync)
  const updateStock = useCallback((id, deltaQty) => {
    let finalQty = 0;
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, Math.round((Number(item.currentStock) + Number(deltaQty)) * 10) / 10);
          finalQty = newQty;
          const status = newQty <= item.minThreshold * 0.5 ? "critical" : newQty <= item.minThreshold ? "low" : "good";
          return { ...item, currentStock: newQty, status };
        }
        return item;
      });
      saveToStorage("chaat_admin_inventory", updated);
      return updated;
    });

    broadcastMutation("STOCK_UPDATE", { id, newQty: finalQty });

    // Asynchronous backend push
    fetch("/api/admin/inventory", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: id, change: deltaQty }),
    }).catch(() => setSyncStatus("offline"));

    addToast("Stock quantity updated", "success");
  }, [saveToStorage, broadcastMutation, addToast]);

  const logRestock = useCallback((id, addedQty) => {
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.round((Number(item.currentStock) + Number(addedQty)) * 10) / 10;
          return {
            ...item,
            currentStock: newQty,
            status: newQty <= item.minThreshold ? "low" : "good",
            lastRestocked: new Date().toISOString().split("T")[0],
          };
        }
        return item;
      });
      saveToStorage("chaat_admin_inventory", updated);
      return updated;
    });
    addToast("Stock delivery logged successfully", "success");
  }, [saveToStorage, addToast]);

  // OFFERS ACTIONS
  const toggleOfferStatus = useCallback((id) => {
    setOffers((prev) => {
      const updated = prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o));
      saveToStorage("chaat_admin_offers", updated);
      return updated;
    });
    addToast("Offer voucher status updated", "success");
  }, [saveToStorage, addToast]);

  const addOffer = useCallback((newOffer) => {
    const offer = {
      id: "ofr-" + Date.now(),
      usageCount: 0,
      isActive: true,
      ...newOffer,
    };
    setOffers((prev) => {
      const updated = [offer, ...prev];
      saveToStorage("chaat_admin_offers", updated);
      return updated;
    });
    addToast(`Voucher ${offer.code} created`, "success");
  }, [saveToStorage, addToast]);

  // STAFF ACTIONS
  const updateStaffStatus = useCallback((id, newStatus) => {
    setStaff((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s));
      saveToStorage("chaat_admin_staff", updated);
      return updated;
    });
    addToast("Staff shift status updated", "info");
  }, [saveToStorage, addToast]);

  // REVIEWS ACTIONS
  const replyToReview = useCallback((id, replyText) => {
    setReviews((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, reply: replyText } : r));
      saveToStorage("chaat_admin_reviews", updated);
      return updated;
    });
    addToast("Response published to guest review", "success");
  }, [saveToStorage, addToast]);

  // CMS ACTIONS
  const updateCmsContent = useCallback((newContent) => {
    setCmsContent(newContent);
    saveToStorage("chaat_admin_cms", newContent);
    addToast("Website content settings saved live", "success");
  }, [saveToStorage, addToast]);

  // NOTIFICATION ACTIONS
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveToStorage("chaat_admin_notifs", updated);
      return updated;
    });
  }, [saveToStorage]);

  const markAllNotificationsRead = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault();
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveToStorage("chaat_admin_notifs", updated);
      return updated;
    });
    addToast("All notifications marked as read", "info");
  }, [saveToStorage, addToast]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    saveToStorage("chaat_admin_notifs", []);
    addToast("Notification center cleared", "info");
  }, [saveToStorage, addToast]);

  // Role permission checker helper
  const hasPermission = useCallback((permissionKey) => {
    if (!currentUser) return false;
    const roleConfig = ADMIN_ROLES[currentUser.role];
    if (!roleConfig) return false;
    if (roleConfig.permissions.includes("all")) return true;
    return roleConfig.permissions.includes(permissionKey);
  }, [currentUser]);

  // Reset entire database to initial seed
  const resetDatabaseToDefaults = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("chaat_admin_user");
      localStorage.removeItem("chaat_admin_menu");
      localStorage.removeItem("chaat_admin_categories");
      localStorage.removeItem("chaat_admin_orders");
      localStorage.removeItem("chaat_admin_tables");
      localStorage.removeItem("chaat_admin_reservations");
      localStorage.removeItem("chaat_admin_inventory");
      localStorage.removeItem("chaat_admin_customers");
      localStorage.removeItem("chaat_admin_transactions");
      localStorage.removeItem("chaat_admin_offers");
      localStorage.removeItem("chaat_admin_staff");
      localStorage.removeItem("chaat_admin_reviews");
      localStorage.removeItem("chaat_admin_cms");
      localStorage.removeItem("chaat_admin_notifs");
      localStorage.removeItem("chaat_admin_etag");
    }

    setMenuItems(INITIAL_MENU_ITEMS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setTables(INITIAL_TABLES);
    setReservations(INITIAL_RESERVATIONS);
    setInventory(INITIAL_INVENTORY);
    setCustomers(INITIAL_CUSTOMERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setOffers(INITIAL_OFFERS);
    setStaff(INITIAL_STAFF);
    setReviews(INITIAL_REVIEWS);
    setCmsContent(INITIAL_CMS_CONTENT);
    setNotifications(INITIAL_NOTIFICATIONS);

    // Call server reset
    fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    }).catch(() => {});

    broadcastMutation("FULL_SYNC", {});
    addToast("Database reset to factory defaults", "success");
  }, [broadcastMutation, addToast]);

  // SIMULATE REAL-TIME LIVE ORDER (Disabled/Removed)
  const simulateIncomingLiveOrder = useCallback(() => {}, []);

  // MEMOIZED CONTEXT VALUE: Prevents unnecessary cascade re-renders across all admin pages
  const contextValue = useMemo(
    () => ({
      // Sync & Hydration State
      isHydrated,
      syncStatus,
      lastSyncedAt,
      triggerSync: () => syncWithBackend(false),

      // Auth & User
      currentUser,
      isAuthLoading,
      loginUser,
      logoutUser,
      switchUserRole,
      hasPermission,

      // Navigation & Layout
      selectedOutlet,
      setSelectedOutlet,
      sidebarCollapsed,
      setSidebarCollapsed,
      mobileMenuOpen,
      setMobileMenuOpen,
      isCommandOpen,
      setIsCommandOpen,
      isPosOpen,
      setIsPosOpen,

      // Data State
      menuItems,
      categories,
      orders,
      tables,
      reservations,
      inventory,
      customers,
      transactions,
      offers,
      staff,
      reviews,
      cmsContent,
      notifications,

      // Actions
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleItemAvailability,
      addCategory,
      updateCategory,
      deleteCategory,
      createOrder,
      updateOrderStatus,
      markOrderPaid,
      updateTableStatus,
      releaseTable,
      updateReservationStatus,
      addReservation,
      updateStock,
      logRestock,
      toggleOfferStatus,
      addOffer,
      updateStaffStatus,
      replyToReview,
      updateCmsContent,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      resetDatabaseToDefaults,
      simulateIncomingLiveOrder,
      processRefund,
      setTransactions,

      // Toasts
      toasts,
      addToast,
      removeToast,
    }),
    [
      isHydrated,
      syncStatus,
      lastSyncedAt,
      currentUser,
      isAuthLoading,
      loginUser,
      logoutUser,
      switchUserRole,
      hasPermission,
      selectedOutlet,
      sidebarCollapsed,
      mobileMenuOpen,
      isCommandOpen,
      isPosOpen,
      menuItems,
      categories,
      orders,
      tables,
      reservations,
      inventory,
      customers,
      transactions,
      offers,
      staff,
      reviews,
      cmsContent,
      notifications,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleItemAvailability,
      addCategory,
      updateCategory,
      deleteCategory,
      createOrder,
      updateOrderStatus,
      markOrderPaid,
      updateTableStatus,
      releaseTable,
      updateReservationStatus,
      addReservation,
      updateStock,
      logRestock,
      toggleOfferStatus,
      addOffer,
      updateStaffStatus,
      replyToReview,
      updateCmsContent,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      resetDatabaseToDefaults,
      simulateIncomingLiveOrder,
      processRefund,
      toasts,
      addToast,
      removeToast,
      syncWithBackend,
    ]
  );

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
