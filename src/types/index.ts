// Shared API/domain types. Prisma-generated model types can be imported
// directly from "@prisma/client"; add derived/DTO shapes here.

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
