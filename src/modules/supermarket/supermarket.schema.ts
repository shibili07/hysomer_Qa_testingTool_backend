import { z } from "zod";

export const SupermarketZodSchema = z.object({
  organization_id: z.string().min(1, "Organization ID is required"),
  supermarket_name: z.string().min(1, "Supermarket name is required"),
  api_key: z.string().min(1, "API Key is required"),
});

export type SupermarketInput = z.infer<typeof SupermarketZodSchema>;
