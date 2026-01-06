import z from "zod";
import { isMp3 } from "./utils";

export const managementAudioMusicSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  perPage: z.coerce.number().catch(15),
  filter: z.string().optional(),
})


export const audioMusicSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  file: z
    .instanceof(File, { message: "Importe um arquivo MP3" })
    .refine((f) => isMp3(f), "Apenas MP3"),
})

export interface Media {
  id: string;
  id_empresa: number;
  nome: string;
  tipo: string;
  processado_asterisk: boolean;
  musica_espera: number;
  size: number;
  download_url: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T[];
  links: Links;
  meta: Meta;
}

// Uso específico para essa rota
export type MediaProps = ApiResponse<Media>;
