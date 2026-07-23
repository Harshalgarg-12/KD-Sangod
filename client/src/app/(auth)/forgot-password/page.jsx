"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // BUG FIX: was yupResolver
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import FormField from "@/components/ui/FormField";
import { forgotPasswordSchema } from "@/utils/validationSchemas"; // BUG FIX: schema was missing, now added

// ForgotPasswordPage — lets a user request a password reset.
// Currently uses phone number since that's the login identifier in this app.
export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema), // BUG FIX: was yupResolver
  });

  async function onSubmit(values) {
    try {
      toast.success("If this phone number is registered, you will receive a reset link.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="glass-card p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("resetPassword")}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{t("resetInstructions")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label={t("phone")} error={errors.phone?.message} required>
          <input
            type="tel"
            className="glass-input"
            placeholder="9876543210"
            maxLength={10}
            {...register("phone")}
          />
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {t("sendResetLink")}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToLogin")}
      </Link>
    </div>
  );
}
