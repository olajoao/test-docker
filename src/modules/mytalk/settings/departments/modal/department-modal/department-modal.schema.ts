import { z } from "zod";

const REQUIRED_FIELD = "Campo obrigatório";
const MIN_LENGTH = "Mínimo de 3 caracteres";
export const departmentSchema = z.object({
  name: z
    .string({ message: REQUIRED_FIELD })
    .min(3, { message: "Miníno 3 caracteres" })
    .max(150),
  description: z
    .string({ message: REQUIRED_FIELD })
    .min(3, { message: MIN_LENGTH })
    .max(255),
  user_ids: z
    .array(z.string(), { message: "Mínimo 1 membro" })
    .min(1, { message: "Mínimo 1 membro" }),
  leader_id: z.number().optional(),
  date: z.string().optional(),
});

export const editDepartmentSchema = departmentSchema.partial();
export type DepartmentSchema = z.infer<typeof departmentSchema>;
export type EditDepartmentSchema = z.infer<typeof editDepartmentSchema>;
