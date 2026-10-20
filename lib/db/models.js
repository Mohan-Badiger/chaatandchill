import mongoose from "mongoose";

// Helper to avoid recompiling models in Next.js hot-reloads
function getOrCreateModel(modelName, schema) {
  return mongoose.models[modelName] || mongoose.model(modelName, schema);
}

// 1. Order Schema
const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    outlet: { type: String, default: "Jamakhandi" },
    type: { type: String, default: "Dine-in" },
    table: { type: String, default: "T-01" },
    customer: {
      name: { type: String, default: "Walk-in Guest" },
      phone: { type: String, default: "+91 99999 00000" },
      email: { type: String, default: "" },
    },
    items: [
      {
        id: String,
        title: String,
        quantity: Number,
        price: Number,
        notes: { type: String, default: "" },
      },
    ],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paymentMode: { type: String, default: "UPI / PhonePe" },
    paymentStatus: { type: String, default: "unpaid" },
    status: { type: String, default: "pending" },
    kotPrinted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 2. Menu Item Schema
const MenuItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    outlet: { type: String, default: "ALL" },
    price: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: "/images/food-dosa.jpg" },
    prepTime: { type: Number, default: 5 },
    spiceLevel: { type: Number, default: 1 },
    dietary: { type: String, default: "Pure Veg" },
    isGheeSpecial: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    ordersCount: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

// 3. Table Schema
const TableSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true },
    name: { type: String, default: "" },
    capacity: { type: Number, default: 4 },
    outlet: { type: String, default: "Jamakhandi" },
    section: { type: String, default: "AC Family Dining" },
    status: { type: String, default: "available" },
    currentOrder: { type: String, default: null },
    guests: { type: Number, default: 2 },
    elapsedMins: { type: Number, default: 0 },
    reservedFor: { type: String, default: null },
  },
  { timestamps: true }
);

// 4. Reservation Schema
const ReservationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    bookingCode: { type: String, required: true, index: true },
    outlet: { type: String, default: "Jamakhandi" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    guests: { type: Number, default: 2 },
    date: { type: String, required: true },
    time: { type: String, required: true },
    tableAssigned: { type: String, default: "T-01" },
    status: { type: String, default: "confirmed" },
    notes: { type: String, default: "" },
    source: { type: String, default: "Website Concierge" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

// 5. Inventory Schema
const InventorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: "Raw Materials" },
    currentStock: { type: Number, default: 0 },
    unit: { type: String, default: "kg" },
    minThreshold: { type: Number, default: 10 },
    costPerUnit: { type: Number, default: 0 },
    supplier: { type: String, default: "" },
    supplierPhone: { type: String, default: "" },
    lastRestocked: { type: String, default: "" },
    status: { type: String, default: "good" },
    outlet: { type: String, default: "ALL" },
  },
  { timestamps: true }
);

// 6. Category Schema
const CategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    itemsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// 7. Customer Schema
const CustomerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    totalOrders: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    lastVisit: { type: String, default: "" },
    favoriteItem: { type: String, default: "" },
    membership: { type: String, default: "Silver" },
  },
  { timestamps: true }
);

// 8. Transaction Schema
const TransactionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true },
    outlet: { type: String, default: "Jamakhandi" },
    customer: { type: String, default: "Walk-in Guest" },
    amount: { type: Number, required: true },
    mode: { type: String, default: "UPI / PhonePe" },
    gatewayRef: { type: String, default: "" },
    status: { type: String, default: "Successful" },
    timestamp: { type: String, default: () => new Date().toISOString() },
    refundReason: { type: String, default: "" },
  },
  { timestamps: true }
);

// 9. Offer Schema
const OfferSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    discountType: { type: String, default: "percentage" },
    value: { type: Number, default: 0 },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    validUntil: { type: String, default: "" },
    outlet: { type: String, default: "ALL" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 10. Staff Schema
const StaffSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, default: "Staff" },
    outlet: { type: String, default: "Jamakhandi" },
    phone: { type: String, default: "" },
    salary: { type: Number, default: 0 },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

// 11. Review Schema
const ReviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    author: { type: String, required: true },
    rating: { type: Number, default: 5 },
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    source: { type: String, default: "Website" },
    comment: { type: String, default: "" },
    outlet: { type: String, default: "Jamakhandi" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

// 12. Notification Schema
const NotificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: { type: String, default: "general" },
    priority: { type: String, default: "normal" },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    time: { type: String, default: "Just now" },
    read: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

// 13. System Doc Schema (for cmsContent, settings, and metadata snapshots)
const SystemDocSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const OrderModel = getOrCreateModel("Order", OrderSchema);
export const MenuItemModel = getOrCreateModel("MenuItem", MenuItemSchema);
export const TableModel = getOrCreateModel("Table", TableSchema);
export const ReservationModel = getOrCreateModel("Reservation", ReservationSchema);
export const InventoryModel = getOrCreateModel("Inventory", InventorySchema);
export const CategoryModel = getOrCreateModel("Category", CategorySchema);
export const CustomerModel = getOrCreateModel("Customer", CustomerSchema);
export const TransactionModel = getOrCreateModel("Transaction", TransactionSchema);
export const OfferModel = getOrCreateModel("Offer", OfferSchema);
export const StaffModel = getOrCreateModel("Staff", StaffSchema);
export const ReviewModel = getOrCreateModel("Review", ReviewSchema);
export const NotificationModel = getOrCreateModel("Notification", NotificationSchema);
export const SystemDocModel = getOrCreateModel("SystemDoc", SystemDocSchema);
