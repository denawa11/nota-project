# Nota Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun aplikasi web Nota Generator lokal berbasis HTML, CSS, dan Vanilla JS dengan 7 variasi desain nota monokrom polos (plain white, tanpa warna ngejreng, tanpa emoji) dan fitur cetak/simpan PDF.

**Architecture:** Menggunakan arsitektur *split-screen* (panel kiri untuk form input dinamis, panel kanan untuk live preview nota). State aplikasi dikelola secara reaktif dan otomatis tersimpan di `localStorage`. Tampilan nota dipisah menjadi 7 modul gaya CSS dan dirender dinamis berdasarkan data transaksi.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (CSS Grid/Flexbox, `@media print`), Vanilla JavaScript ES6+ (Zero dependencies, offline local).

**Spec:** [2026-10-01-nota-generator-design.md](file:///c:/Users/ptxin/Downloads/nota%20generator/docs/superpowers/specs/2026-10-01-nota-generator-design.md)

## Global Constraints

- **Tampilan Visual:** Plain white (`#ffffff`), monokrom bersih (`#111111`, `#e5e5e5`, `#f5f5f5`), tidak ada warna ngejreng, tidak ada emoji.
- **Field Wajib:** Nama Toko, Nama Barang, Qty, Harga Barang, Subtotal, Total Keseluruhan.
- **7 Pilihan Desain Nota:** 
  1. Struk Termal Kasir (Thermal POS)
  2. Faktur Toko Klasik (Boxed Grid)
  3. Modern Clean (Borderless)
  4. Formal Bisnis (Corporate Two-Column)
  5. Compact Slip (A6/Ringkas)
  6. Dot Matrix Vintage (Continuous Form)
  7. Bold Editorial (High Contrast)
- **Eksekusi:** Standalone murni lokal, cukup klik file `index.html`.

## Review Focus

1. **Input Harga / Qty tidak valid:** Input kosong, string huruf, atau angka negatif harus ditangani secara aman (default 0) tanpa menghasilkan `NaN` atau tampilan error.
2. **Kalkulasi Desimal:** Input kuantitas pecahan (misal 1.5 atau 0.25 kg) terhitung akurat pada subtotal dan total tanpa masalah pembulatan aneh.
3. **Persistensi Data:** Data toko dan item tetap ada saat refresh dan tidak rusak jika `localStorage` kosong atau korup.
4. **Cetak / PDF:** Saat print preview (`Ctrl + P`), hanya nota yang terlihat di kertas; tombol, tab switcher, dan form input wajib tersembunyi total.
5. **Transisi 7 Template:** Mengganti template 1 sampai 7 tidak mereset atau menghilangkan input yang sedang diketik pengguna.

---

### Task 1: Setup Logika Inti & Kalkulasi (`app.js`)

**Files:**
- Create: `app.js`
- Test: `test-calc.js` (skrip verifikasi kalkulasi berbasis Node.js untuk validasi otomatis)

**Interfaces:**
- Produces: 
  - `formatRupiah(number): string`
  - `calculateSubtotal(qty, price): number`
  - `calculateTotal(items): number`
  - `getDefaultState(): object`

- [ ] **Step 1: Buat skrip tes unit untuk logika kalkulasi `test-calc.js`**

```javascript
// test-calc.js
const assert = require('assert');
const { formatRupiah, calculateSubtotal, calculateTotal } = require('./app.js');

// Test 1: Subtotal perkalian
assert.strictEqual(calculateSubtotal(2, 15000), 30000);
assert.strictEqual(calculateSubtotal(1.5, 20000), 30000);
assert.strictEqual(calculateSubtotal(0, 50000), 0);
assert.strictEqual(calculateSubtotal("invalid", 10000), 0);

// Test 2: Total akumulasi
const items = [
  { qty: 2, price: 15000 },
  { qty: 1, price: 50000 },
  { qty: 0.5, price: 10000 }
];
assert.strictEqual(calculateTotal(items), 85000);

// Test 3: Format Rupiah
assert.strictEqual(formatRupiah(85000), "Rp 85.000");
assert.strictEqual(formatRupiah(0), "Rp 0");

console.log("Semua pengujian unit kalkulasi berhasil!");
```

- [ ] **Step 2: Jalankan tes untuk memastikan gagal (karena `app.js` belum ada)**

Run: `node test-calc.js`
Expected: Error `Cannot find module './app.js'`

- [ ] **Step 3: Buat implementasi minimal logika di `app.js`**

```javascript
// app.js
function formatRupiah(angka) {
  const cleanNumber = Math.round(Number(angka) || 0);
  return 'Rp ' + cleanNumber.toLocaleString('id-ID');
}

function calculateSubtotal(qty, price) {
  const q = Number(qty) || 0;
  const p = Number(price) || 0;
  return Math.round(q * p);
}

function calculateTotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    return sum + calculateSubtotal(item.qty, item.price);
  }, 0);
}

function getDefaultState() {
  const today = new Date().toISOString().split('T')[0];
  return {
    storeName: "TOKO MAKMUR SEJAHTERA",
    receiptNo: "NOTA-" + Math.floor(1000 + Math.random() * 9000),
    date: today,
    selectedTemplate: 1,
    items: [
      { id: "item-1", name: "Beras Rojolele 5kg", qty: 2, price: 75000 },
      { id: "item-2", name: "Minyak Goreng 2L", qty: 1, price: 34000 },
      { id: "item-3", name: "Gula Pasir 1kg", qty: 3, price: 17500 }
    ]
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatRupiah, calculateSubtotal, calculateTotal, getDefaultState };
}
```

- [ ] **Step 4: Jalankan tes unit kalkulasi kembali untuk verifikasi pass**

Run: `node test-calc.js`
Expected: Output `Semua pengujian unit kalkulasi berhasil!`

---

### Task 2: Buat Struktur Semantic HTML (`index.html`)

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `style.css`, `app.js`
- Produces: DOM elements dengan ID unik (`storeNameInput`, `receiptNoInput`, `dateInput`, `itemsTableBody`, `addItemBtn`, `totalPreviewText`, `templateSwitcher`, `printBtn`, `receiptPaper`)

- [ ] **Step 1: Tulis struktur lengkap `index.html`**

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nota Generator - Pembuat Nota & Faktur Simpel</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app-layout">
    <!-- Panel Kiri: Form Editor -->
    <aside class="editor-panel no-print" id="editorPanel">
      <header class="editor-header">
        <h1 class="app-title">Nota Generator</h1>
        <p class="app-subtitle">Pembuat nota monokrom lokal & siap cetak</p>
      </header>

      <section class="form-section">
        <div class="form-group">
          <label for="storeNameInput">Nama Toko / Usaha</label>
          <input type="text" id="storeNameInput" placeholder="Masukkan nama toko...">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="receiptNoInput">No. Nota / Faktur</label>
            <input type="text" id="receiptNoInput" placeholder="INV-001">
          </div>
          <div class="form-group">
            <label for="dateInput">Tanggal Transaksi</label>
            <input type="date" id="dateInput">
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title-row">
          <h2>Daftar Barang</h2>
          <button type="button" class="btn btn-outline" id="addItemBtn">+ Tambah Barang</button>
        </div>

        <div class="items-table-container">
          <table class="items-editor-table">
            <thead>
              <tr>
                <th style="width: 40%;">Nama Barang</th>
                <th style="width: 15%;">Qty</th>
                <th style="width: 25%;">Harga (Rp)</th>
                <th style="width: 20%;">Aksi</th>
              </tr>
            </thead>
            <tbody id="itemsTableBody">
              <!-- Baris barang dirender via JS -->
            </tbody>
          </table>
        </div>

        <div class="editor-summary">
          <span class="summary-label">Total Keseluruhan:</span>
          <span class="summary-value" id="formTotalDisplay">Rp 0</span>
        </div>
      </section>

      <footer class="editor-footer">
        <button type="button" class="btn btn-secondary" id="loadSampleBtn">Isi Contoh Data</button>
        <button type="button" class="btn btn-secondary" id="resetBtn">Reset Form</button>
      </footer>
    </aside>

    <!-- Panel Kanan: Live Preview & Switcher -->
    <main class="preview-panel" id="previewPanel">
      <div class="preview-toolbar no-print">
        <div class="template-selector">
          <span class="selector-label">Desain Nota:</span>
          <div class="template-buttons" id="templateButtons">
            <button type="button" class="tpl-btn active" data-template="1">1. Termal Kasir</button>
            <button type="button" class="tpl-btn" data-template="2">2. Faktur Klasik</button>
            <button type="button" class="tpl-btn" data-template="3">3. Modern Clean</button>
            <button type="button" class="tpl-btn" data-template="4">4. Formal Bisnis</button>
            <button type="button" class="tpl-btn" data-template="5">5. Compact Slip</button>
            <button type="button" class="tpl-btn" data-template="6">6. Dot Matrix</button>
            <button type="button" class="tpl-btn" data-template="7">7. Bold Editorial</button>
          </div>
        </div>

        <div class="preview-actions">
          <button type="button" class="btn btn-primary btn-print" id="printBtn">Cetak / Simpan PDF</button>
        </div>
      </div>

      <div class="paper-stage">
        <div class="receipt-paper" id="receiptPaper">
          <!-- Konten nota dirender secara dinamis di sini -->
        </div>
      </div>
    </main>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verifikasi file `index.html` dapat dibuka tanpa sintaks error**

---

### Task 3: Implementasikan Render 7 Template Nota di `app.js`

**Files:**
- Modify: `app.js`

**Interfaces:**
- Produces: `renderReceipt(state): string`
  - Template 1: Struk Termal Kasir
  - Template 2: Faktur Toko Klasik
  - Template 3: Modern Clean
  - Template 4: Formal Bisnis
  - Template 5: Compact Slip
  - Template 6: Dot Matrix Vintage
  - Template 7: Bold Editorial

- [ ] **Step 1: Tulis generator HTML untuk masing-masing template di `app.js`**

Implementasikan fungsi perender:
- `renderTemplate1(state)`: Lebar struk sempit, monospace font, dashed borders, rata tengah header.
- `renderTemplate2(state)`: Tabel kotak border `1px solid #111` penuh dengan nomor urut, qty, harga satuan, dan subtotal, kolom tanda tangan.
- `renderTemplate3(state)`: Modern minimalist tanpa border vertikal, hanya garis horizontal halus tipis, font clean sans-serif.
- `renderTemplate4(state)`: Two-column header, tanda terima formal, kotak total di kanan bawah.
- `renderTemplate5(state)`: Format mini slip A6, ringkas, padat baris, hemat kertas.
- `renderTemplate6(state)`: Monospace dot matrix style dengan pemisah `========================`.
- `renderTemplate7(state)`: Garis tebal hitam solid (`3px solid #111`) di header dan total, penataan tipografi kuat.

- [ ] **Step 2: Pasang fungsi dispatch `renderReceipt(state)` di `app.js`**

---

### Task 4: Hubungkan Interaktivitas Form & LocalStorage di `app.js`

**Files:**
- Modify: `app.js`

**Interfaces:**
- Event Listeners:
  - Input toko, nomor, tanggal -> update state & re-render preview
  - Tambah barang -> tambah baris, update state & re-render preview
  - Hapus barang -> hapus baris, update state & re-render preview
  - Ubah nama, qty, harga barang -> update subtotal & total, simpan ke `localStorage`
  - Klik switcher template -> ganti template aktif & re-render preview
  - Klik Cetak -> `window.print()`
  - Klik Reset -> reset ke form kosong
  - Klik Contoh Data -> muat data default

- [ ] **Step 1: Implementasikan event handler dan binding DOM di `app.js`**
- [ ] **Step 2: Implementasikan sinkronisasi `localStorage` (load state saat startup, save saat perubahan)**
- [ ] **Step 3: Pastikan sanitasi teks (escape HTML) agar aman dari injeksi karakter khusus**

---

### Task 5: Styling Monokrom & 7 Variasi Template (`style.css`)

**Files:**
- Create: `style.css`

**Interfaces:**
- Classes:
  - Base Layout: `.app-layout`, `.editor-panel`, `.preview-panel`, `.paper-stage`, `.receipt-paper`
  - Templates: `.tpl-1-thermal`, `.tpl-2-classic`, `.tpl-3-modern`, `.tpl-4-formal`, `.tpl-5-slip`, `.tpl-6-dotmatrix`, `.tpl-7-bold`
  - Buttons & Inputs: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.tpl-btn`

- [ ] **Step 1: Buat CSS dasar, layout split screen responsif, dan styling form panel**
  - Warna: Palet murni putih, abu-abu lembut (`#f5f5f5`, `#e5e5e5`), border bersih (`#d4d4d4`), teks hitam (`#111111`).
  - Zero neon colors, zero flashy accents.
- [ ] **Step 2: Buat CSS untuk masing-masing dari 7 template nota**
  - Pastikan setiap template memiliki visual yang unik dan otentik sesuai peruntukannya.
- [ ] **Step 3: Tambahkan efek visual kertas nota (subtle neutral shadow di preview screen, border kertas presisi)**

---

### Task 6: Implementasi Aturan Cetak `@media print`

**Files:**
- Modify: `style.css`

**Interfaces:**
- Media query: `@media print`
- Aturan:
  - `.no-print { display: none !important; }`
  - `.receipt-paper` diposisikan di tengah kertas dengan margin rapi.
  - Hilangkan background abu-abu preview (`background: #ffffff !important; box-shadow: none !important;`).
  - Aturan `page-break-inside: avoid;` untuk tabel item.

- [ ] **Step 1: Tulis aturan `@media print` lengkap di `style.css`**
- [ ] **Step 2: Cek kompatibilitas ukuran kertas standar (A4 dan Roll Struk Kasir)**

---

### Task 7: Verifikasi End-to-End di Browser

**Files:**
- Test via browser subagent / command check

- [ ] **Step 1: Buka `index.html` di browser menggunakan browser subagent**
- [ ] **Step 2: Uji pengisian form, penambahan & penghapusan baris barang, dan verifikasi subtotal serta total**
- [ ] **Step 3: Klik masing-masing tombol dari 1 hingga 7 dan verifikasi perubahan tampilan nota**
- [ ] **Step 4: Uji tombol 'Cetak' dan pastikan tidak ada error JavaScript di console**
- [ ] **Step 5: Verifikasi reload browser untuk memastikan persistensi `localStorage` bekerja**
