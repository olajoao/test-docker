import z from "zod";

export const callbackSearchSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().catch(50).optional(),
  filter: z.string().optional(),
})

export interface CallbackProps {
  callback : string;
  name : string;
  sip_trunk : string;
  exit_rule : string;
}