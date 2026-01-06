import { z } from "zod";

export const userFormSchema = z.object({
  avatar: z
    .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
    .refine((file) => {
      if (!file) return true;
      return true;
    }, "Arquivo obrigatório")
    .refine((value) => {
      if (!value) return true;
      if (typeof value === "string" || value === null || value === undefined) {
        return true;
      }

      const validTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
      return validTypes.includes(value.type);
    }, "Arquivo inválido. Use arquivo do tipo .PNG, .JPG, ou .WEBP"),
});

export type UserFormSchema = z.infer<typeof userFormSchema>;
