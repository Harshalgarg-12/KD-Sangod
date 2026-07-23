import { z } from 'zod';

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone must be exactly 10 digits')
    .max(10, 'Phone must be exactly 10 digits')
    .regex(/^[0-9]+$/, 'Enter a valid phone number'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required').trim(),
    phone: z
      .string()
      .min(10, 'Phone must be exactly 10 digits')
      .max(10, 'Phone must be exactly 10 digits')
      .regex(/^[0-9]+$/, 'Enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    shopName: z.string().optional(),
    fathersName: z.string().optional(),
    villageCity: z.string().optional(),
    gstin: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val);
      }, 'Please enter a valid GSTIN format'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  shopName: z.string().max(150, 'Shop name must be under 150 characters').optional(),
  fathersName: z.string().max(100, "Father's name must be under 100 characters").optional(),
  villageCity: z.string().max(100, 'Village/City must be under 100 characters').optional(),
  gstin: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val);
    }, 'Please enter a valid GSTIN format'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

export const partyFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').trim(),
    phone: z
      .string()
      .min(10, 'Phone must be exactly 10 digits')
      .max(10, 'Phone must be exactly 10 digits')
      .regex(/^[0-9]+$/, 'Enter a valid phone number'),
    type: z.enum(['CUSTOMER', 'SUPPLIER']),
    location: z.string().min(1, 'Location is required'),
    fathersName: z.string().optional(),
    // customerCategory: required for CUSTOMER, ignored for SUPPLIER
    customerCategory: z.enum(['REGULAR', 'SHOPKEEPER']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'CUSTOMER' && (!data.fathersName || !data.fathersName.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Father's name is required for customers",
        path: ['fathersName'],
      });
    }
    // Require customerCategory for CUSTOMER type
    if (data.type === 'CUSTOMER' && !data.customerCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Customer category is required',
        path: ['customerCategory'],
      });
    }
  });

export const transactionFormSchema = z.object({
  partyId: z.string().min(1, 'Please select a party'),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .min(1, 'Amount must be at least 1 Rupee'),
  type: z.enum(['DEBIT', 'CREDIT']),
  remarks: z.string().max(500, 'Remarks cannot exceed 500 characters').optional(),
  date: z.string().optional(),
});

// Schema for the forgot-password form — just needs a phone number
export const forgotPasswordSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone must be exactly 10 digits')
    .max(10, 'Phone must be exactly 10 digits')
    .regex(/^[0-9]+$/, 'Enter a valid phone number'),
});

