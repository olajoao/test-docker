export interface MessagePayloadProps {
  id?: number;
  channel_id?: string;
  user_id: string;
  edited?: number;
  parent_message_id?: number;
  message?: string;
  message_type: number;
  date: string;
  attachments?: File[];
}
