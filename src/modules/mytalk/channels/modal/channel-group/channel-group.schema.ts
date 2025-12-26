import { z } from "zod";

const REQUIRED_FIELD = "Campo obrigatório";

export const createGroupFormSchema = z.object({
  channel_image: z.string().optional(),
  name: z.string().min(3, { message: REQUIRED_FIELD }),
  description: z.string().min(3, { message: REQUIRED_FIELD }),
  members: z
    .array(z.string(), { message: "Mínimo 2 membros" })
    .min(2, { message: "Mínimo 2 membros" }),
});

export const editGroupFormSchema = z.object({
  channel_image: z.string().optional(),
  name: z.string().min(1, "Obrigatório").optional(),
  description: z.string().min(1, "Obrigatório").optional(),
  members: z.array(z.string()).min(1, "Selecione membros").optional(),
});

export type CreateGroupFormSchema = z.infer<typeof createGroupFormSchema>;
export type EditGroupFormSchema = z.infer<typeof editGroupFormSchema>;
