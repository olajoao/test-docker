import type { PaginatedResponse } from "../types/paginations";

export interface PaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}


export const adaptPaginatedResponse = <T>(
  response: PaginatedResponse<T>
): PaginationResult<T> => {
  const { data, meta, links } = response;

  return {
    items: data,
    currentPage: meta.current_page,
    totalPages: meta.last_page,
    totalItems: meta.total,
    hasNext: !!links.next,
    hasPrev: !!links.prev,
  }
}
