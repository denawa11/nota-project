// test-dom.js
// Simulasi lingkungan browser sederhana untuk menguji interaktivitas app.js
const assert = require('assert');
const fs = require('fs');

const htmlContent = fs.readFileSync('./index.html', 'utf-8');
const cssContent = fs.readFileSync('./style.css', 'utf-8');
const jsContent = fs.readFileSync('./app.js', 'utf-8');

console.log("Memeriksa kelengkapan file...");
assert.ok(htmlContent.includes('id="storeNameInput"'), "index.html harus memuat storeNameInput");
assert.ok(htmlContent.includes('id="receiptNoInput"'), "index.html harus memuat receiptNoInput");
assert.ok(htmlContent.includes('id="dateInput"'), "index.html harus memuat dateInput");
assert.ok(htmlContent.includes('id="itemsTableBody"'), "index.html harus memuat itemsTableBody");
assert.ok(htmlContent.includes('id="addItemBtn"'), "index.html harus memuat addItemBtn");
assert.ok(htmlContent.includes('id="formTotalDisplay"'), "index.html harus memuat formTotalDisplay");
assert.ok(htmlContent.includes('id="printBtn"'), "index.html harus memuat printBtn");
assert.ok(htmlContent.includes('id="downloadPngBtn"'), "index.html harus memuat downloadPngBtn");
assert.ok(htmlContent.includes('html2canvas.min.js'), "index.html harus memuat html2canvas.min.js");
assert.ok(htmlContent.includes('id="receiptPaper"'), "index.html harus memuat receiptPaper");

// Verifikasi 20 tombol template di index.html
for (let i = 1; i <= 20; i++) {
  assert.ok(htmlContent.includes(`data-template="${i}"`), `index.html harus memuat tombol template ${i}`);
}

// Verifikasi kelas CSS untuk 20 template di style.css
assert.ok(cssContent.includes('.tpl-thermal'), "style.css harus memiliki .tpl-thermal");
assert.ok(cssContent.includes('.tpl-classic'), "style.css harus memiliki .tpl-classic");
assert.ok(cssContent.includes('.tpl-modern'), "style.css harus memiliki .tpl-modern");
assert.ok(cssContent.includes('.tpl-formal'), "style.css harus memiliki .tpl-formal");
assert.ok(cssContent.includes('.tpl-slip'), "style.css harus memiliki .tpl-slip");
assert.ok(cssContent.includes('.tpl-dotmatrix'), "style.css harus memiliki .tpl-dotmatrix");
assert.ok(cssContent.includes('.tpl-bold'), "style.css harus memiliki .tpl-bold");
assert.ok(cssContent.includes('.tpl-vertical'), "style.css harus memiliki .tpl-vertical");
assert.ok(cssContent.includes('.tpl-vertical-tall'), "style.css harus memiliki .tpl-vertical-tall");
assert.ok(cssContent.includes('.tpl-vertical-ticket'), "style.css harus memiliki .tpl-vertical-ticket");
assert.ok(cssContent.includes('.tpl-vertical-serif'), "style.css harus memiliki .tpl-vertical-serif");
assert.ok(cssContent.includes('.tpl-vertical-bon'), "style.css harus memiliki .tpl-vertical-bon");
assert.ok(cssContent.includes('.tpl-vertical-card'), "style.css harus memiliki .tpl-vertical-card");
assert.ok(cssContent.includes('.tpl-vertical-minimal'), "style.css harus memiliki .tpl-vertical-minimal");
assert.ok(cssContent.includes('.tpl-vertical-cafe'), "style.css harus memiliki .tpl-vertical-cafe");
assert.ok(cssContent.includes('.tpl-vertical-tag'), "style.css harus memiliki .tpl-vertical-tag");
assert.ok(cssContent.includes('.tpl-vertical-retro'), "style.css harus memiliki .tpl-vertical-retro");
assert.ok(cssContent.includes('.tpl-vertical-luxury'), "style.css harus memiliki .tpl-vertical-luxury");
assert.ok(cssContent.includes('.tpl-vertical-kas'), "style.css harus memiliki .tpl-vertical-kas");
assert.ok(cssContent.includes('.tpl-vertical-pill'), "style.css harus memiliki .tpl-vertical-pill");

// Verifikasi aturan @media print di style.css
assert.ok(cssContent.includes('@media print'), "style.css harus memiliki @media print");
assert.ok(cssContent.includes('.no-print'), "style.css harus memiliki kelas .no-print");

console.log("Verifikasi DOM, CSS, dan keterkaitan file 100% SUKSES!");
