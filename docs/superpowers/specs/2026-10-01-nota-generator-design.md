# Spesifikasi Desain: Generator Nota Lokal (7 Pilihan Tampilan)

**Tanggal:** 2026-10-01  
**Status:** Disetujui  
**Lingkungan Eksekusi:** Offline Localhost / Standalone Browser (HTML, CSS, JS)  

---

## 1. Ringkasan Proyek

Aplikasi **Nota Generator** adalah aplikasi web lokal berbasis *single-page application* tanpa ketergantungan server (*zero-dependency*), memungkinkan pengguna membuat nota transaksi dengan cepat, memilih dari 7 desain tampilan bergaya minimalis monokrom (plain white, tanpa warna ngejreng, tanpa emoji), serta mencetak atau menyimpannya langsung sebagai file PDF berkualitas tinggi.

---

## 2. Kebutuhan & Batasan (Requirements & Constraints)

1. **Field Wajib:**
   - **Nama Toko**: Teks nama usaha / toko.
   - **Nomor Nota**: Kode identifikasi transaksi (default terisi format otomatis, dapat diedit).
   - **Tanggal Nota**: Tanggal transaksi (default terisi tanggal hari ini YYYY-MM-DD).
   - **Daftar Barang (Tabel Dinamis)**:
     - Nama Barang (teks deskripsi barang).
     - Qty (jumlah kuantitas, angka bulat/desimal).
     - Harga Satuan (harga per unit barang dalam Rupiah).
     - Subtotal (dihitung otomatis: `Qty * Harga Satuan`).
   - **Total Keseluruhan**: Akumulasi total dari seluruh subtotal barang.

2. **Batasan Desain Visual:**
   - **Monokrom & Plain White**: Dominasi warna putih bersih (`#ffffff`), teks hitam tajam (`#111111`), abu-abu netral untuk pembatas halus (`#e5e5e5`).
   - **Tanpa Warna Mencolok**: Dilarang menggunakan warna-warna mencolok/neon (tidak ada merah/kuning/biru/hijau mencolok).
   - **Bebas Emoji**: Tidak menggunakan ikon kartun, stiker, atau karakter emoji apapun. Semua penanda murni menggunakan tipografi, teks, atau simbol garis standar (`+`, `-`, `---`, `===`).
   - **7 Variasi Desain**: Masing-masing memiliki ciri tipografi dan struktur yang berbeda namun tetap konsisten pada prinsip monokrom polos.

