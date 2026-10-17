// Invented demo module: price an order with an optional coupon.
// Prices are in dollars (floats). Coupons: { code, percent, expires: "YYYY-MM-DD" }.

const TAX_RATE = 0.0825;

export function isCouponValid(coupon, now = new Date()) {
  if (!coupon) return false;
  return new Date(coupon.expires) >= now;
}

export function priceOrder(items, coupon, now = new Date()) {
  let subtotal = 0;
  for (const item of items) subtotal += item.price * item.qty;

  let discount = 0;
  if (isCouponValid(coupon, now)) discount = subtotal * (coupon.percent / 100);

  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;
  return { subtotal, discount, tax, total };
}

export function formatReceipt(order) {
  return [
    `Subtotal: $${order.subtotal}`,
    `Discount: -$${order.discount}`,
    `Tax:      $${order.tax}`,
    `Total:    $${order.total}`,
  ].join("\n");
}
