export interface HttpClient {
  get<T>(
    url: string,
    params?: URLSearchParams,
  ): Promise<DefaultTypedApiResponse<T>>;
  getDefault<T>(
    url: string,
    params?: URLSearchParams,
    config?: Record<string, any>,
  ): Promise<T>;
  getFiles<T>(
    url: string,
    params?: URLSearchParams,
    config?: Record<string, any>,
  ): Promise<T>;
  post<T>(url: string, data: T): Promise<void>;
  postWithMethodPut<T>(url: string, data: T): Promise<void>;
  put<T>(url: string, data: T): Promise<void>;
  delete(url: string): Promise<void>;
}

export interface HttpClientCommon {
  get<T>(
    url: string,
    params?: URLSearchParams,
  ): Promise<DefaultTypedApiResponse<T>>;
  post<T>(url: string, data: T): Promise<void>;
  postWithMethodPut<T>(url: string, data: T): Promise<void>;
  put<T>(url: string, data: T): Promise<void>;
  delete(url: string): Promise<void>;
}

interface Links {
  first: string;
  last: string;
  prev: string;
  next: string;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: [
    {
      url: string;
      label: string;
      active: boolean;
    },
  ];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface DefaultTypedApiResponse<T> {
  data: T;
  links: Links;
  meta: Meta;
}

export interface DefaultApiResponse<T> {
  [key: string]: T;
  links: any;
  meta: any;
}

export interface SearchParamsProps {
  per_page?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  from_number?: string | null;
  to_number?: string | null;
  involved_number?: string | null;
  queue_name?: string | null;
  event?: string | null;
  direction?: string | null;
  linkedid?: string | null;
  peers?: string | null;
  page?: string | null;
  group_id?: string | null;
}

export interface GroupApiProps {
  id: string;
  grupo: string;
  id_empresa: number;
}
export interface QueueApiProps {
  id?: string;
  name: string;
}

export interface CallInfosProps {
  id: string;
  eventtime: string;
  queue: {
    name: string;
    members_count: number;
    members_available: number;
    ring_strategy: string;
  };
  eventtype: string;
  linkedid: string;
}

export interface DefaultFilterSelectProps {
  id?: string;
  label?: string;
  name?: string;
  grupo?: string;
  id_empresa?: number;
  slug?: string;
  value?: string;
}

export const FieldName = {
  start_date: "start_date",
  end_date: "end_date",
  from_number: "from_number",
  to_number: "to_number",
  involvedNumber: "involvedNumber",
  queue_name: "queue_name",
  status: "status",
  linkedid: "linkedid",
  direction: "direction",
  group_id: "group_id",
  peers: "peers",
} as const;

export type FieldName = (typeof FieldName)[keyof typeof FieldName];

export interface FormFieldProps<T> {
  id: string;
  name: FieldName;
  labelText: string;
  fieldText: string;
  type: string;
  isMultipleSelect: boolean;
  fieldList?: T[];
}
