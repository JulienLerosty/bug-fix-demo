import { test } from "node:test";
import assert from "node:assert/strict";

const dir = process.env.DEMO_TARGET === "before" ? "before" : "after";
const { isCouponValid, priceOrder, formatReceipt } = await import(`../${dir}/checkout.js`);

const SAVE10 = { code: "SAVE10", percent: 10, expires: "2026-10-31" };
const items = [{ price: 19.99, qty: 3 }];

test("coupon still works on its last day (bug 1: expired at midnight UTC)", () => {
  assert.equal(isCouponValid(SAVE10, new Date("2026-10-31T18:00:00Z")), true);
});

test("coupon is rejected the day after it expires", () => {
  assert.equal(isCouponValid(SAVE10, new Date("2026-11-01T00:00:00Z")), false);
});

test("missing coupon is not valid", () => {
  assert.equal(isCouponValid(null), false);
});

test("totals are whole cents (bug 2: float noise)", () => {
  const order = priceOrder([{ price: 0.1, qty: 3 }], null, new Date("2026-10-01T00:00:00Z"));
  assert.equal(order.subtotal, 0.3);
  assert.equal(order.total, 0.32);
});

test("receipt for 3 x 19.99 with SAVE10 on its last day", () => {
  const order = priceOrder(items, SAVE10, new Date("2026-10-31T18:00:00Z"));
  assert.equal(
    formatReceipt(order),
    ["Subtotal: $59.97", "Discount: -$6.00", "Tax:      $4.45", "Total:    $58.42"].join("\n"),
  );
});
