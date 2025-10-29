export interface PaginationLinks {
  fisrt: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationMeta[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}
