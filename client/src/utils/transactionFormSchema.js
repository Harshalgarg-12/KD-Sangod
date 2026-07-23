import * as yup from "yup";

export const transactionFormSchema = yup.object({
  partyId: yup.string().required("Select a party"),
  type: yup
    .string()
    .oneOf(["lena", "dena"], "Select transaction type")
    .required("Select transaction type"),
  amount: yup
    .number()
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  date: yup.string().required("Date is required"),
  description: yup.string().trim(),
  village: yup.string(),
});
