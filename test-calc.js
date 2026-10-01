// test-calc.js
const assert = require('assert');
const { formatRupiah, calculateSubtotal, calculateTotal, getDefaultState } = require('./app.js');

console.log("Menjalankan pengujian kalkulasi...");

// Test 1: Subtotal perkalian
assert.strictEqual(calculateSubtotal(2, 15000), 30000);
assert.strictEqual(calculateSubtotal(1.5, 20000), 30000);
assert.strictEqual(calculateSubtotal(0, 50000), 0);
assert.strictEqual(calculateSubtotal("invalid", 10000), 0);
assert.strictEqual(calculateSubtotal(3, "invalid"), 0);

// Test 2: Total akumulasi
const items = [
  { qty: 2, price: 15000 },
  { qty: 1, price: 50000 },
  { qty: 0.5, price: 10000 }
];
assert.strictEqual(calculateTotal(items), 85000);
assert.strictEqual(calculateTotal([]), 0);
assert.strictEqual(calculateTotal(null), 0);

// Test 3: Format Rupiah
assert.strictEqual(formatRupiah(85000), "Rp 85.000");
assert.strictEqual(formatRupiah(0), "Rp 0");
assert.strictEqual(formatRupiah("abc"), "Rp 0");

// Test 4: Default State
const defaultState = getDefaultState();
assert.ok(defaultState.storeName);
assert.ok(defaultState.receiptNo);
assert.ok(defaultState.date);
assert.strictEqual(defaultState.selectedTemplate, 1);
assert.ok(Array.isArray(defaultState.items));
assert.strictEqual(defaultState.items.length, 3);

console.log("Semua pengujian unit kalkulasi berhasil!");
