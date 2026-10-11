export interface Page<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function paginate<T>(all: T[], page: number, limit: number): Page<T> {
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit - 1;
  return {
    items: all.slice(start, end),
    page: safePage,
    limit: safeLimit,
    total: all.length,
    totalPages: Math.ceil(all.length / safeLimit),
  };
}
