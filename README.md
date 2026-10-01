# Nota Generator

Aplikasi web lokal pembuatan nota & faktur monokrom simpel, bersih, tanpa warna ngejreng, tanpa emoji, dan siap cetak langsung atau disimpan sebagai file PNG resolusi tinggi.

## Fitur Utama

- **Monokrom & Plain White Aesthetic**: Desain minimalis profesional dengan kontras tajam dan tipografi rapi.
- **20 Pilihan Desain Nota**:
  1. Struk Termal Kasir (Narrow POS)
  2. Faktur Toko Klasik (Boxed Grid)
  3. Modern Clean (Borderless)
  4. Formal Bisnis (Corporate Two-Column)
  5. Compact Slip (Thermal Ringkas)
  6. Dot Matrix Vintage (Continuous Form)
  7. Bold Editorial (High Contrast)
  8. Vertikal Slim (Tall & Slim Portrait)
  9. Vertikal Tall (Airy Portrait)
  10. Vertikal Tiket (Ticket Stub)
  11. Vertikal Serif (Classic Elegance)
  12. Vertikal Bon (Continuous Bon)
  13. Vertikal Card (Framed Card)
  14. Vertikal Minimal (Centered Minimal)
  15. Vertikal Café (Dine-in Order Slip)
  16. Vertikal Tag (Price Tag / Label ✂)
  17. Vertikal Retro (Cash Register Tape)
  18. Vertikal Luxury (High-End Boutique)
  19. Vertikal Buku Kas (Bukti Kas Masuk & Tanda Tangan)
  20. Vertikal Modern Pill (Fintech Card & Lunas Badge)
- **Ekspor Gambar PNG Tanpa Terpotong**: Menggunakan isolated offscreen iframe rendering untuk menangkap seluruh tinggi nota secara utuh.
- **Warna Logo Terkurasi & Tombol Acak Warna**: Logo pada beberapa template memiliki aksen warna acak yang berbeda satu sama lain dan dapat diacak dengan satu klik.
- **Cetak / PDF Sempurna**: Aturan `@media print` otomatis menyembunyikan editor dan toolbar saat dicetak.
- **Penyimpanan Lokal Otomatis**: Data nota otomatis tersimpan di `localStorage` peramban.

## Menjalankan Secara Lokal

```bash
node server.js
```

Buka peramban di `http://localhost:3000/`.
