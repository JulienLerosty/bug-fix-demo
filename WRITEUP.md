# Bug-fix write-up: "the coupon didn't apply on the last day"

An invented example of how I handle a bug report. The app (`before/checkout.js`) is made up for this demo; the process is what I'd follow on your code. AI tools, mainly Claude, are used under my supervision; I review and run every change myself.

## The report
> "Customers say SAVE10 (valid through Oct 31) stops working on Oct 31, and some receipts show prices like $4.947525."

## 1. Reproduce
`node demo.mjs before` (order of 3 x $19.99, SAVE10, Oct 31 at 18:00 UTC):

```
Subtotal: $59.97
Discount: -$0
Tax:      $4.947525
Total:    $64.917525
```

Two separate bugs, one report.

## 2. Root causes
1. **Off-by-a-day expiry.** `new Date("2026-10-31")` is midnight UTC at the *start* of Oct 31, so any time after 00:00 that day counts as expired. The coupon really ended on Oct 30.
2. **Float money.** Prices are summed and taxed as floating-point dollars and never rounded, so receipts show fractions of a cent.

## 3. Failing tests first
`npm run test:before` runs the tests against the buggy code: 3 fail, 2 pass (the two passing ones guard behaviour the fix must not break: a coupon is still rejected the day after, and a missing coupon is invalid).

## 4. The fix (`fix.diff`, 54 lines including context)
- Compare the date string: `now.toISOString().slice(0, 10) <= coupon.expires`, so "valid through Oct 31" includes all of Oct 31 (UTC).
- Do all math in integer cents, round each step once (discount, then tax), convert back at the edge.
- Receipt formatting uses `toFixed(2)`.

`npm test`: 5 pass. After: `Discount: -$6.00, Tax: $4.45, Total: $58.42`.

## 5. Risk notes I'd send with the diff
- Expiry is judged in **UTC**. If your shop closes the promo at local midnight, tell me the time zone and it's a one-line change.
- Rounding is per step (discount, then tax). If your accountant rounds per line item, totals can differ by a cent; I'd confirm before shipping.
- Orders already stored with the old float totals are not rewritten.
- The public API still takes and returns dollars, so callers don't change.

## What this shows
Reproduce first, tests that fail for the right reason, the smallest fix, and the assumptions written down. A real engagement ends with the same: a diff, passing tests, and a short risk note.