3. **Batasan Teknis & Lingkungan:**
   - Berjalan langsung di browser lokal tanpa memerlukan instalasi Node.js, PHP, atau database eksternal.
   - File tersusun dalam 3 file terpisah: [index.html](file:///c:/Users/ptxin/Downloads/nota%20generator/index.html), [style.css](file:///c:/Users/ptxin/Downloads/nota%20generator/style.css), dan [app.js](file:///c:/Users/ptxin/Downloads/nota%20generator/app.js).
   - State tersimpan otomatis di browser menggunakan `localStorage` agar data tidak hilang ketika halaman dimuat ulang.

---

## 3. Arsitektur Komponen & Alur Data

### 3.1 Struktur Antarmuka (Split-Screen Layout)
- **Sisi Kiri (Editor Form Input)**:
  - Input field Nama Toko.
  - Input field Nomor Nota & Tanggal.
  - Tabel entri barang dengan kontrol penambahan baris (+ Tambah Barang) dan tombol hapus di setiap baris.
  - Ringkasan kalkulasi Total secara instan.
  - Tombol aksi cepat: "Isi Contoh Data" dan "Reset Form".
- **Sisi Kanan (Live Preview & Print Control)**:
  - Selector 7 Template (1: Termal POS, 2: Faktur Klasik, 3: Modern Clean, 4: Formal Bisnis, 5: Compact Slip, 6: Dot Matrix, 7: Bold Editorial).
  - Tombol utama "Cetak Nota / Simpan PDF" (`window.print()`).
  - Container kertas nota interaktif yang merender template terpilih secara real-time.

### 3.2 State Management
State aplikasi disimpan dalam struktur objek JS terpusat:
```javascript
{
  storeName: string,
  receiptNo: string,
  date: string,
  selectedTemplate: number, // integer 1 - 7
  items: [
    { id: string, name: string, qty: number, price: number }
  ]
}
```

### 3.3 Logika Perhitungan
- `subtotal = item.qty * item.price`
- `total = items.reduce((sum, item) => sum + (item.qty * item.price), 0)`
- Format mata uang: Fungsi `formatRupiah(number)` mengonversi angka murni menjadi representasi angka dengan pemisah ribuan titik (contoh: `Rp 25.000` atau `25.000` sesuai kebutuhan template).

---

## 4. Rincian Spesifikasi 7 Template Nota

### Template 1: Struk Termal Kasir (Thermal POS 80mm)
- **Tujuan**: Meniru struk belanja ritel / kasir minimarket.
- **Tipografi**: Font Monospace (`'Courier New', Courier, monospace`).
- **Layout**: Lebar tetap sempit (`max-width: 320px`), rata tengah untuk nama toko dan footer.
- **Pemisah**: Garis putus-putus karakter teks (`border-top: 1px dashed #333`).
- **Footer**: Ucapan penutup teks sederhana "TERIMA KASIH".

### Template 2: Faktur Toko Klasik (Boxed Grid)
- **Tujuan**: Faktur tradisional toko konvensional / grosir.
- **Tipografi**: Font Sans-Serif Standar (`system-ui, Arial, sans-serif`).
- **Layout**: Lebar standar (`max-width: 650px`), tabel memiliki garis batas kotak penuh hitam tegas (`1px solid #222`). Kolom: No, Nama Barang, Qty, Harga Satuan, Jumlah.
- **Footer**: Kolom tanda tangan di sisi kanan/kiri (Tanda Terima & Hormat Kami).

### Template 3: Modern Clean (Minimalist Borderless)
- **Tujuan**: Nota bergaya modern untuk studio, butik, atau kedai kopi modern.
- **Tipografi**: Sans-serif bersih dengan bobot tipis (`Inter, 'Segoe UI', sans-serif`).
- **Layout**: Margin luas, tanpa border vertikal, hanya garis horizontal pembatas sangat halus (`#e5e5e5`).
- **Penekanan**: Tata letak angka rapi rata kanan, total berukuran besar dan bersih.

### Template 4: Formal Bisnis (Two-Column Corporate)
- **Tujuan**: Faktur profesional untuk vendor B2B atau jasa formal.
- **Tipografi**: Serif elegan atau Sans formal (`Georgia, serif` atau `'Times New Roman'`).
- **Layout**: Header 2 kolom rapi (Kolom kiri: Nama Toko & Penerbit; Kolom kanan: No. Faktur & Tanggal).
- **Tabel**: Header tabel berlatar abu-abu netral sangat lembut (`#f5f5f5`), teks kolom teratur dengan total dalam kotak penutup di kanan bawah.

### Template 5: Compact Slip (Nota Ringkas Hemat Kertas)
- **Tujuan**: Bon ringkas untuk transaksi barang sedikit (proporsi kertas A6 landscape/portrait).
- **Tipografi**: Font Sans berukuran padat (`12px-13px`).
- **Layout**: Spasi antar baris rapat, header dan total berada dalam satu bidang kompak. Sangat hemat pemakaian kertas saat dicetak.

### Template 6: Dot Matrix Vintage (Continuous Form Style)
- **Tujuan**: Menyerupai hasil cetak printer pita / jarum dot matrix jadul.
- **Tipografi**: Font Monospace retro (`'Lucida Console', 'Courier New', monospace`).
- **Layout**: Header dan subtotal dipisahkan dengan pembatas karakter ganda (`===` atau border double).
- **Pewarnaan**: Tinta hitam solid 100% tanpa anti-aliasing tebal untuk mensimulasikan cetakan pita dot-matrix.

### Template 7: Bold Editorial (High Contrast Monochrome)
- **Tujuan**: Desain editorial tegas berkelas tinggi.
- **Tipografi**: Kombinasi Sans-serif tebal (Black / Bold 800) untuk nama toko dan angka total, dengan teks pendukung yang clean.
- **Layout**: Garis pembatas horizontal hitam tebal (`3px solid #111`) di bawah nama toko dan di atas ringkasan total.
- **Visual**: Monokrom kontras tinggi dengan struktur geometris yang simetris.

---

## 5. Spesifikasi Media Cetak (`@media print`)

1. **Penyembunyian Kontrol**: Seluruh elemen form input di sisi kiri, tab selector template, tombol cetak, tombol tambah/hapus, serta background halaman disembunyikan total (`display: none !important`).
2. **Kertas Cetak**: Container nota menjadi elemen utama di layar (`margin: 0 auto`, `box-shadow: none`, `width: 100%`).
3. **Pencegahan Pemotongan Baris (Page Break)**: Tabel barang dilengkapi aturan `page-break-inside: avoid;` dan `break-inside: avoid;` sehingga baris barang tidak terpotong di tengah halaman.
4. **Warna Cetak**: Memaksa browser mencetak teks murni hitam pada kertas putih (`color-adjust: exact`, `-webkit-print-color-adjust: exact`).

---

## 6. Skenario Uji & Verifikasi

1. **Uji Perhitungan Matematika**:
   - Menambahkan barang dengan Qty = 3 dan Harga = 15.000 -> Subtotal harus otomatis bernilai 45.000.
   - Menghapus salah satu baris -> Total keseluruhan berkurang secara akurat.
   - Pengisian angka desimal atau nol terkelola dengan aman tanpa error NaN.
2. **Uji Penggantian 7 Desain**:
   - Berpindah dari Template 1 hingga Template 7 mempertahankan seluruh data yang sudah dimasukkan tanpa kehilangan input.
   - Setiap template merender elemen visual sesuai spesifikasi masing-masing.
3. **Uji Cetak / PDF**:
   - Menguji dialog cetak (`Ctrl + P` atau klik Cetak) -> Memastikan hanya nota yang tampil di print preview.
4. **Uji Persistensi Data**:
   - Refresh browser -> Memastikan data yang telah dimasukkan tetap tersimpan via `localStorage`.
