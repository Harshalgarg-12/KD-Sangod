import * as yup from "yup";

export const partyFormSchema = yup.object({
  name: yup.string().required("Name is required").trim(),
  fatherName: yup.string().required("Father's name is required").trim(),
  phone: yup
    .string()
    .required("Mobile is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  address: yup.string().required("Address is required").trim(),
  village: yup.string().required("Village is required"),
});
