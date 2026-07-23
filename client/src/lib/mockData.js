import { villages } from "./villages";

/**
 * Sample customers (parties) — villages must match `villages.js`.
 */
export const mockCustomers = [
  {
    id: "c1",
    name: "Rajesh Kumar Sharma",
    fatherName: "Suresh Chand Sharma",
    village: "Sangod",
    phone: "9829012345",
    address: "Ward 4, Near Bus Stand, Sangod",
  },
  {
    id: "c2",
    name: "Priya Devi Meena",
    fatherName: "Ram Lal Meena",
    village: "Kanwas",
    phone: "9829023456",
    address: "Meena Mohalla, Kanwas",
  },
  {
    id: "c3",
    name: "Vikram Singh Rathore",
    fatherName: "Mahendra Singh Rathore",
    village: "Khanpur",
    phone: "9829034567",
    address: "Station Road, Khanpur",
  },
  {
    id: "c4",
    name: "Sunita Bai Gurjar",
    fatherName: "Kishore Gurjar",
    village: "Suket",
    phone: "9829045678",
    address: "Main Bazaar, Suket",
  },
  {
    id: "c5",
    name: "Mohammad Irfan",
    fatherName: "Mohammad Salim",
    village: "Ramganj Mandi",
    phone: "9829056789",
    address: "Gandhi Chowk, Ramganj Mandi",
  },
  {
    id: "c6",
    name: "Anil Kumar Prajapat",
    fatherName: "Om Prakash Prajapat",
    village: "Itawa",
    phone: "9829067890",
    address: "Itawa Road, Ward 2",
  },
  {
    id: "c7",
    name: "Kavita Jain",
    fatherName: "Ramesh Chand Jain",
    village: "Mangrol",
    phone: "9829078901",
    address: "Jain Street, Mangrol",
  },
  {
    id: "c8",
    name: "Harish Chandra Yadav",
    fatherName: "Balram Yadav",
    village: "Antah",
    phone: "9829089012",
    address: "Antah Highway Side",
  },
  {
    id: "c9",
    name: "Geeta Bai Lodha",
    fatherName: "Shankar Lal Lodha",
    village: "Baran",
    phone: "9829090123",
    address: "Lodha Colony, Baran",
  },
  {
    id: "c10",
    name: "Deepak Soni",
    fatherName: "Ghanshyam Soni",
    village: "Chhabra",
    phone: "9829101234",
    address: "Soni Market, Chhabra",
  },
  {
    id: "c11",
    name: "Rameshwar Dayma",
    fatherName: "Bheru Lal Dayma",
    village: "Kelwara",
    phone: "9829112345",
    address: "Kelwara Main Road",
  },
  {
    id: "c12",
    name: "Laxmi Narayan Teli",
    fatherName: "Radheshyam Teli",
    village: "Atru",
    phone: "9829123456",
    address: "Teli Gali, Atru",
  },
];

/** Suppliers — same shape as customers for shared UI */
export const mockSuppliers = [
  {
    id: "s1",
    name: "Sharma Kirana & General Store",
    fatherName: "Suresh Chand Sharma",
    village: "Sangod",
    phone: "9829201111",
    address: "Main Market, Sangod",
  },
  {
    id: "s2",
    name: "Meena Fertilizer Depot",
    fatherName: "Ram Lal Meena",
    village: "Kanwas",
    phone: "9829202222",
    address: "Kanwas Road, Near Pump",
  },
  {
    id: "s3",
    name: "Rathore Hardware",
    fatherName: "Mahendra Singh Rathore",
    village: "Khanpur",
    phone: "9829203333",
    address: "Industrial Area, Khanpur",
  },
  {
    id: "s4",
    name: "Gurjar Seeds & Pesticides",
    fatherName: "Kishore Gurjar",
    village: "Suket",
    phone: "9829204444",
    address: "Suket Chowk",
  },
  {
    id: "s5",
    name: "Irfan Wholesale Traders",
    fatherName: "Mohammad Salim",
    village: "Ramganj Mandi",
    phone: "9829205555",
    address: "Mandi Gate No. 2",
  },
  {
    id: "s6",
    name: "Prajapat Oil & Dal Mill",
    fatherName: "Om Prakash Prajapat",
    village: "Itawa",
    phone: "9829206666",
    address: "Itawa Bypass",
  },
  {
    id: "s7",
    name: "Jain Electronics & Mobile",
    fatherName: "Ramesh Chand Jain",
    village: "Mangrol",
    phone: "9829207777",
    address: "Mangrol Bazaar",
  },
  {
    id: "s8",
    name: "Yadav Agro Products",
    fatherName: "Balram Yadav",
    village: "Antah",
    phone: "9829208888",
    address: "Antah Main Road",
  },
  {
    id: "s9",
    name: "Lodha Building Materials",
    fatherName: "Shankar Lal Lodha",
    village: "Baran",
    phone: "9829209999",
    address: "Baran Highway",
  },
  {
    id: "s10",
    name: "Soni Textile & Garments",
    fatherName: "Ghanshyam Soni",
    village: "Chhabra",
    phone: "9829210000",
    address: "Chhabra Cloth Market",
  },
];

