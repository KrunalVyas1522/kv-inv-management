import headphones from "@/assets/product-headphones.jpg";
import keyboard from "@/assets/product-keyboard.jpg";
import mug from "@/assets/product-mug.jpg";
import tshirt from "@/assets/product-tshirt.jpg";
import drill from "@/assets/product-drill.jpg";

export type Category = "Electronics" | "Apparel" | "Home" | "Tools" | "Beverages";

export interface Product {
  sku: string;
  name: string;
  category: Category;
  stock: number;
  reorderLevel: number;
  unitPrice: number;
  supplierId: string;
  image?: string;
  description: string;
}

export const productImages: Record<string, string> = {
  "ELEC-001": headphones,
  "ELEC-002": keyboard,
  "HOME-001": mug,
  "APP-001": tshirt,
  "TOOL-001": drill,
};

export const inventory: Product[] = [
  {
    sku: "ELEC-001",
    name: "Aurora Wireless Headphones",
    category: "Electronics",
    stock: 142,
    reorderLevel: 40,
    unitPrice: 249.0,
    supplierId: "SUP-01",
    image: headphones,
    description: "Premium noise-cancelling over-ear headphones with 40h battery life.",
  },
  {
    sku: "ELEC-002",
    name: "Nimbus Mechanical Keyboard",
    category: "Electronics",
    stock: 18,
    reorderLevel: 25,
    unitPrice: 179.0,
    supplierId: "SUP-01",
    image: keyboard,
    description: "Tenkeyless mechanical keyboard with hot-swappable teal-lit switches.",
  },
  {
    sku: "ELEC-003",
    name: "Pulse Wireless Mouse",
    category: "Electronics",
    stock: 0,
    reorderLevel: 30,
    unitPrice: 79.0,
    supplierId: "SUP-01",
    description: "Ergonomic wireless mouse with 8000 DPI sensor.",
  },
  {
    sku: "ELEC-004",
    name: "Lumen 27\" 4K Monitor",
    category: "Electronics",
    stock: 24,
    reorderLevel: 10,
    unitPrice: 549.0,
    supplierId: "SUP-02",
    description: "Color-accurate 4K IPS display for creative pros.",
  },
  {
    sku: "ELEC-005",
    name: "Echo USB-C Hub",
    category: "Electronics",
    stock: 87,
    reorderLevel: 30,
    unitPrice: 59.0,
    supplierId: "SUP-02",
    description: "7-in-1 USB-C hub with 4K HDMI passthrough.",
  },
  {
    sku: "ELEC-006",
    name: "Halo Smart Speaker",
    category: "Electronics",
    stock: 9,
    reorderLevel: 15,
    unitPrice: 129.0,
    supplierId: "SUP-02",
    description: "Compact smart speaker with rich room-filling sound.",
  },
  {
    sku: "APP-001",
    name: "Aether Organic Tee",
    category: "Apparel",
    stock: 312,
    reorderLevel: 80,
    unitPrice: 38.0,
    supplierId: "SUP-03",
    image: tshirt,
    description: "100% organic cotton premium t-shirt, charcoal.",
  },
  {
    sku: "APP-002",
    name: "Drift Hooded Sweatshirt",
    category: "Apparel",
    stock: 96,
    reorderLevel: 50,
    unitPrice: 78.0,
    supplierId: "SUP-03",
    description: "Heavyweight fleece hoodie with kangaroo pocket.",
  },
  {
    sku: "APP-003",
    name: "Trail Performance Cap",
    category: "Apparel",
    stock: 14,
    reorderLevel: 30,
    unitPrice: 28.0,
    supplierId: "SUP-03",
    description: "Lightweight breathable running cap.",
  },
  {
    sku: "APP-004",
    name: "Forge Denim Jacket",
    category: "Apparel",
    stock: 0,
    reorderLevel: 20,
    unitPrice: 145.0,
    supplierId: "SUP-03",
    description: "Selvedge denim jacket with reinforced stitching.",
  },
  {
    sku: "APP-005",
    name: "Stride Wool Socks (3pk)",
    category: "Apparel",
    stock: 220,
    reorderLevel: 100,
    unitPrice: 24.0,
    supplierId: "SUP-03",
    description: "Merino wool blend hiking socks.",
  },
  {
    sku: "HOME-001",
    name: "Verdant Ceramic Mug",
    category: "Home",
    stock: 54,
    reorderLevel: 40,
    unitPrice: 22.0,
    supplierId: "SUP-04",
    image: mug,
    description: "Hand-glazed forest green stoneware mug, 12oz.",
  },
  {
    sku: "HOME-002",
    name: "Linden Linen Throw",
    category: "Home",
    stock: 32,
    reorderLevel: 20,
    unitPrice: 89.0,
    supplierId: "SUP-04",
    description: "Stonewashed Belgian linen throw blanket.",
  },
  {
    sku: "HOME-003",
    name: "Glow Soy Candle",
    category: "Home",
    stock: 11,
    reorderLevel: 30,
    unitPrice: 34.0,
    supplierId: "SUP-04",
    description: "Hand-poured soy candle, cedarwood + sage.",
  },
  {
    sku: "HOME-004",
    name: "Atrium Brass Lamp",
    category: "Home",
    stock: 7,
    reorderLevel: 12,
    unitPrice: 189.0,
    supplierId: "SUP-04",
    description: "Adjustable brass desk lamp with warm LED.",
  },
  {
    sku: "HOME-005",
    name: "Slate Cutting Board",
    category: "Home",
    stock: 48,
    reorderLevel: 25,
    unitPrice: 52.0,
    supplierId: "SUP-04",
    description: "End-grain walnut cutting board with juice groove.",
  },
  {
    sku: "TOOL-001",
    name: "Forge 18V Cordless Drill",
    category: "Tools",
    stock: 36,
    reorderLevel: 15,
    unitPrice: 199.0,
    supplierId: "SUP-05",
    image: drill,
    description: "Brushless 18V drill with two batteries and case.",
  },
  {
    sku: "TOOL-002",
    name: "Apex Driver Bit Set (32pc)",
    category: "Tools",
    stock: 88,
    reorderLevel: 40,
    unitPrice: 39.0,
    supplierId: "SUP-05",
    description: "Impact-rated chromoly driver bit set.",
  },
  {
    sku: "TOOL-003",
    name: "Beam Laser Level",
    category: "Tools",
    stock: 5,
    reorderLevel: 10,
    unitPrice: 119.0,
    supplierId: "SUP-05",
    description: "Self-leveling cross-line laser, green beam.",
  },
  {
    sku: "TOOL-004",
    name: "Tradesman Tape Measure",
    category: "Tools",
    stock: 162,
    reorderLevel: 60,
    unitPrice: 18.0,
    supplierId: "SUP-05",
    description: "Magnetic tip 25ft tape measure.",
  },
  {
    sku: "BEV-001",
    name: "Single Origin Coffee 1kg",
    category: "Beverages",
    stock: 74,
    reorderLevel: 50,
    unitPrice: 32.0,
    supplierId: "SUP-06",
    description: "Whole bean Ethiopian Yirgacheffe.",
  },
  {
    sku: "BEV-002",
    name: "Hojicha Loose Leaf Tea",
    category: "Beverages",
    stock: 19,
    reorderLevel: 25,
    unitPrice: 24.0,
    supplierId: "SUP-06",
    description: "Roasted Japanese green tea, 200g tin.",
  },
  {
    sku: "BEV-003",
    name: "Sparkling Yuzu 12pk",
    category: "Beverages",
    stock: 0,
    reorderLevel: 20,
    unitPrice: 36.0,
    supplierId: "SUP-06",
    description: "Naturally flavored sparkling water, case of 12.",
  },
  {
    sku: "BEV-004",
    name: "Cold Brew Concentrate",
    category: "Beverages",
    stock: 41,
    reorderLevel: 30,
    unitPrice: 28.0,
    supplierId: "SUP-06",
    description: "Smooth cold brew coffee concentrate, 32oz.",
  },
];

export type Status = "in-stock" | "low" | "out";

export function getStatus(p: { stock: number; reorderLevel: number }): Status {
  if (p.stock === 0) return "out";
  if (p.stock <= p.reorderLevel) return "low";
  return "in-stock";
}

export const categories: Category[] = [
  "Electronics",
  "Apparel",
  "Home",
  "Tools",
  "Beverages",
];
