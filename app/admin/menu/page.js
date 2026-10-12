"use client";

import { useState } from "react";
import Image from "next/image";
import { useAdmin } from "@/lib/admin/adminStore";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminModal from "@/components/admin/ui/AdminModal";
import {
  Plus,
  Search,
  Sparkles,
  Edit2,
  Trash2,
  Check,
} from "lucide-react";

export default function AdminMenuPage() {
  const {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [gheeOnly, setGheeOnly] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Default Form State
  const defaultFormData = {
    title: "",
    category: categories[0]?.name || "Stars of the Morning Show",
    outlet: "ALL",
    price: 150,
    costPrice: 45,
    description: "",
    image: "/images/food-dosa.jpg",
    prepTime: 6,
    spiceLevel: 1,
    dietary: "Pure Veg",
    isGheeSpecial: false,
    isBestseller: false,
    isAvailable: true,
    tags: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesAvailability =
      availabilityFilter === "all"
        ? true
        : availabilityFilter === "in_stock"
        ? item.isAvailable
        : !item.isAvailable;
    const matchesGhee = !gheeOnly || item.isGheeSpecial;

    return matchesSearch && matchesCategory && matchesAvailability && matchesGhee;
  });

  const handleOpenAdd = () => {
    setFormData(defaultFormData);
    setEditingItem(null);
    setConfirmDelete(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setConfirmDelete(false);
    setFormData({
      ...item,
      outlet: item.outlet || "ALL",
      category: item.category || categories[0]?.name || "Stars of the Morning Show",
      price: item.price !== undefined ? item.price : 150,
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      isBestseller: !!item.isBestseller,
      image: item.image || "/images/food-dosa.jpg",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
    });
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e) => {
    if (e) e.preventDefault();
    if (!formData.title?.trim()) {
      alert("Please provide a title for the menu item.");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      costPrice: Number(formData.costPrice || 0),
      prepTime: Number(formData.prepTime || 5),
      spiceLevel: Number(formData.spiceLevel || 0),
      isAvailable: formData.isAvailable !== undefined ? formData.isAvailable : true,
      isBestseller: !!formData.isBestseller,
      tags: typeof formData.tags === "string"
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : formData.tags,
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, payload);
    } else {
      addMenuItem(payload);
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
    setConfirmDelete(false);
  };

  const handleDeleteItem = () => {
    if (!editingItem) return;
    deleteMenuItem(editingItem.id);
    setIsAddModalOpen(false);
    setEditingItem(null);
    setConfirmDelete(false);
  };

  const imagePresets = [
    { label: "Crispy Dosa", path: "/images/food-dosa.jpg" },
    { label: "Thatte Idli", path: "/images/food-idli.jpg" },
    { label: "Golden Vada", path: "/images/food-vada.jpg" },
    { label: "Kesari Bath", path: "/images/food-kesaribath.jpg" },
    { label: "Filter Coffee", path: "/images/food-filtercoffee.jpg" },
    { label: "Masala Chai", path: "/images/food-masalachai.jpg" },
    { label: "Papdi Chaat", path: "/images/food-chaat.jpg" },
    { label: "Pani Puri", path: "/images/food-panipuri.jpg" },
    { label: "Samosa", path: "/images/food-samosa.jpg" },
    { label: "Khali Dosa", path: "/images/food-khali-dosa.jpg" },
    { label: "Onion Dosa", path: "/images/food-onion-dosa.jpg" },
    { label: "Dahi Vada", path: "/images/food-dahivada.jpg" },
    { label: "Vada Pav", path: "/images/food-vadapav.jpg" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-google-sans font-bold tracking-tight text-cream">
            Menu & Products Management
          </h1>
          <p className="text-xs sm:text-sm text-[#A89F91] mt-0.5">
            Manage your dishes, bestseller status, stock availability, and prices.
          </p>
        </div>

        <AdminButton
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Add New Dish
        </AdminButton>
      </div>

      {/* Filter and Search Bar */}
      <AdminCard noPadding className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#7E7568] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dishes by name or category..."
              className="w-full bg-espresso border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-cream focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-espresso border border-white/10 rounded-xl px-3 py-2 text-xs text-cream focus:outline-none"
            >
              <option value="All">All Categories ({menuItems.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Stock status filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="bg-espresso border border-[#2E2721] rounded-xl px-3 py-2 text-xs text-cream focus:outline-none"
            >
              <option value="all">All Availability</option>
              <option value="in_stock">In Stock Only</option>
              <option value="sold_out">Sold Out Only</option>
            </select>

            {/* Ghee Special Toggle */}
            <button
              type="button"
              onClick={() => setGheeOnly((prev) => !prev)}
              className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                gheeOnly
                  ? "bg-amber-400/20 border-amber-400 text-amber-300 font-bold"
                  : "bg-espresso border-[#2E2721] text-[#A89F91] hover:text-cream"
              }`}
            >
              ✨ Ghee Specials Only
            </button>
          </div>
        </div>
      </AdminCard>

      {/* Menu Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`group relative bg-[#171412] border rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between ${
              item.isAvailable
                ? "border-[#2A241F] hover:border-amber-400/35 hover:shadow-2xl hover:shadow-black/70"
                : "border-rose-950/40 bg-[#13100E] opacity-85"
            }`}
          >
            {/* Dish Image */}
            <div className="relative aspect-16/10 w-full bg-[#1F1B17] overflow-hidden">
              <Image
                src={item.image || "/images/food-dosa.jpg"}
                alt={item.title}
                fill
                className={`object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
                  !item.isAvailable ? "grayscale-50 opacity-60" : ""
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#171412] via-transparent to-transparent opacity-85" />

              {/* Bestseller Label (shown if item is a bestseller) */}
              {item.isBestseller && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 shadow-md shadow-amber-500/25 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 fill-stone-950" />
                    Bestseller
                  </span>
                </div>
              )}

              {/* Sold Out Overlay Badge */}
              {!item.isAvailable && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-lg shadow-rose-950/60 border border-rose-400/30">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Dish Name, Price & Actions */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-base sm:text-lg text-[#FAF5EF] leading-snug line-clamp-1 group-hover:text-amber-200/95 transition-colors">
                    {item.title}
                  </h3>
                  <span className="font-mono text-base font-bold text-amber-400 shrink-0">
                    ₹{item.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-xs text-[#8E867B]">
                  <span>{item.category}</span>
                  {item.outlet && item.outlet !== "ALL" && (
                    <>
                      <span className="text-[#3E342A]">•</span>
                      <span className="text-[#A89F91]">{item.outlet}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Card Footer: Sold Out Toggle & Edit Button */}
              <div className="pt-4 mt-4 border-t border-[#25201B] flex items-center justify-between gap-3">
                {/* Sold Out / In Stock Status Button */}
                <button
                  type="button"
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    item.isAvailable
                      ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25"
                      : "bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/35"
                  }`}
                  title={item.isAvailable ? "Click to mark as Sold Out" : "Click to mark as Available"}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.isAvailable ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                    }`}
                  />
                  <span>{item.isAvailable ? "In Stock" : "Sold Out"}</span>
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#231F1B] hover:bg-[#2E2822] text-[#FAF5EF] hover:text-amber-300 border border-[#352D25] hover:border-amber-400/40 text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-[#2A241F] rounded-2xl bg-[#141210]">
            <p className="text-sm font-semibold text-[#FAF5EF]">No dishes found</p>
            <p className="text-xs text-[#8E867B] mt-1">Try adjusting your search or filters to see menu items.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
          setConfirmDelete(false);
        }}
        title={editingItem ? "Edit Dish" : "Add New Dish"}
        subtitle={
          editingItem
            ? "Update dish title, category, outlet availability, and price"
            : "Configure dish title, category, outlet availability, and price"
        }
        maxWidth="max-w-xl"
        footer={
          <div className="w-full flex items-center justify-between gap-3">
            {/* Delete button inside edit modal */}
            {editingItem ? (
              confirmDelete ? (
                <div className="flex items-center gap-2 animate-in fade-in duration-200">
                  <span className="text-xs text-rose-300 font-medium hidden sm:inline">
                    Delete dish?
                  </span>
                  <button
                    type="button"
                    onClick={handleDeleteItem}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md cursor-pointer transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#231F1B] hover:bg-[#2F2923] text-[#A89F91] text-xs font-medium cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/25 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Dish</span>
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <AdminButton
                variant="dark"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                  setConfirmDelete(false);
                }}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={handleSaveItem}
              >
                {editingItem ? "Save Changes" : "Create Dish"}
              </AdminButton>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          {/* Dish Title * */}
          <div>
            <label className="block text-xs font-semibold text-[#FAF5EF] mb-1.5">
              Dish Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Mysore Ghee Masala Dosa"
              required
              className="w-full bg-[#1C1814] border border-[#2E2721] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF5EF] placeholder:text-[#5E5548] focus:outline-none transition-colors"
            />
          </div>

          {/* Category * & Outlet Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#FAF5EF] mb-1.5">
                Category <span className="text-amber-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full bg-[#1C1814] border border-[#2E2721] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF5EF] focus:outline-none transition-colors cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#1C1814] text-[#FAF5EF]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#FAF5EF] mb-1.5">
                Outlet Availability
              </label>
              <select
                value={formData.outlet || "ALL"}
                onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                className="w-full bg-[#1C1814] border border-[#2E2721] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF5EF] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="ALL" className="bg-[#1C1814] text-[#FAF5EF]">All Outlets</option>
                <option value="Jamakhandi" className="bg-[#1C1814] text-[#FAF5EF]">Chaat and Chill, Jamakhandi</option>
                <option value="Rabakavi" className="bg-[#1C1814] text-[#FAF5EF]">The Shreeshailam Cafe, Rabakavi</option>
              </select>
            </div>
          </div>

          {/* Menu Price (₹) * */}
          <div>
            <label className="block text-xs font-semibold text-[#FAF5EF] mb-1.5">
              Menu Price (₹) <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">
                ₹
              </span>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="150"
                min="0"
                required
                className="w-full bg-[#1C1814] border border-[#2E2721] focus:border-amber-400 rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-mono text-[#FAF5EF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Quick Badges & Availability Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#14110F] border border-[#25201B]">
            {/* Bestseller Toggle */}
            <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-[#FAF5EF] block">Bestseller</span>
                  <span className="text-[10px] text-[#8E867B]">Highlight as customer favorite</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
            </label>

            {/* Sold Out Toggle */}
            <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    formData.isAvailable ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
                <div>
                  <span className="text-xs font-semibold text-[#FAF5EF] block">
                    {formData.isAvailable ? "In Stock" : "Sold Out"}
                  </span>
                  <span className="text-[10px] text-[#8E867B]">
                    {formData.isAvailable ? "Ready to order" : "Marked sold out"}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-400 cursor-pointer"
              />
            </label>
          </div>

          {/* Dish Image Presets */}
          <div>
            <label className="block text-xs font-semibold text-[#FAF5EF] mb-1.5">
              Dish Photography
            </label>
            <div className="flex items-center gap-3 mb-2 p-2 rounded-xl bg-[#14110F] border border-[#25201B]">
              <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-[#1C1814] border border-[#2A241F]">
                <Image
                  src={formData.image || "/images/food-dosa.jpg"}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#FAF5EF] truncate">
                  {imagePresets.find((p) => p.path === formData.image)?.label || "Custom Image"}
                </p>
                <p className="text-[10px] text-[#8E867B] truncate font-mono">
                  {formData.image}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {imagePresets.map((preset) => (
                <button
                  key={preset.path}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: preset.path })}
                  className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    formData.image === preset.path
                      ? "bg-amber-400/20 border-amber-400 text-amber-300 font-semibold"
                      : "bg-[#191613] border-[#25201B] text-[#8E867B] hover:text-[#FAF5EF] hover:border-[#382F26]"
                  }`}
                >
                  <span className="text-[10px] block truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-[#FAF5EF] mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short notes about spices, ingredients, or story..."
              className="w-full bg-[#1C1814] border border-[#2E2721] focus:border-amber-400 rounded-xl p-3 text-xs text-[#FAF5EF] placeholder:text-[#5E5548] focus:outline-none transition-colors"
            />
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

