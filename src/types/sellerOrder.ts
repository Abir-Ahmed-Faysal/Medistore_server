export const ORDER_STATUSES = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}
