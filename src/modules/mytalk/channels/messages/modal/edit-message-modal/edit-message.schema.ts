import { z } from "zod";

const REQUIRED_FIELD = "Campo obrigatório";

export const editMessageSchema = z.object({
  message: z.string().min(1, { message: REQUIRED_FIELD }),
  edited: z.number().optional(),
  date: z.string().optional(),
});

export type EditMessageSchema = z.infer<typeof editMessageSchema>;
