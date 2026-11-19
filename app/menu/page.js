import MenuView from "@/components/sections/menu/MenuView";

export const metadata = {
  title: "Menu",
  description:
    "Explore the delicious menu at Chaat & Chill Café. Artisanal Wood-Fired Pizzas, Gourmet Burgers, Crispy Finger Chips, Artisanal Ice Creams & Sundaes, and Handcrafted Cold Shakes.",
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Menu — Chaat & Chill Café | Artisanal Pizzas, Gourmet Burgers & Cafe Delights",
    description:
      "Warning: Cravings Ahead! Handcrafted sourdough pizzas, crispy burgers, loaded finger chips, sundaes, and shakes crafted round the clock.",
    url: "https://chaatandchill.cafe/menu",
    images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80"],
  },
};

export default function MenuPage() {
  return <MenuView />;
}
