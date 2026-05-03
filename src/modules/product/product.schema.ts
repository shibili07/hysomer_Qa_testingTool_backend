import { z } from "zod";

export const ProductZodSchema = z.object({
  productName: z.string().min(1),
  price: z.number().nonnegative(),
  productId: z.string().optional().nullable(),
  taxAmount: z.number().optional().default(0),
  discountAmount: z.number().optional().default(0),
  stock: z.number().int().nonnegative().optional().default(0)
});



export type ProductInput = z.infer<typeof ProductZodSchema>;