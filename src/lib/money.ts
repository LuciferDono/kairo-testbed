export interface OrderItemLike {
  price: number;
  quantity: number;
}

export function lineTotal(price: number, quantity: number): number {
  return price * quantity;
}

export function orderTotal(items: OrderItemLike[], taxRate = 0.0825) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item.price, item.quantity), 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  return { subtotal, tax, total: subtotal + tax };
}

export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