/**
 * Transactions — `type`: 'lena' (receivable) | 'dena' (payable).
 * `date` as ISO date string (YYYY-MM-DD).
 */
/** Customer-side transactions (linked by `partyId` = customer id) */
export const mockTransactions = [
  {
    id: "t1",
    partyId: "c1",
    partyName: "Rajesh Kumar Sharma",
    fatherName: "Suresh Chand Sharma",
    village: "Sangod",
    amount: 18500,
    type: "lena",
    date: "2026-05-14",
  },
  {
    id: "t2",
    partyName: "Priya Devi Meena",
    fatherName: "Ram Lal Meena",
    village: "Kanwas",
    amount: 6200,
    type: "dena",
    date: "2026-05-14",
  },
  {
    id: "t3",
    partyName: "Vikram Singh Rathore",
    fatherName: "Mahendra Singh Rathore",
    village: "Khanpur",
    amount: 24000,
    type: "lena",
    date: "2026-05-15",
  },
  {
    id: "t4",
    partyName: "Sunita Bai Gurjar",
    fatherName: "Kishore Gurjar",
    village: "Suket",
    amount: 3500,
    type: "dena",
    date: "2026-05-15",
  },
  {
    id: "t5",
    partyName: "Mohammad Irfan",
    fatherName: "Mohammad Salim",
    village: "Ramganj Mandi",
    amount: 12800,
    type: "lena",
    date: "2026-05-16",
  },
  {
    id: "t6",
    partyName: "Anil Kumar Prajapat",
    fatherName: "Om Prakash Prajapat",
    village: "Itawa",
    amount: 9100,
    type: "lena",
    date: "2026-05-16",
  },
  {
    id: "t7",
    partyName: "Kavita Jain",
    fatherName: "Ramesh Chand Jain",
    village: "Mangrol",
    amount: 4500,
    type: "dena",
    date: "2026-05-17",
  },
  {
    id: "t8",
    partyName: "Harish Chandra Yadav",
    fatherName: "Balram Yadav",
    village: "Antah",
    amount: 31200,
    type: "lena",
    date: "2026-05-17",
  },
  {
    id: "t9",
    partyName: "Geeta Bai Lodha",
    fatherName: "Shankar Lal Lodha",
    village: "Baran",
    amount: 2750,
    type: "dena",
    date: "2026-05-18",
  },
  {
    id: "t10",
    partyName: "Deepak Soni",
    fatherName: "Ghanshyam Soni",
    village: "Chhabra",
    amount: 15600,
    type: "lena",
    date: "2026-05-18",
  },
  {
    id: "t11",
    partyName: "Rameshwar Dayma",
    fatherName: "Bheru Lal Dayma",
    village: "Kelwara",
    amount: 8800,
    type: "lena",
    date: "2026-05-19",
  },
  {
    id: "t12",
    partyName: "Laxmi Narayan Teli",
    fatherName: "Radheshyam Teli",
    village: "Atru",
    amount: 4200,
    type: "dena",
    date: "2026-05-19",
  },
  {
    id: "t13",
    partyName: "Rajesh Kumar Sharma",
    fatherName: "Suresh Chand Sharma",
    village: "Sangod",
    amount: 5000,
    type: "lena",
    date: "2026-05-19",
  },
  {
    id: "t14",
    partyName: "Priya Devi Meena",
    fatherName: "Ram Lal Meena",
    village: "Kanwas",
    amount: 11000,
    type: "lena",
    date: "2026-05-20",
  },
  {
    id: "t15",
    partyName: "Vikram Singh Rathore",
    fatherName: "Mahendra Singh Rathore",
    village: "Khanpur",
    amount: 7300,
    type: "dena",
    date: "2026-05-20",
  },
  {
    id: "t16",
    partyName: "Mohammad Irfan",
    fatherName: "Mohammad Salim",
    village: "Ramganj Mandi",
    amount: 9900,
    type: "lena",
    date: "2026-05-13",
  },
  {
    id: "t17",
    partyName: "Harish Chandra Yadav",
    fatherName: "Balram Yadav",
    village: "Antah",
    amount: 2100,
    type: "dena",
    date: "2026-05-12",
  },
  {
    id: "t18",
    partyName: "Geeta Bai Lodha",
    fatherName: "Shankar Lal Lodha",
    village: "Bhanwargarh",
    amount: 14400,
    type: "lena",
    date: "2026-05-12",
  },
  {
    id: "t19",
    partyName: "Deepak Soni",
    fatherName: "Ghanshyam Soni",
    village: "Salpura",
    amount: 3300,
    type: "dena",
    date: "2026-05-11",
  },
];

