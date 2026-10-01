// test-render.js
const assert = require('assert');
const {
  getDefaultState,
  renderReceipt,
  escapeHtml
} = require('./app.js');

console.log("Menjalankan pengujian render 7 template...");

// Test escapeHtml
assert.strictEqual(escapeHtml("<script>alert('xss')</script>"), "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");

const state = getDefaultState();

// Test Template 1 - 20 rendering
for (let i = 1; i <= 20; i++) {
  state.selectedTemplate = i;
  const html = renderReceipt(state);
  assert.ok(html && html.length > 50, `Template ${i} harus menghasilkan string HTML non-kosong`);
  assert.ok(html.includes("TOKO MAKMUR SEJAHTERA"), `Template ${i} harus memuat nama toko`);
  assert.ok(html.includes("Beras Rojolele"), `Template ${i} harus memuat nama barang`);
  assert.ok(html.includes("150.000"), `Template ${i} harus memuat subtotal`);
}

state.selectedTemplate = 15;
const tpl15Html = renderReceipt(state);
assert.ok(tpl15Html.includes("tpl-vertical-cafe"), "Template 15 harus menghasilkan kontainer tpl-vertical-cafe");

state.selectedTemplate = 16;
const tpl16Html = renderReceipt(state);
assert.ok(tpl16Html.includes("tpl-vertical-tag"), "Template 16 harus menghasilkan kontainer tpl-vertical-tag");

state.selectedTemplate = 17;
const tpl17Html = renderReceipt(state);
assert.ok(tpl17Html.includes("tpl-vertical-retro"), "Template 17 harus menghasilkan kontainer tpl-vertical-retro");

state.selectedTemplate = 18;
const tpl18Html = renderReceipt(state);
assert.ok(tpl18Html.includes("tpl-vertical-luxury"), "Template 18 harus menghasilkan kontainer tpl-vertical-luxury");

state.selectedTemplate = 19;
const tpl19Html = renderReceipt(state);
assert.ok(tpl19Html.includes("tpl-vertical-kas"), "Template 19 harus menghasilkan kontainer tpl-vertical-kas");

state.selectedTemplate = 20;
const tpl20Html = renderReceipt(state);
assert.ok(tpl20Html.includes("tpl-vertical-pill"), "Template 20 harus menghasilkan kontainer tpl-vertical-pill");

console.log("Semua pengujian render 20 template berhasil!");
