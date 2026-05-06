export type MovementType = "in" | "out";

export interface Movement {
  id: string;
  sku: string;
  type: MovementType;
  quantity: number;
  reason: string;
  date: string; // ISO
}

const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const iso = (offsetDays: number, hours = 0) =>
  new Date(now - offsetDays * day - hours * 3600 * 1000).toISOString();

export const movements: Movement[] = [
  { id: "M-001", sku: "ELEC-001", type: "out", quantity: 12, reason: "Sale", date: iso(0, 1) },
  { id: "M-002", sku: "APP-001", type: "out", quantity: 24, reason: "Sale", date: iso(0, 3) },
  { id: "M-003", sku: "ELEC-002", type: "in", quantity: 50, reason: "Restock", date: iso(0, 5) },
  { id: "M-004", sku: "HOME-003", type: "out", quantity: 8, reason: "Sale", date: iso(0, 7) },
  { id: "M-005", sku: "TOOL-001", type: "out", quantity: 4, reason: "Sale", date: iso(1, 1) },
  { id: "M-006", sku: "BEV-001", type: "in", quantity: 60, reason: "Restock", date: iso(1, 4) },
  { id: "M-007", sku: "ELEC-003", type: "out", quantity: 15, reason: "Sale", date: iso(1, 6) },
  { id: "M-008", sku: "APP-002", type: "out", quantity: 9, reason: "Sale", date: iso(1, 9) },
  { id: "M-009", sku: "HOME-001", type: "in", quantity: 30, reason: "Restock", date: iso(2, 2) },
  { id: "M-010", sku: "TOOL-003", type: "out", quantity: 3, reason: "Sale", date: iso(2, 5) },
  { id: "M-011", sku: "BEV-002", type: "out", quantity: 6, reason: "Sale", date: iso(2, 8) },
  { id: "M-012", sku: "ELEC-004", type: "in", quantity: 12, reason: "Restock", date: iso(3, 1) },
  { id: "M-013", sku: "APP-003", type: "out", quantity: 11, reason: "Sale", date: iso(3, 4) },
  { id: "M-014", sku: "HOME-004", type: "out", quantity: 2, reason: "Damaged", date: iso(3, 7) },
  { id: "M-015", sku: "TOOL-002", type: "out", quantity: 18, reason: "Sale", date: iso(3, 10) },
  { id: "M-016", sku: "ELEC-005", type: "in", quantity: 40, reason: "Restock", date: iso(4, 2) },
  { id: "M-017", sku: "APP-005", type: "out", quantity: 32, reason: "Sale", date: iso(4, 5) },
  { id: "M-018", sku: "BEV-004", type: "in", quantity: 24, reason: "Restock", date: iso(4, 8) },
  { id: "M-019", sku: "HOME-005", type: "out", quantity: 7, reason: "Sale", date: iso(5, 1) },
  { id: "M-020", sku: "ELEC-006", type: "out", quantity: 4, reason: "Sale", date: iso(5, 4) },
  { id: "M-021", sku: "TOOL-004", type: "in", quantity: 80, reason: "Restock", date: iso(5, 7) },
  { id: "M-022", sku: "APP-001", type: "in", quantity: 100, reason: "Restock", date: iso(6, 2) },
  { id: "M-023", sku: "BEV-003", type: "out", quantity: 20, reason: "Sale", date: iso(6, 5) },
  { id: "M-024", sku: "ELEC-001", type: "in", quantity: 80, reason: "Restock", date: iso(6, 9) },
  { id: "M-025", sku: "HOME-002", type: "out", quantity: 5, reason: "Sale", date: iso(7, 1) },
  { id: "M-026", sku: "TOOL-001", type: "in", quantity: 20, reason: "Restock", date: iso(7, 4) },
  { id: "M-027", sku: "APP-004", type: "out", quantity: 6, reason: "Sale", date: iso(8, 2) },
  { id: "M-028", sku: "BEV-001", type: "out", quantity: 14, reason: "Sale", date: iso(8, 6) },
  { id: "M-029", sku: "ELEC-002", type: "out", quantity: 7, reason: "Sale", date: iso(9, 3) },
  { id: "M-030", sku: "HOME-001", type: "out", quantity: 11, reason: "Sale", date: iso(9, 8) },
];
