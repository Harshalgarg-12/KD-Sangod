import * as yup from "yup";

export const shopProfileSchema = yup.object({
  shopName: yup.string().required("Shop name is required").trim(),
  ownerName: yup.string().required("Owner name is required").trim(),
  fatherName: yup.string().required("Father's name is required").trim(),
  village: yup.string().required("Village is required"),
  gstin: yup
    .string()
    .trim()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid 15-character GSTIN"
    )
    .required("GSTIN is required"),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Current password is required")
    .min(6, "At least 6 characters"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "At least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});
