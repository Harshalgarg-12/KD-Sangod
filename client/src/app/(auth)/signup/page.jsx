"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // BUG FIX: was yupResolver — schema is Zod, not Yup
import { Loader2, UserPlus, Store } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import FormField from "@/components/ui/FormField";
import { signupSchema } from "@/utils/validationSchemas";
import { signupUser } from "@/services/authService";

// SignupPage — lets a new admin create an account.
// After successful signup, the token is saved by authService and we redirect to /dashboard.
export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();

  // react-hook-form manages all form state, validation, and error messages.
  // zodResolver connects our Zod schema to react-hook-form.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema), // BUG FIX: was yupResolver
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      shopName: "",
      fathersName: "",
      villageCity: "",
    },
  });

  // Called when the form passes validation.
  // Sends the data to the backend, then redirects to dashboard on success.
  async function onSubmit(values) {
    try {
      const data = await signupUser(values);
      if (data?.success) {
        toast.success("Account created successfully!");
        router.push("/dashboard");
        router.refresh(); // tells Next.js middleware to re-check auth
      } else {
        toast.error(data?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Signup failed. Please try again."
      );
    }
  }

  return (
    <div className="glass-card max-h-[90vh] overflow-y-auto p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {t("createAccount")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t("tagline")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Full Name — maps to Admin.name in backend */}
        <FormField
          label={t("fullName")}
          error={errors.name?.message}
          required
        >
          <input
            type="text"
            className="glass-input"
            placeholder="e.g. Harshal Garg"
            {...register("name")}
          />
        </FormField>

        {/* Phone — used as the login identifier */}
        <FormField label={t("phone")} error={errors.phone?.message} required>
          <input
            type="tel"
            className="glass-input"
            placeholder="9876543210"
            maxLength={10}
            {...register("phone")}
          />
        </FormField>

        {/* Shop Name — optional */}
        <FormField
          label="Shop Name"
          error={errors.shopName?.message}
        >
          <input
            type="text"
            className="glass-input"
            placeholder="e.g. KD Sangod General Store"
            {...register("shopName")}
          />
        </FormField>

        {/* Father's Name — optional */}
        <FormField
          label={t("fatherName")}
          error={errors.fathersName?.message}
        >
          <input
            type="text"
            className="glass-input"
            placeholder="e.g. Ram Kumar Garg"
            {...register("fathersName")}
          />
        </FormField>

        {/* Village / City — optional */}
        <FormField
          label={t("villageCity")}
          error={errors.villageCity?.message}
        >
          <input
            type="text"
            className="glass-input"
            placeholder="e.g. Sangod"
            {...register("villageCity")}
          />
        </FormField>

        {/* Password */}
        <FormField
          label={t("password")}
          error={errors.password?.message}
          required
        >
          <input
            type="password"
            className="glass-input"
            {...register("password")}
          />
        </FormField>

        {/* Confirm Password */}
        <FormField
          label={t("confirmPassword")}
          error={errors.confirmPassword?.message}
          required
        >
          <input
            type="password"
            className="glass-input"
            {...register("confirmPassword")}
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
            <UserPlus className="h-4 w-4" />
          )}
          {t("signup")}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
        {t("haveAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          {t("login")}
        </Link>
      </p>
    </div>
  );
}
