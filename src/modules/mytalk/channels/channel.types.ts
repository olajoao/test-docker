import type { UserApiProps } from "../users/users.types";

export const ChannelTypes = {
  0: "private",
  1: "group",
} as const;

export const EChannelTypes = {
  PRIVATE: 0,
  GROUP: 1,
  SERVICE: 2,
} as const;

export type EChannelTypes = (typeof EChannelTypes)[keyof typeof EChannelTypes];

export interface ChannelProps {
  id: number;
  name: string;
  description: string;
  channel_type: EChannelTypes;
  channel_image: string;
  date: Date;
  created_at: Date;
  creator_id: number;
  id_empresa: number;
  department_id?: number;
  members?: UserApiProps[];
  last_message?: {
    id: number;
    created_at: Date;
    updated_at: Date;
  }
}

export interface CreateChannelProps {
  name?: string;
  description?: string;
  channel_type: EChannelTypes;
  channel_image?: string;
  date: Date;
  creator_id: number;
  department_id?: number;
  members_id: number[];
}
