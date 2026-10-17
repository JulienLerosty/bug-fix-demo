const dir = process.argv[2] === "before" ? "before" : "after";
const { priceOrder, formatReceipt } = await import(`./${dir}/checkout.js`);
const coupon = { code: "SAVE10", percent: 10, expires: "2026-10-31" };
console.log(formatReceipt(priceOrder([{ price: 19.99, qty: 3 }], coupon, new Date("2026-10-31T18:00:00Z"))));
