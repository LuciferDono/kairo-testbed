export interface OrderItem {
  sku: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  notes?: Record<string, string>;
  shippingDays: number;
  status: "pending" | "shipped";
  createdAt: string;
  total: number;
}
