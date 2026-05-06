export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  leadTimeDays: number;
  region: string;
}

export const suppliers: Supplier[] = [
  {
    id: "SUP-01",
    name: "Northwind Electronics",
    contact: "Mira Chen",
    email: "mira@northwind.co",
    leadTimeDays: 7,
    region: "Asia Pacific",
  },
  {
    id: "SUP-02",
    name: "Lumen Display Co.",
    contact: "Daniel Park",
    email: "daniel@lumendisplay.com",
    leadTimeDays: 14,
    region: "North America",
  },
  {
    id: "SUP-03",
    name: "Aether Apparel Mills",
    contact: "Sofia Marín",
    email: "sofia@aether-mills.com",
    leadTimeDays: 21,
    region: "Europe",
  },
  {
    id: "SUP-04",
    name: "Linden Home Goods",
    contact: "Henry Otieno",
    email: "henry@lindenhome.co",
    leadTimeDays: 10,
    region: "Europe",
  },
  {
    id: "SUP-05",
    name: "Forge Industrial Supply",
    contact: "Kara Whitfield",
    email: "kara@forgesupply.com",
    leadTimeDays: 5,
    region: "North America",
  },
  {
    id: "SUP-06",
    name: "Verdant Beverage Co.",
    contact: "Theo Nakamura",
    email: "theo@verdantbev.com",
    leadTimeDays: 9,
    region: "Asia Pacific",
  },
];

export function getSupplier(id: string): Supplier | undefined {
  return suppliers.find((s) => s.id === id);
}
