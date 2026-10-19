"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin/adminStore";
import AdminModal from "./AdminModal";
import AdminButton from "./AdminButton";
import { Plus, Minus, Trash2, ShoppingCart, IndianRupee, CheckCircle2 } from "lucide-react";

export default function QuickPosModal() {
  const {
    isPosOpen,
    setIsPosOpen,
    menuItems,
    tables,
    selectedOutlet,
    createOrder,
  } = useAdmin();

  const [orderType, setOrderType] = useState("Dine-in");
  const [selectedTable, setSelectedTable] = useState("T-01");
  const [customerName, setCustomerName] = useState("Walk-in Guest");
  const [customerPhone, setCustomerPhone] = useState("+91 ");
  const [paymentMode, setPaymentMode] = useState("UPI / PhonePe");
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const outlet = selectedOutlet === "ALL" ? "Jamakhandi" : selectedOutlet;

  // Filter available tables for the outlet
  const availableTables = tables.filter(
    (t) => t.outlet === outlet
  );

  const categories = ["All", ...new Set(menuItems.map((m) => m.category))];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev[item.id];
      if (existing) {
        return { ...prev, [item.id]: { ...existing, quantity: existing.quantity + 1 } };
      }
      return { ...prev, [item.id]: { item, quantity: 1, notes: "" } };
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: { ...existing, quantity: newQty } };
    });
  };

  const cartList = Object.values(cart);
  const subtotal = cartList.reduce(
    (sum, line) => sum + Number(line.item.price) * line.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + tax;

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (cartList.length === 0) {
      alert("Please add at least one item to the order.");
      return;
    }

    const items = cartList.map((line) => ({
      id: line.item.id,
      title: line.item.title,
      quantity: line.quantity,
      price: line.item.price,
      notes: line.notes || "",
    }));

    const parcelNumber = ((cartList.length * 17 + 11) % 80) + 10;
    createOrder({
      outlet,
      type: orderType,
      table: orderType === "Dine-in" ? selectedTable : `Parcel #${parcelNumber}`,
      customer: {
        name: customerName.trim() || "Walk-in Guest",
        phone: customerPhone.trim() || "+91 99999 00000",
      },
      items,
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMode,
    });

    // Reset and close
    setCart({});
    setIsPosOpen(false);
  };

  return (
    <AdminModal
      isOpen={isPosOpen}
      onClose={() => setIsPosOpen(false)}
      title="Quick POS Biller & Order Terminal"
      subtitle={`Outlet: ${outlet} • High-Velocity Counter Billing`}
      maxWidth="max-w-4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-125">
        {/* Left Col: Menu Item Picker */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Search & Category Filter */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dishes..."
              className="flex-1 bg-[#141210] border border-[#26201B] rounded-xl px-3 py-2 text-sm text-[#F7F4EE] placeholder:text-[#6E665C] focus:border-gold/50 focus:outline-hidden"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 menu-scroll text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gold text-[#12100E] font-semibold shadow-xs"
                    : "bg-[#141210] border border-[#221C16] text-[#8E867B] hover:text-[#EDE8E1]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Item Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-90 overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const inCartQty = cart[item.id]?.quantity || 0;
              return (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    inCartQty > 0
                      ? "bg-gold/10 border-gold/40 shadow-md"
                      : "bg-[#13110F] border-[#221C16] hover:border-[#382F26]"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="font-medium text-xs text-[#F7F4EE] line-clamp-1">
                        {item.title}
                      </h5>
                      {inCartQty > 0 && (
                        <span className="w-5 h-5 rounded-full bg-gold text-[#12100E] font-bold text-[10px] flex items-center justify-center shrink-0">
                          {inCartQty}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8E867B] mt-0.5 line-clamp-1">
                      {item.category}
                    </p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gold font-mono">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] text-[#7E7568] uppercase font-mono">
                      +{item.prepTime || 5}m
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Bill Summary & Checkout */}
        <div className="lg:col-span-5 bg-[#0D0B0A] border border-[#221C16] rounded-xl p-4 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Order Type & Table */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8E867B] tracking-wider">
                  Type
                </label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full mt-1 bg-[#141210] border border-[#241F1A] rounded-lg px-2.5 py-1.5 text-xs text-cream"
                >
                  <option value="Dine-in">Dine-in</option>
                  <option value="Takeaway">Takeaway</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div>

              {orderType === "Dine-in" && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8E867B] tracking-wider">
                    Table
                  </label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full mt-1 bg-[#141210] border border-[#241F1A] rounded-lg px-2.5 py-1.5 text-xs text-cream"
                  >
                    {availableTables.map((t) => (
                      <option key={t.id} value={t.code}>
                        {t.code} ({t.section} • {t.capacity}p)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Customer Name */}
            <div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Guest Name (optional)"
                className="w-full bg-[#141210] border border-[#241F1A] rounded-lg px-2.5 py-1.5 text-xs text-cream focus:outline-hidden"
              />
            </div>

            {/* Cart Items List */}
            <div className="border-t border-b border-[#25201B] py-2 max-h-42.5 overflow-y-auto space-y-2">
              {cartList.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#7E7568] flex flex-col items-center gap-1.5">
                  <ShoppingCart className="w-5 h-5 opacity-40" />
                  <span>Tap dishes on the left to add to bill</span>
                </div>
              ) : (
                cartList.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 text-xs py-1"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-cream truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#8E867B] font-mono">
                        ₹{item.price} × {quantity} = ₹{Number(item.price) * quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-[#25201B] hover:bg-[#322A23] flex items-center justify-center text-[#D8CEBF] cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs text-cream">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-[#25201B] hover:bg-[#322A23] flex items-center justify-center text-[#D8CEBF] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Payment Mode */}
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8E867B] tracking-wider block mb-1">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {["UPI / PhonePe", "Cash at Desk", "Card / POS"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer text-[11px] ${
                      paymentMode === mode
                        ? "bg-gold/20 border border-gold text-[#E6BC65]"
                        : "bg-[#1C1814] border border-[#2E2721] text-[#A89F91]"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Totals & Submit */}
          <div className="pt-3 border-t border-[#25201B] space-y-2 mt-2">
            <div className="flex justify-between text-xs text-[#A89F91]">
              <span>Subtotal</span>
              <span className="font-mono text-cream">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#A89F91]">
              <span>GST (5%)</span>
              <span className="font-mono text-cream">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-cream pt-1 border-t border-[#25201B]">
              <span>Total Bill</span>
              <span className="font-mono text-base text-[#E6BC65]">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <AdminButton
              variant="primary"
              size="md"
              className="w-full mt-2"
              onClick={handleCreateOrder}
              disabled={cartList.length === 0}
              icon={CheckCircle2}
            >
              Punch Order & Print KOT
            </AdminButton>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
