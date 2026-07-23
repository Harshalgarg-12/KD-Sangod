"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PARTY_TYPES, CUSTOMER_CATEGORIES } from "@/lib/constants";
import { createParty, getLocations } from "@/services/partyService";

const initialFormState = {
  name: "",
  phone: "",
  partyType: "",
  customerCategory: "",
  location: "",
};

export default function AddPartyForm({ onSuccess }) {
  const [form, setForm] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadLocations() {
      setLocationsLoading(true);
      setLocationsError(false);

      try {
        const result = await getLocations();
        if (!cancelled) {
          // result.data is { results: [...], totalPages, ... } — we need the results array
          setLocations(result.data?.results ?? result.data ?? []);
        }
      } catch {
        if (!cancelled) {
          setLocationsError(true);
          toast.error("Failed to load locations. Please refresh and try again.");
        }
      } finally {
        if (!cancelled) {
          setLocationsLoading(false);
        }
      }
    }

    loadLocations();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "partyType" && value !== PARTY_TYPES.CUSTOMER) {
        next.customerCategory = "";
      }

      return next;
    });
  }

  const isCustomer = form.partyType === PARTY_TYPES.CUSTOMER;

  const isFormIncomplete =
    !form.name.trim() ||
    !form.phone.trim() ||
    !form.partyType ||
    !form.location ||
    (isCustomer && !form.customerCategory);

  const isSubmitDisabled =
    isSubmitting || isFormIncomplete || locationsLoading || locationsError;

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitDisabled) return;

    setIsSubmitting(true);

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      partyType: form.partyType,
      location: form.location,
    };

    if (isCustomer) {
      payload.customerCategory = form.customerCategory;
    }

    try {
      await toast.promise(createParty(payload), {
        pending: "Saving party…",
        success: "Party added successfully!",
        error: {
          render({ data: err }) {
            return (
              err?.response?.data?.message ||
              "Something went wrong. Please try again."
            );
          },
        },
      });

      setForm(initialFormState);
      onSuccess?.();
    } catch {
      // toast.promise already surfaced the error
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card mx-auto max-w-lg space-y-4 p-6 sm:p-8"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Add Party
      </h2>

      <div>
        <label htmlFor="party-name" className="mb-1 block text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="party-name"
          type="text"
          className="glass-input"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="party-phone" className="mb-1 block text-sm font-medium">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          id="party-phone"
          type="tel"
          className="glass-input"
          placeholder="9876543210"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          required
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          Party Type <span className="text-red-500">*</span>
        </legend>
        <div className="flex flex-wrap gap-4">
          {Object.values(PARTY_TYPES).map((type) => (
            <label
              key={type}
              htmlFor={`party-type-${type}`}
              className="inline-flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                id={`party-type-${type}`}
                type="radio"
                name="partyType"
                value={type}
                checked={form.partyType === type}
                onChange={(e) => updateField("partyType", e.target.value)}
                className="text-primary focus:ring-primary"
              />
              {type === PARTY_TYPES.CUSTOMER ? "Customer" : "Supplier"}
            </label>
          ))}
        </div>
      </fieldset>

      {isCustomer && (
        <div>
          <label
            htmlFor="customer-category"
            className="mb-1 block text-sm font-medium"
          >
            Customer Category <span className="text-red-500">*</span>
          </label>
          <select
            id="customer-category"
            className="glass-input"
            value={form.customerCategory}
            onChange={(e) => updateField("customerCategory", e.target.value)}
            required
          >
            <option value="">Select category</option>
            {Object.values(CUSTOMER_CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {category === CUSTOMER_CATEGORIES.SHOPKEEPER
                  ? "Shopkeeper"
                  : "Regular"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="party-location" className="mb-1 block text-sm font-medium">
          Location <span className="text-red-500">*</span>
        </label>
        <select
          id="party-location"
          className="glass-input"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          disabled={locationsLoading || locationsError}
          required
        >
          {locationsLoading && (
            <option value="">Loading locations…</option>
          )}
          {locationsError && (
            <option value="">Couldn&apos;t load locations</option>
          )}
          {!locationsLoading && !locationsError && (
            <>
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="btn-primary w-full"
      >
        {isSubmitting ? "Saving…" : "Save Party"}
      </button>
    </form>
  );
}
