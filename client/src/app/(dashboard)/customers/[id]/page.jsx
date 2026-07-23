"use client";

import { useParams } from "next/navigation";
import PartyDetailPage from "@/components/PartyDetailPage";
import {
  findPartyById,
  mockCustomers,
  mockTransactions,
} from "@/lib/mockData";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const party = findPartyById(mockCustomers, id);

  return (
    <PartyDetailPage
      party={party}
      transactions={mockTransactions}
      backHref="/customers"
      backLabel="Back to Customers"
    />
  );
}
