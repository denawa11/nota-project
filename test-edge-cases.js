// test-edge-cases.js
const assert = require('assert');
const {
  formatRupiah,
  calculateSubtotal,
  calculateTotal,
  renderReceipt
} = require('./app.js');

console.log("Menjalankan pengujian edge cases...");

// 1. Desimal: 2.5 x 14000 = 35000
assert.strictEqual(calculateSubtotal(2.5, 14000), 35000);
assert.strictEqual(calculateSubtotal(0.75, 20000), 15000);

// 2. Null/Undefined handling
assert.strictEqual(calculateSubtotal(null, 10000), 0);
assert.strictEqual(calculateSubtotal(5, undefined), 0);

// 3. Negative handling:
assert.strictEqual(calculateSubtotal(-2, 10000), -20000);

// 4. Total dengan berbagai nilai
const mixedItems = [
  { qty: 2.5, price: 10000 }, // 25000
  { qty: null, price: 5000 },  // 0
  { qty: "3", price: "12000" } // 36000
];
assert.strictEqual(calculateTotal(mixedItems), 61000);

// 5. Render dengan data kosong / parsial di seluruh 7 template
const emptyState = {
  storeName: "",
  receiptNo: "",
  date: "",
  selectedTemplate: 1,
  items: []
};

for (let i = 1; i <= 7; i++) {
  emptyState.selectedTemplate = i;
  const html = renderReceipt(emptyState);
  assert.ok(html.length > 0, `Template ${i} tidak boleh crash saat items kosong`);
}

console.log("Semua pengujian edge cases berhasil!");
