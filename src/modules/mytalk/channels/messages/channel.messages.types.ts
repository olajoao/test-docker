import type { User } from "../../users/users.types";

export interface MessageFileProps {
  id: number;
  message_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  thumbnail: string;
  audio_duration: number;
}

export interface ChannelMessageProps {
  id: number;
  channel_id: number;
  user_id: string;
  message: string;
  message_type: number;
  parent_message_id: number;
  id_empresa: number;
  webUser: User;
  attachments?: MessageFileProps[];
  created_at: Date;
  deleted_at: Date;
  updated_at: Date;
}
