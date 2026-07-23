"use client";

import { useParams } from "next/navigation";
import PartyDetailPage from "@/components/PartyDetailPage";
import {
  findPartyById,
  mockSuppliers,
  mockSupplierTransactions,
} from "@/lib/mockData";

export default function SupplierDetailPage() {
  const { id } = useParams();
  const party = findPartyById(mockSuppliers, id);

  return (
    <PartyDetailPage
      party={party}
      transactions={mockSupplierTransactions}
      backHref="/suppliers"
      backLabel="Back to Suppliers"
    />
  );
}
