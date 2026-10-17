// Invented demo module: price an order with an optional coupon.
// Prices are in dollars on the way in and out of the API; all math is in integer cents.
// Coupons: { code, percent, expires: "YYYY-MM-DD" }, valid through the end of that UTC day.

const TAX_RATE = 0.0825;

const toCents = (dollars) => Math.round(dollars * 100);
const toDollars = (cents) => cents / 100;

export function isCouponValid(coupon, now = new Date()) {
  if (!coupon) return false;
  // "YYYY-MM-DD" sorts as text, so compare dates rather than a midnight timestamp.
  return now.toISOString().slice(0, 10) <= coupon.expires;
}

export function priceOrder(items, coupon, now = new Date()) {
  let subtotal = 0;
  for (const item of items) subtotal += toCents(item.price) * item.qty;

  const discount = isCouponValid(coupon, now) ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const total = subtotal - discount + tax;
  return {
    subtotal: toDollars(subtotal),
    discount: toDollars(discount),
    tax: toDollars(tax),
    total: toDollars(total),
  };
}

export function formatReceipt(order) {
  const money = (n) => n.toFixed(2);
  return [
    `Subtotal: $${money(order.subtotal)}`,
    `Discount: -$${money(order.discount)}`,
    `Tax:      $${money(order.tax)}`,
    `Total:    $${money(order.total)}`,
  ].join("\n");
}