/** Supplier-side transactions (linked by `partyId` = supplier id) */
export const mockSupplierTransactions = [
  {
    id: "st1",
    partyId: "s1",
    partyName: "Sharma Kirana & General Store",
    village: "Sangod",
    amount: 42000,
    type: "dena",
    date: "2026-05-14",
    note: "Stock purchase",
  },
  {
    id: "st2",
    partyId: "s2",
    partyName: "Meena Fertilizer Depot",
    village: "Kanwas",
    amount: 18500,
    type: "lena",
    date: "2026-05-14",
    note: "Return credit",
  },
  {
    id: "st3",
    partyId: "s3",
    partyName: "Rathore Hardware",
    village: "Khanpur",
    amount: 9200,
    type: "dena",
    date: "2026-05-15",
    note: "Tools & fittings",
  },
  {
    id: "st5",
    partyId: "s5",
    partyName: "Irfan Wholesale Traders",
    village: "Ramganj Mandi",
    amount: 56000,
    type: "dena",
    date: "2026-05-16",
    note: "Wholesale lot",
  },
  {
    id: "st6",
    partyId: "s6",
    partyName: "Prajapat Oil & Dal Mill",
    village: "Itawa",
    amount: 14800,
    type: "dena",
    date: "2026-05-16",
    note: "Oil drums",
  },
  {
    id: "st7",
    partyId: "s7",
    partyName: "Jain Electronics & Mobile",
    village: "Mangrol",
    amount: 6200,
    type: "lena",
    date: "2026-05-17",
    note: "Display units credit",
  },
  {
    id: "st8",
    partyId: "s8",
    partyName: "Yadav Agro Products",
    village: "Antah",
    amount: 23400,
    type: "dena",
    date: "2026-05-17",
    note: "Seasonal stock",
  },
  {
    id: "st10",
    partyId: "s10",
    partyName: "Soni Textile & Garments",
    village: "Chhabra",
    amount: 11200,
    type: "dena",
    date: "2026-05-18",
    note: "Garment bundle",
  },
  {
    id: "st11",
    partyId: "s1",
    partyName: "Sharma Kirana & General Store",
    village: "Sangod",
    amount: 8000,
    type: "lena",
    date: "2026-05-19",
    note: "Partial payment received",
  },
  {
    id: "st12",
    partyId: "s5",
    partyName: "Irfan Wholesale Traders",
    village: "Ramganj Mandi",
    amount: 15000,
    type: "lena",
    date: "2026-05-19",
    note: "Advance adjustment",
  },
];

/** For charts / demos — all village names from the canonical list */
export const mockVillagesList = villages;

export function getTransactionsForParty(party, transactions) {
  return transactions.filter(
    (t) => t.partyId === party.id || t.partyName === party.name
  );
}

/** Net balance: positive = You'll Get (lena), negative = You'll Give (dena) */
export function computePartyBalance(transactions) {
  const lena = transactions
    .filter((t) => t.type === "lena")
    .reduce((s, t) => s + t.amount, 0);
  const dena = transactions
    .filter((t) => t.type === "dena")
    .reduce((s, t) => s + t.amount, 0);
  const net = lena - dena;
  return {
    lena,
    dena,
    net,
    status: net > 0 ? "get" : net < 0 ? "give" : "settled",
    amountType: net >= 0 ? "lena" : "dena",
    amount: Math.abs(net),
  };
}

export function enrichParty(party, transactions) {
  const txs = getTransactionsForParty(party, transactions);
  return { ...party, ...computePartyBalance(txs), transactionCount: txs.length };
}

export function findPartyById(parties, id) {
  return parties.find((p) => p.id === id) ?? null;
}

/** All customers + suppliers for transaction party picker */
export function getAllParties() {
  return [
    ...mockCustomers.map((p) => ({ ...p, partyType: "customer" })),
    ...mockSuppliers.map((p) => ({ ...p, partyType: "supplier" })),
  ];
}

const TX_WITH_BILLS = new Set([
  "t1",
  "t3",
  "t5",
  "t8",
  "t10",
  "t14",
  "st1",
  "st3",
  "st5",
  "st8",
  "st11",
]);

function defaultDescription(tx) {
  if (tx.type === "lena") return "Amount receivable (Lena)";
  return "Amount payable (Dena)";
}

/** Unified ledger for transactions list UI */
export function getAllTransactions() {
  const normalize = (tx, source) => ({
    ...tx,
    source,
    description:
      tx.note || tx.description || defaultDescription(tx),
    hasBill: TX_WITH_BILLS.has(tx.id),
  });

  return [
    ...mockTransactions.map((t) => normalize(t, "customer")),
    ...mockSupplierTransactions.map((t) => normalize(t, "supplier")),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Daily totals for the last 7 calendar days ending `endDate` (YYYY-MM-DD).
 * Used by the dashboard bar chart (mock, deterministic).
 */
export function getLast7DaysChartData(
  endDateStr = "2026-05-20",
  transactions = mockTransactions
) {
  const end = new Date(endDateStr + "T12:00:00");
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const dayTx = transactions.filter((t) => t.date === iso);
    const lena = dayTx
      .filter((t) => t.type === "lena")
      .reduce((s, t) => s + t.amount, 0);
    const dena = dayTx
      .filter((t) => t.type === "dena")
      .reduce((s, t) => s + t.amount, 0);
    days.push({
      date: iso,
      label,
      lena,
      dena,
      total: lena + dena,
    });
  }
  return days;
}
