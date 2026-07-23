"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import FormField from "@/components/ui/FormField";
import VillageCombobox from "@/components/VillageCombobox";
import { partyFormSchema } from "@/utils/partyFormSchemas";

export default function PartyAddForm({
  title,
  backHref,
  backLabel,
  entityLabel = "party",
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(partyFormSchema),
    defaultValues: {
      name: "",
      fatherName: "",
      phone: "",
      address: "",
      village: "",
    },
  });

  function onSubmit() {
    toast.success(`${entityLabel} saved (UI demo only)`);
    reset();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="glass-card p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserPlus className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Name"
            error={errors.name?.message}
            required
          >
            <input type="text" className="glass-input" {...register("name")} />
          </FormField>

          <FormField
            label="Father's Name"
            error={errors.fatherName?.message}
            required
          >
            <input
              type="text"
              className="glass-input"
              {...register("fatherName")}
            />
          </FormField>

          <FormField label="Mobile" error={errors.phone?.message} required>
            <input
              type="tel"
              className="glass-input"
              placeholder="9876543210"
              maxLength={10}
              {...register("phone")}
            />
          </FormField>

          <FormField label="Address" error={errors.address?.message} required>
            <textarea
              rows={3}
              className="glass-input resize-none"
              {...register("address")}
            />
          </FormField>

          <FormField
            label="Village / City"
            error={errors.village?.message}
            required
          >
            <Controller
              name="village"
              control={control}
              render={({ field }) => (
                <VillageCombobox
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.village?.message}
                />
              )}
            />
          </FormField>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              Save {entityLabel}
            </button>
            <Link href={backHref} className="btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
