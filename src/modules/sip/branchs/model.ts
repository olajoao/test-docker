import z from "zod";

export const branchSearchSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().catch(50).optional(),
  filter: z.string().optional(),
})

export const branchRegisterSchema = z.object({

})
