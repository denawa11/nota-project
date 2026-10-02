// Nota Generator - Core Application Logic & 7 Templates

// Utility: Format Rupiah
function formatRupiah(angka) {
  const cleanNumber = Math.round(Number(angka) || 0);
  return 'Rp ' + cleanNumber.toLocaleString('id-ID');
}

// Utility: Kalkulasi Subtotal
function calculateSubtotal(qty, price) {
  const q = Number(qty) || 0;
  const p = Number(price) || 0;
  return Math.round(q * p);
}

// Utility: Kalkulasi Total Keseluruhan
function calculateTotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    return sum + calculateSubtotal(item.qty, item.price);
  }, 0);
}

// Utility: Escape HTML untuk mencegah injeksi karakter aneh
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Format Tanggal Indonesia
function formatDateIndo(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  } catch (e) {
    // fallback ke teks asli
  }
  return dateStr;
}

// Palet Warna Logo Terkurasi (Vibrant, Elegan & Kontras Tinggi)
const LOGO_PALETTE = [
  '#2563eb', // Royal Blue
  '#059669', // Emerald Green
  '#dc2626', // Crimson Red
  '#d97706', // Warm Amber
  '#7c3aed', // Rich Violet
  '#0891b2', // Cyan Teal
  '#e11d48', // Rose Pink
  '#4f46e5', // Iris Indigo
  '#ea580c', // Orange Terracotta
  '#0d9488', // Deep Teal
  '#9333ea', // Royal Purple
  '#b91c1c', // Ruby Dark Red
  '#0284c7', // Sky Cerulean
  '#16a34a', // Fresh Green
  '#c026d3'  // Magenta Plum
];

function getDefaultLogoColors() {
  return {
    3: '#2563eb',
    8: '#059669',
    9: '#d97706',
    10: '#dc2626',
    11: '#7c3aed',
    12: '#0891b2',
    13: '#e11d48',
    15: '#ea580c',
    16: '#0d9488',
    18: '#831843',
    20: '#4f46e5'
  };
}

function getLogoColor(templateNum) {
  if (appState && appState.logoColors && appState.logoColors[templateNum]) {
    return appState.logoColors[templateNum];
  }
  const defaults = getDefaultLogoColors();
  return defaults[templateNum] || '#2563eb';
}

function getStoreInitial(name) {
  const clean = (name || 'T').trim();
  return clean ? clean.charAt(0).toUpperCase() : 'T';
}

function randomizeLogoColors() {
  const shuffled = [...LOGO_PALETTE].sort(() => 0.5 - Math.random());
  if (!appState) appState = getDefaultState();
  if (!appState.logoColors) appState.logoColors = {};
  const tplsWithLogos = [3, 8, 9, 10, 11, 12, 13, 15, 16, 18, 20];
  tplsWithLogos.forEach((tpl, i) => {
    appState.logoColors[tpl] = shuffled[i % shuffled.length];
  });
  saveState();
  updateLivePreview();
}

// State Default Kwitansi Sewa
function getDefaultSewaState() {
  const today = new Date().toISOString().split('T')[0];
  return {
    sewaNo: 'KW-001',
    sewaPenerima: '',
    sewaDariPihak: '',
    sewaJumlah: 0,
    sewaKeterangan: 'Sewa tempat untuk kegiatan promosi di Pasar Badung',
    sewaLokasi: '',
    sewaTanggal: today,
    sewaYangMenerima: '',
    selectedSewaTemplate: 21
  };
}

// Konversi angka ke terbilang (Bahasa Indonesia)
function terbilang(angka) {
  const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan',
    'sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas',
    'tujuh belas', 'delapan belas', 'sembilan belas'];
  const n = Math.abs(Math.round(Number(angka) || 0));
  if (n === 0) return 'nol';
  if (n < 20) return satuan[n];
  if (n < 100) return satuan[Math.floor(n / 10) * 10 > 0 ? 0 : 0] + (Math.floor(n/10) === 1 ? 'sepuluh' : satuan[Math.floor(n/10)] + ' puluh') + (n % 10 ? ' ' + satuan[n % 10] : '');
  if (n < 1000) return (n < 200 ? 'seratus' : satuan[Math.floor(n/100)] + ' ratus') + (n % 100 ? ' ' + terbilang(n % 100) : '');
  if (n < 1000000) return (n < 2000 ? 'seribu' : terbilang(Math.floor(n/1000)) + ' ribu') + (n % 1000 ? ' ' + terbilang(n % 1000) : '');
  if (n < 1000000000) return terbilang(Math.floor(n/1000000)) + ' juta' + (n % 1000000 ? ' ' + terbilang(n % 1000000) : '');
  return terbilang(Math.floor(n/1000000000)) + ' miliar' + (n % 1000000000 ? ' ' + terbilang(n % 1000000000) : '');
}

function terbilangRupiah(angka) {
  const t = terbilang(angka);
  return t.charAt(0).toUpperCase() + t.slice(1) + ' rupiah';
}

// ==========================================
// 5 TEMPLATE KWITANSI SEWA TEMPAT (LANDSCAPE)
// ==========================================

// Template 21: Kwitansi Klasik Resmi (mirip contoh asli)
function renderTemplate21(state) {
  const jumlah = Number(state.sewaJumlah) || 0;
  const tb = terbilangRupiah(jumlah);
  const accentColor = '#2d6a2d';
  return `
    <div class="receipt-body tpl-sewa tpl-sewa-klasik">
      <div class="sewa-klasik-outer">
        <div class="sewa-klasik-ornament-left">
          <div class="sewa-ornament-box">
            <div class="sewa-ornament-inner">K<br>W<br>I<br>T<br>A<br>N<br>S<br>I</div>
          </div>
        </div>
        <div class="sewa-klasik-body">
          <div class="sewa-klasik-header">
            <div class="sewa-klasik-title" style="color: ${accentColor};">KWITANSI SEWA TEMPAT</div>
            <div class="sewa-klasik-no">No: <span class="sewa-no-val">${escapeHtml(state.sewaNo || '-')}</span></div>
          </div>
          <div class="sewa-field-row">
            <span class="sewa-field-label">Telah terima dari</span>
            <span class="sewa-field-sep">:</span>
            <span class="sewa-field-value sewa-field-underline">${escapeHtml(state.sewaDariPihak || '...............................................')}</span>
          </div>
          <div class="sewa-field-row">
            <span class="sewa-field-label">Uang sejumlah</span>
            <span class="sewa-field-sep">:</span>
            <span class="sewa-field-value sewa-field-underline sewa-terbilang">${escapeHtml(jumlah > 0 ? tb : '...............................................')}</span>
          </div>
          <div class="sewa-field-row sewa-field-tall">
            <span class="sewa-field-label">Untuk pembayaran</span>
            <span class="sewa-field-sep">:</span>
            <span class="sewa-field-value sewa-field-underline">${escapeHtml(state.sewaKeterangan || '...............................................')}</span>
          </div>
          <div class="sewa-klasik-bottom">
            <div class="sewa-rp-box">
              <span class="sewa-rp-label">Rp.</span>
              <span class="sewa-rp-amount">${jumlah > 0 ? jumlah.toLocaleString('id-ID') + ',-' : '.....................'}</span>
            </div>
            <div class="sewa-sign-col">
              <div class="sewa-sign-place">${escapeHtml(state.sewaLokasi || '...............') + ', ' + escapeHtml(state.sewaTanggal || '')}</div>
              <div class="sewa-sign-name">${escapeHtml(state.sewaYangMenerima || 'Yang Menerima')}</div>
              <div class="sewa-sign-space"></div>
              <div class="sewa-sign-line">( ......................................... )</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Template 22: Kwitansi Modern Bersih
function renderTemplate22(state) {
  const jumlah = Number(state.sewaJumlah) || 0;
  const tb = terbilangRupiah(jumlah);
  const accentColor = '#1e40af';
  return `
    <div class="receipt-body tpl-sewa tpl-sewa-modern">
      <div class="sewam-accent-bar" style="background: ${accentColor};"></div>
      <div class="sewam-content">
        <div class="sewam-header">
          <div>
            <div class="sewam-label" style="color: ${accentColor};">KWITANSI SEWA TEMPAT</div>
            <div class="sewam-penerima">${escapeHtml(state.sewaPenerima || 'Nama Instansi / Pengelola')}</div>
          </div>
          <div class="sewam-no-block">
            <div class="sewam-no-label">No. Kwitansi</div>
            <div class="sewam-no-val">${escapeHtml(state.sewaNo || '-')}</div>
            <div class="sewam-no-label">Tanggal</div>
            <div class="sewam-no-val">${formatDateIndo(state.sewaTanggal)}</div>
          </div>
        </div>
        <div class="sewam-divider" style="background: ${accentColor};"></div>
        <div class="sewam-fields">
          <div class="sewam-field">
            <span class="sewam-field-lbl">Diterima dari</span>
            <span class="sewam-field-val">${escapeHtml(state.sewaDariPihak || '—')}</span>
          </div>
          <div class="sewam-field">
            <span class="sewam-field-lbl">Uang sejumlah</span>
            <span class="sewam-field-val sewam-terbilang">${jumlah > 0 ? escapeHtml(tb) : '—'}</span>
          </div>
          <div class="sewam-field">
            <span class="sewam-field-lbl">Untuk pembayaran</span>
            <span class="sewam-field-val">${escapeHtml(state.sewaKeterangan || '—')}</span>
          </div>
        </div>
        <div class="sewam-bottom">
          <div class="sewam-amount-pill" style="border-color: ${accentColor}; color: ${accentColor};">
            <span class="sewam-rp">Rp</span>
            <span class="sewam-amount">${jumlah > 0 ? jumlah.toLocaleString('id-ID') + ',-' : '0,-'}</span>
          </div>
          <div class="sewam-sign">
            <div class="sewam-sign-loc">${escapeHtml(state.sewaLokasi || '') + (state.sewaLokasi ? ', ' : '') + formatDateIndo(state.sewaTanggal)}</div>
            <div class="sewam-sign-role">${escapeHtml(state.sewaYangMenerima || 'Yang Menerima')}</div>
            <div class="sewam-sign-gap"></div>
            <div class="sewam-sign-line" style="border-color: ${accentColor};">( ..................................... )</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Template 23: Kwitansi Formal Korporat (Double Border)
function renderTemplate23(state) {
  const jumlah = Number(state.sewaJumlah) || 0;
  const tb = terbilangRupiah(jumlah);
  return `
    <div class="receipt-body tpl-sewa tpl-sewa-formal">
      <div class="sewaf-outer-border">
        <div class="sewaf-inner-border">
          <div class="sewaf-header">
            <div class="sewaf-title">KWITANSI</div>
            <div class="sewaf-subtitle">Bukti Penerimaan Pembayaran Sewa Tempat</div>
            <div class="sewaf-no">Nomor: ${escapeHtml(state.sewaNo || '-')}</div>
          </div>
          <div class="sewaf-hline"></div>
          <div class="sewaf-body">
            <table class="sewaf-table">
              <tr>
                <td class="sewaf-lbl">Diterima dari</td>
                <td class="sewaf-sep">:</td>
                <td class="sewaf-val sewaf-underline">${escapeHtml(state.sewaDariPihak || '')}</td>
              </tr>
              <tr>
                <td class="sewaf-lbl">Terbilang</td>
                <td class="sewaf-sep">:</td>
                <td class="sewaf-val sewaf-underline sewaf-terbilang">${jumlah > 0 ? escapeHtml(tb) : ''}</td>
              </tr>
              <tr>
                <td class="sewaf-lbl">Keterangan</td>
                <td class="sewaf-sep">:</td>
                <td class="sewaf-val sewaf-underline">${escapeHtml(state.sewaKeterangan || '')}</td>
              </tr>
              <tr>
                <td class="sewaf-lbl">Jumlah (Rp)</td>
                <td class="sewaf-sep">:</td>
                <td class="sewaf-val sewaf-amount-bold">Rp ${jumlah > 0 ? jumlah.toLocaleString('id-ID') + ',-' : '0,-'}</td>
              </tr>
            </table>
          </div>
          <div class="sewaf-hline"></div>
          <div class="sewaf-footer">
            <div class="sewaf-note">Pembayaran telah diterima dengan baik. Kwitansi ini merupakan bukti resmi yang sah.</div>
            <div class="sewaf-sign-block">
              <div class="sewaf-sign-loc">${escapeHtml(state.sewaLokasi || '') + (state.sewaLokasi ? ', ' : '') + formatDateIndo(state.sewaTanggal)}</div>
              <div class="sewaf-sign-role">${escapeHtml(state.sewaYangMenerima || 'Yang Menerima')}</div>
              <div class="sewaf-sign-gap"></div>
              <div class="sewaf-sign-name">( ......................................... )</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Template 24: Kwitansi Minimalis Aksen Kiri
function renderTemplate24(state) {
  const jumlah = Number(state.sewaJumlah) || 0;
  const tb = terbilangRupiah(jumlah);
  const accentColor = '#7c3aed';
  return `
    <div class="receipt-body tpl-sewa tpl-sewa-minimal">
      <div class="sewamin-left-bar" style="background: ${accentColor};"></div>
      <div class="sewamin-content">
        <div class="sewamin-top">
          <div class="sewamin-title-group">
            <span class="sewamin-tag" style="color: ${accentColor}; border-color: ${accentColor};">KWITANSI</span>
            <span class="sewamin-subtitle">Sewa Tempat</span>
          </div>
          <div class="sewamin-id-group">
            <span class="sewamin-no">${escapeHtml(state.sewaNo || 'KW-001')}</span>
            <span class="sewamin-date">${formatDateIndo(state.sewaTanggal)}</span>
          </div>
        </div>
        <div class="sewamin-penerima" style="border-left: 3px solid ${accentColor};">
          ${escapeHtml(state.sewaPenerima || 'Nama Instansi / Pengelola')}
        </div>
        <div class="sewamin-fields">
          <div class="sewamin-row">
            <span class="sewamin-lbl">Diterima dari</span>
            <span class="sewamin-colon">:</span>
            <span class="sewamin-val">${escapeHtml(state.sewaDariPihak || '—')}</span>
          </div>
          <div class="sewamin-row">
            <span class="sewamin-lbl">Terbilang</span>
            <span class="sewamin-colon">:</span>
            <span class="sewamin-val sewamin-terbilang">${jumlah > 0 ? escapeHtml(tb) : '—'}</span>
          </div>
          <div class="sewamin-row">
            <span class="sewamin-lbl">Keterangan</span>
            <span class="sewamin-colon">:</span>
            <span class="sewamin-val">${escapeHtml(state.sewaKeterangan || '—')}</span>
          </div>
        </div>
        <div class="sewamin-bottom">
          <div class="sewamin-amount" style="color: ${accentColor};">
            Rp ${jumlah > 0 ? jumlah.toLocaleString('id-ID') + ',-' : '0,-'}
          </div>
          <div class="sewamin-sign">
            <div class="sewamin-sign-loc">${escapeHtml(state.sewaLokasi || '') + (state.sewaLokasi ? ', ' : '') + formatDateIndo(state.sewaTanggal)}</div>
            <div class="sewamin-sign-role">${escapeHtml(state.sewaYangMenerima || 'Yang Menerima')}</div>
            <div class="sewamin-sign-space"></div>
            <div class="sewamin-sign-line">( ..................................... )</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Template 25: Kwitansi Retro Vintage
function renderTemplate25(state) {
  const jumlah = Number(state.sewaJumlah) || 0;
  const tb = terbilangRupiah(jumlah);
  return `
    <div class="receipt-body tpl-sewa tpl-sewa-retro">
      <div class="sewa-retro-frame">
        <div class="sewa-retro-header">
          <div class="sewa-retro-star">✦ ✦ ✦</div>
          <div class="sewa-retro-title">K W I T A N S I</div>
          <div class="sewa-retro-sub">BUKTI PEMBAYARAN SEWA TEMPAT</div>
          <div class="sewa-retro-star">✦ ✦ ✦</div>
          <div class="sewa-retro-no">No: ${escapeHtml(state.sewaNo || '-')}</div>
        </div>
        <div class="sewa-retro-dashes">= = = = = = = = = = = = = = = = = = = = = = = = = = = =</div>
        <div class="sewa-retro-body">
          <div class="sewa-retro-row">
            <span class="sewa-retro-lbl">DITERIMA DARI</span>
            <span class="sewa-retro-sep">:</span>
            <span class="sewa-retro-val">${escapeHtml(state.sewaDariPihak || '...................................')}</span>
          </div>
          <div class="sewa-retro-row">
            <span class="sewa-retro-lbl">UANG SEJUMLAH</span>
            <span class="sewa-retro-sep">:</span>
            <span class="sewa-retro-val">${jumlah > 0 ? escapeHtml(tb).toUpperCase() : '...................................'}</span>
          </div>
          <div class="sewa-retro-row">
            <span class="sewa-retro-lbl">KETERANGAN</span>
            <span class="sewa-retro-sep">:</span>
            <span class="sewa-retro-val">${escapeHtml(state.sewaKeterangan || '...................................')}</span>
          </div>
        </div>
        <div class="sewa-retro-dashes">= = = = = = = = = = = = = = = = = = = = = = = = = = = =</div>
        <div class="sewa-retro-bottom">
          <div class="sewa-retro-amount">
            <span>RP.</span>
            <span class="sewa-retro-rp">${jumlah > 0 ? jumlah.toLocaleString('id-ID') + ',-' : '.......................'}</span>
          </div>
          <div class="sewa-retro-sign">
            <div>${escapeHtml(state.sewaLokasi || '') + (state.sewaLokasi ? ', ' : '') + escapeHtml(state.sewaTanggal || '')}</div>
            <div class="sewa-retro-role">${escapeHtml(state.sewaYangMenerima || 'YANG MENERIMA')}</div>
            <div class="sewa-retro-sign-space"></div>
            <div>( ..................................... )</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// State Default Nota Biasa
function getDefaultState() {
  const today = new Date().toISOString().split('T')[0];
  return {
    storeName: "TOKO MAKMUR SEJAHTERA",
    receiptNo: "NOTA-1082",
    date: today,
    selectedTemplate: 1,
    logoColors: getDefaultLogoColors(),
    items: [
      { id: "item-1", name: "Beras Rojolele 5kg", qty: 2, price: 75000 },
      { id: "item-2", name: "Minyak Goreng 2L", qty: 1, price: 34000 },
      { id: "item-3", name: "Gula Pasir 1kg", qty: 3, price: 17500 }
    ]
  };
}

// ==========================================
// RENDERER TEMPLATE NOTA (100% MONOKROM)
// ==========================================

// Template 1: Struk Termal Kasir (Thermal POS)
function renderTemplate1(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map(item => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="thermal-item-row">
        <div class="thermal-item-name">${escapeHtml(item.name || 'Barang')}</div>
        <div class="thermal-item-calc">
          <span>${item.qty} x ${formatRupiah(item.price)}</span>
          <span class="thermal-item-subtotal">${formatRupiah(subtotal)}</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="receipt-body tpl-thermal">
      <div class="thermal-header">
        <h2 class="thermal-store">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
        <div class="thermal-divider-dashed"></div>
        <div class="thermal-meta">
          <div>No: ${escapeHtml(state.receiptNo || '-')}</div>
          <div>Tgl: ${escapeHtml(state.date || '-')}</div>
        </div>
        <div class="thermal-divider-dashed"></div>
      </div>

      <div class="thermal-items">
        ${itemsHtml}
      </div>

      <div class="thermal-divider-dashed"></div>

      <div class="thermal-summary">
        <div class="thermal-total-row">
          <span>TOTAL</span>
          <span class="thermal-total-val">${formatRupiah(total)}</span>
        </div>
      </div>

      <div class="thermal-divider-dashed"></div>

      <div class="thermal-footer">
        <p>TERIMA KASIH ATAS KUNJUNGAN ANDA</p>
      </div>
    </div>
  `;
}

// Template 2: Faktur Toko Klasik (Boxed Grid)
function renderTemplate2(state) {
  const total = calculateTotal(state.items);
  const itemsRows = state.items.map((item, index) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td>${escapeHtml(item.name || 'Barang')}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-right">${formatRupiah(item.price)}</td>
        <td class="text-right">${formatRupiah(subtotal)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="receipt-body tpl-classic">
      <div class="classic-header">
        <div class="classic-store-box">
          <h2 class="classic-store-name">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
          <div class="classic-tagline">NOTA PENJUALAN / FAKTUR</div>
        </div>
        <div class="classic-meta-box">
          <table class="classic-meta-table">
            <tr>
              <td>No. Nota</td>
              <td>: ${escapeHtml(state.receiptNo || '-')}</td>
            </tr>
            <tr>
              <td>Tanggal</td>
              <td>: ${formatDateIndo(state.date)}</td>
            </tr>
          </table>
        </div>
      </div>

      <table class="classic-grid-table">
        <thead>
          <tr>
            <th style="width: 8%;">NO</th>
            <th style="width: 44%;">NAMA BARANG</th>
            <th style="width: 12%;">QTY</th>
            <th style="width: 18%;">HARGA</th>
            <th style="width: 18%;">SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="text-right font-bold">TOTAL PEMBAYARAN</td>
            <td class="text-right font-bold">${formatRupiah(total)}</td>
          </tr>
        </tfoot>
      </table>

      <div class="classic-signatures">
        <div class="sig-box">
          <div>Tanda Terima,</div>
          <div class="sig-space"></div>
          <div>( ........................ )</div>
        </div>
        <div class="sig-box text-right">
          <div>Hormat Kami,</div>
          <div class="sig-space"></div>
          <div>( ${escapeHtml(state.storeName || 'Pihak Toko')} )</div>
        </div>
      </div>
    </div>
  `;
}

// Template 3: Modern Clean (Minimalist Borderless)
function renderTemplate3(state) {
  const total = calculateTotal(state.items);
  const itemsRows = state.items.map(item => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <tr class="modern-row">
        <td class="modern-item-name">${escapeHtml(item.name || 'Barang')}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-right">${formatRupiah(item.price)}</td>
        <td class="text-right font-medium">${formatRupiah(subtotal)}</td>
      </tr>
    `;
  }).join('');

  const accentColor = getLogoColor(3);

  return `
    <div class="receipt-body tpl-modern">
      <div class="modern-accent-bar" style="background-color: ${accentColor};"></div>
      <div class="modern-header">
        <div class="modern-brand-group">
          <div>
            <span class="modern-kicker" style="color: ${accentColor};">NOTA TRANSAKSI</span>
            <h2 class="modern-store">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
          </div>
        </div>
        <div class="modern-meta">
          <div class="modern-meta-item">
            <span class="modern-meta-label">Nomor</span>
            <span class="modern-meta-val">${escapeHtml(state.receiptNo || '-')}</span>
          </div>
          <div class="modern-meta-item">
            <span class="modern-meta-label">Tanggal</span>
            <span class="modern-meta-val">${formatDateIndo(state.date)}</span>
          </div>
        </div>
      </div>

      <table class="modern-table">
        <thead>
          <tr>
            <th style="width: 48%;">Deskripsi Barang</th>
            <th style="width: 14%; text-align: center;">Jumlah</th>
            <th style="width: 19%; text-align: right;">Harga</th>
            <th style="width: 19%; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="modern-summary">
        <div class="modern-total-card">
          <span class="modern-total-label">Total Pembayaran</span>
          <span class="modern-total-amount">${formatRupiah(total)}</span>
        </div>
      </div>

      <div class="modern-footer">
        <p>Terima kasih atas kepercayaan dan kerja sama Anda.</p>
      </div>
    </div>
  `;
}

// Template 4: Formal Bisnis (Corporate Two-Column)
function renderTemplate4(state) {
  const total = calculateTotal(state.items);
  const itemsRows = state.items.map((item, index) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td>${escapeHtml(item.name || 'Barang')}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-right">${formatRupiah(item.price)}</td>
        <td class="text-right">${formatRupiah(subtotal)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="receipt-body tpl-formal">
      <div class="formal-header-row">
        <div class="formal-vendor-col">
          <div class="formal-label">DITERBITKAN OLEH:</div>
          <h2 class="formal-store-title">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
          <div class="formal-sub">Dokumen Resmi Faktur Penjualan</div>
        </div>
        <div class="formal-doc-col">
          <div class="formal-info-card">
            <div class="formal-card-line">
              <span class="formal-info-label">No. Dokumen:</span>
              <span class="formal-info-val">${escapeHtml(state.receiptNo || '-')}</span>
            </div>
            <div class="formal-card-line">
              <span class="formal-info-label">Tanggal:</span>
              <span class="formal-info-val">${formatDateIndo(state.date)}</span>
            </div>
          </div>
        </div>
      </div>

      <table class="formal-table">
        <thead>
          <tr>
            <th style="width: 8%;">No</th>
            <th style="width: 44%;">Nama Barang / Jasa</th>
            <th style="width: 12%;">Qty</th>
            <th style="width: 18%;">Harga Satuan</th>
            <th style="width: 18%;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="formal-bottom-section">
        <div class="formal-note-col">
          <div class="formal-note-title">Catatan:</div>
          <div class="formal-note-text">
            Pembayaran telah diterima lunas pada saat transaksi dilakukan.
          </div>
        </div>
        <div class="formal-total-col">
          <div class="formal-total-box">
            <div class="formal-total-line">
              <span>Total Akhir:</span>
              <span class="formal-total-val">${formatRupiah(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Template 5: Compact Slip (A6 / Bon Ringkas)
function renderTemplate5(state) {
  const total = calculateTotal(state.items);
  const itemsRows = state.items.map(item => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="slip-row">
        <span class="slip-name">${escapeHtml(item.name || 'Barang')}</span>
        <span class="slip-qty">${item.qty}x</span>
        <span class="slip-price">${formatRupiah(item.price)}</span>
        <span class="slip-subtotal">${formatRupiah(subtotal)}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="receipt-body tpl-slip">
      <div class="slip-header">
        <div class="slip-store">${escapeHtml(state.storeName || 'NAMA TOKO')}</div>
        <div class="slip-meta">
          <span>No: ${escapeHtml(state.receiptNo || '-')}</span>
          <span>Tgl: ${escapeHtml(state.date || '-')}</span>
        </div>
      </div>

      <div class="slip-divider"></div>

      <div class="slip-items">
        <div class="slip-table-head">
          <span>Barang</span>
          <span>Qty</span>
          <span>Harga</span>
          <span style="text-align: right;">Subtotal</span>
        </div>
        ${itemsRows}
      </div>

      <div class="slip-divider"></div>

      <div class="slip-total-row">
        <span class="slip-total-label">TOTAL:</span>
        <span class="slip-total-value">${formatRupiah(total)}</span>
      </div>

      <!-- <div class="slip-footer">
        <div>Nota Bon Ringkas</div>
      </div> -->
    </div>
  `;
}

// Template 6: Dot Matrix Vintage (Continuous Form Style)
function renderTemplate6(state) {
  const total = calculateTotal(state.items);
  const itemsRows = state.items.map((item, index) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="dotmatrix-row">
        <span class="dm-col-no">${(index + 1).toString().padStart(2, '0')}</span>
        <span class="dm-col-name">${escapeHtml(item.name || 'Barang')}</span>
        <span class="dm-col-qty">${item.qty}</span>
        <span class="dm-col-price">${formatRupiah(item.price)}</span>
        <span class="dm-col-subtotal">${formatRupiah(subtotal)}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="receipt-body tpl-dotmatrix">
      <div class="dotmatrix-header">
        <div class="dotmatrix-store">${escapeHtml(state.storeName || 'NAMA TOKO').toUpperCase()}</div>
        <div class="dotmatrix-title">*** BUKTI PENJUALAN TUNAI ***</div>
        <div class="dotmatrix-meta">
          <span>NO. NOTA : ${escapeHtml(state.receiptNo || '-')}</span>
          <span>TANGGAL  : ${escapeHtml(state.date || '-')}</span>
        </div>
      </div>

      <div class="dotmatrix-line">========================================================</div>
      <div class="dotmatrix-head-row">
        <span class="dm-col-no">NO</span>
        <span class="dm-col-name">NAMA BARANG</span>
        <span class="dm-col-qty">QTY</span>
        <span class="dm-col-price">HARGA SATUAN</span>
        <span class="dm-col-subtotal">SUBTOTAL</span>
      </div>
      <div class="dotmatrix-line">--------------------------------------------------------</div>

      <div class="dotmatrix-items">
        ${itemsRows}
      </div>

      <div class="dotmatrix-line">========================================================</div>

      <div class="dotmatrix-total-row">
        <span class="dm-total-title">TOTAL PEMBAYARAN :</span>
        <span class="dm-total-val">${formatRupiah(total)}</span>
      </div>

      <div class="dotmatrix-line">========================================================</div>

      <div class="dotmatrix-footer">
        <div>* BARANG SUDAH DITERIMA DALAM KEADAAN BAIK & LENGKAP *</div>
      </div>
    </div>
  `;
}

// Template 7: Bold Editorial (High Contrast Monochrome)
function renderTemplate7(state) {
  const total = calculateTotal(state.items);
  const itemsRows = state.items.map((item, index) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <tr class="editorial-row">
        <td class="editorial-idx">${(index + 1).toString().padStart(2, '0')}</td>
        <td class="editorial-name">${escapeHtml(item.name || 'Barang')}</td>
        <td class="editorial-qty text-center">${item.qty}</td>
        <td class="editorial-price text-right">${formatRupiah(item.price)}</td>
        <td class="editorial-subtotal text-right">${formatRupiah(subtotal)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="receipt-body tpl-bold">
      <div class="editorial-header">
        <div class="editorial-tag">FAKTUR TRANSAKSI</div>
        <h2 class="editorial-store-name">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
        <div class="editorial-thick-bar"></div>
        <div class="editorial-meta-row">
          <div><span class="editorial-muted">NO:</span> <strong>${escapeHtml(state.receiptNo || '-')}</strong></div>
          <div><span class="editorial-muted">TANGGAL:</span> <strong>${formatDateIndo(state.date)}</strong></div>
        </div>
      </div>

      <table class="editorial-table">
        <thead>
          <tr>
            <th style="width: 8%;">ID</th>
            <th style="width: 44%;">ITEM</th>
            <th style="width: 12%; text-align: center;">QTY</th>
            <th style="width: 18%; text-align: right;">HARGA</th>
            <th style="width: 18%; text-align: right;">SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="editorial-thick-bar"></div>

      <div class="editorial-summary-row">
        <span class="editorial-total-label">TOTAL AKHIR</span>
        <span class="editorial-total-num">${formatRupiah(total)}</span>
      </div>

      <div class="editorial-thin-bar"></div>

      <div class="editorial-footer">
        <div>DOKUMEN RESMI TRANSAKSI &bull; PEMBAYARAN TUNAI LUNAS</div>
      </div>
    </div>
  `;
}

// Template 8: Vertikal Slim (Tall & Slim Portrait Layout)
function renderTemplate8(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map(item => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="vertical-item-block">
        <div class="vertical-item-title">${escapeHtml(item.name || 'Barang')}</div>
        <div class="vertical-item-detail">
          <span class="vertical-item-calc">${item.qty} &times; ${formatRupiah(item.price)}</span>
          <span class="vertical-item-subtotal">${formatRupiah(subtotal)}</span>
        </div>
      </div>
    `;
  }).join('');

  const logoColor = getLogoColor(8);
  const initial = getStoreInitial(state.storeName);

  return `
    <div class="receipt-body tpl-vertical">
      <div class="vertical-header">
        <div class="brand-logo-circle" style="border-color: ${logoColor}; color: ${logoColor};">
          ${initial}
        </div>
        <div class="vertical-badge" style="border-color: ${logoColor}; color: ${logoColor};">NOTA TRANSAKSI</div>
        <h2 class="vertical-store">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
        <div class="vertical-meta-list">
          <div class="vertical-meta-row">
            <span class="vertical-meta-key">No. Transaksi</span>
            <span class="vertical-meta-val">${escapeHtml(state.receiptNo || '-')}</span>
          </div>
          <div class="vertical-meta-row">
            <span class="vertical-meta-key">Tanggal</span>
            <span class="vertical-meta-val">${formatDateIndo(state.date)}</span>
          </div>
        </div>
      </div>

      <div class="vertical-divider"></div>

      <div class="vertical-items-section">
        <div class="vertical-section-heading">RINCIAN BARANG</div>
        <div class="vertical-items-container">
          ${itemsHtml}
        </div>
      </div>

      <div class="vertical-divider"></div>

      <div class="vertical-total-card">
        <div class="vertical-total-label">TOTAL PEMBAYARAN</div>
        <div class="vertical-total-value">${formatRupiah(total)}</div>
      </div>

      <div class="vertical-footer">
        <div class="vertical-footer-text">Terima kasih telah berbelanja</div>
        <div class="vertical-footer-sub">Simpan nota ini sebagai bukti pembayaran yang sah</div>
      </div>
    </div>
  `;
}

// Template 9: Vertikal Tall Minimalist (Ultra Airy, Spaced Portrait)
function renderTemplate9(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map(item => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="tall-item-card">
        <div class="tall-item-header">
          <span class="tall-item-title">${escapeHtml(item.name || 'Barang')}</span>
          <span class="tall-item-subtotal">${formatRupiah(subtotal)}</span>
        </div>
        <div class="tall-item-subline">
          <span>Kuantitas: ${item.qty} unit</span>
          <span>@ ${formatRupiah(item.price)}</span>
        </div>
      </div>
    `;
  }).join('');

  const accentColor = getLogoColor(9);

  return `
    <div class="receipt-body tpl-vertical-tall">
      <div class="tall-header">
        <div class="tall-accent-stripe" style="background-color: ${accentColor};"></div>
        <span class="tall-kicker" style="color: ${accentColor};">FAKTUR PENJUALAN</span>
        <h2 class="tall-store-title">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
        
        <div class="tall-meta-stack">
          <div class="tall-meta-group">
            <span class="tall-meta-label">NOMOR INVOICE</span>
            <span class="tall-meta-val">${escapeHtml(state.receiptNo || '-')}</span>
          </div>
          <div class="tall-meta-group">
            <span class="tall-meta-label">TANGGAL TRANSAKSI</span>
            <span class="tall-meta-val">${formatDateIndo(state.date)}</span>
          </div>
        </div>
      </div>

      <div class="tall-line-separator"></div>

      <div class="tall-items-area">
        <div class="tall-section-title">DAFTAR PESANAN</div>
        <div class="tall-items-list">
          ${itemsHtml}
        </div>
      </div>

      <div class="tall-line-separator"></div>

      <div class="tall-total-section">
        <div class="tall-total-line">
          <span class="tall-total-caption">JUMLAH KESELURUHAN</span>
          <span class="tall-total-number">${formatRupiah(total)}</span>
        </div>
        <div class="tall-payment-status">Status Pembayaran: LUNAS</div>
      </div>

      <div class="tall-footer">
        <p class="tall-footer-main">Terima kasih atas pesanan Anda.</p>
        <p class="tall-footer-sub">Harap simpan bukti nota transaksi ini</p>
      </div>
    </div>
  `;
}

// Template 10: Vertikal Long Ticket (Spacious Ticket / Long Voucher Format)
function renderTemplate10(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map((item, idx) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="ticket-item-row">
        <div class="ticket-item-top">
          <span class="ticket-item-num">${String(idx + 1).padStart(2, '0')}</span>
          <span class="ticket-item-name">${escapeHtml(item.name || 'Barang')}</span>
        </div>
        <div class="ticket-item-bottom">
          <span class="ticket-item-calc">${item.qty} pcs &times; ${formatRupiah(item.price)}</span>
          <span class="ticket-item-total">${formatRupiah(subtotal)}</span>
        </div>
      </div>
    `;
  }).join('');

  const logoColor = getLogoColor(10);

  return `
    <div class="receipt-body tpl-vertical-ticket">
      <div class="ticket-header">
        <div class="ticket-stub-number" style="background-color: ${logoColor};">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: -1px;">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"></path>
          </svg>
          TRANSAKSI #${escapeHtml(state.receiptNo || '000')}
        </div>
        <h2 class="ticket-store">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
        <div class="ticket-date-bar">${formatDateIndo(state.date)}</div>
      </div>

      <div class="ticket-dashed-divider"></div>

      <div class="ticket-body-section">
        <div class="ticket-label-muted">RINCIAN PEMBELIAN</div>
        <div class="ticket-items-flow">
          ${itemsHtml}
        </div>
      </div>

      <div class="ticket-dashed-divider"></div>

      <div class="ticket-summary-box">
        <div class="ticket-sum-label">TOTAL PEMBAYARAN</div>
        <div class="ticket-sum-amount">${formatRupiah(total)}</div>
      </div>

      <div class="ticket-dashed-divider"></div>

      <div class="ticket-footer">
        <div class="ticket-barcode-sim">||| | | |||| | || | |||| || | |||</div>
        <div class="ticket-footer-msg">* TERIMA KASIH ATAS KUNJUNGAN ANDA *</div>
      </div>
    </div>
  `;
}

// Template 11: Vertikal Elegant Serif (Refined Serif, Double-Line Frames)
function renderTemplate11(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map(item => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="serif-item-row">
        <div class="serif-item-title">${escapeHtml(item.name || 'Barang')}</div>
        <div class="serif-item-sub">
          <span>${item.qty} buah &times; ${formatRupiah(item.price)}</span>
          <span class="serif-item-subtotal">${formatRupiah(subtotal)}</span>
        </div>
      </div>
    `;
  }).join('');

  const accentColor = getLogoColor(11);

  return `
    <div class="receipt-body tpl-vertical-serif">
      <div class="serif-double-line" style="border-color: ${accentColor};"></div>
      <div class="serif-header">
        <div class="serif-kicker" style="color: ${accentColor};">BUKTI TRANSAKSI PEMBAYARAN</div>
        <h2 class="serif-store-title">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
        <div class="serif-meta-centered">
          <span>No: ${escapeHtml(state.receiptNo || '-')}</span>
          <span class="serif-dot">&bull;</span>
          <span>${formatDateIndo(state.date)}</span>
        </div>
      </div>
      <div class="serif-double-line"></div>

      <div class="serif-items-area">
        <div class="serif-section-label">RINCIAN BARANG</div>
        <div class="serif-items-list">
          ${itemsHtml}
        </div>
      </div>

      <div class="serif-double-line"></div>

      <div class="serif-total-section">
        <div class="serif-total-label">TOTAL AKHIR</div>
        <div class="serif-total-num">${formatRupiah(total)}</div>
      </div>

      <div class="serif-double-line"></div>

      <div class="serif-footer">
        <p>Terima Kasih Atas Kepercayaan Anda</p>
      </div>
    </div>
  `;
}

// Template 12: Vertikal Continuous Bon (Tall Boutique & Cafe Bon)
function renderTemplate12(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map(item => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="bon-item-block">
        <div class="bon-item-name">${escapeHtml(item.name || 'Barang')}</div>
        <div class="bon-item-meta">
          <span>${item.qty} &times; ${formatRupiah(item.price)}</span>
          <span class="bon-item-total">${formatRupiah(subtotal)}</span>
        </div>
      </div>
    `;
  }).join('');

  const logoColor = getLogoColor(12);

  return `
    <div class="receipt-body tpl-vertical-bon">
      <div class="bon-header">
        <div class="bon-tag" style="background-color: ${logoColor}; color: #ffffff; border-color: ${logoColor};">BON TRANSAKSI</div>
        <h2 class="bon-store">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
        <div class="bon-line-thin"></div>
        <div class="bon-meta-rows">
          <div class="bon-meta-line"><span>NOTA:</span> <strong>${escapeHtml(state.receiptNo || '-')}</strong></div>
          <div class="bon-meta-line"><span>TANGGAL:</span> <strong>${formatDateIndo(state.date)}</strong></div>
        </div>
      </div>

      <div class="bon-dashed-line"></div>

      <div class="bon-items-container">
        <div class="bon-heading">PESANAN</div>
        ${itemsHtml}
      </div>

      <div class="bon-dashed-line"></div>

      <div class="bon-total-box">
        <span class="bon-total-title">TOTAL BAYAR</span>
        <span class="bon-total-amount">${formatRupiah(total)}</span>
      </div>

      <div class="bon-footer">
        <div>LUNAS &bull; TERIMA KASIH</div>
      </div>
    </div>
  `;
}

// Template 13: Vertikal Bordered Card (Outer Bordered Card Frame)
function renderTemplate13(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map((item, idx) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="card-item-row">
        <div class="card-item-num">${idx + 1}.</div>
        <div class="card-item-content">
          <div class="card-item-title">${escapeHtml(item.name || 'Barang')}</div>
          <div class="card-item-calc">
            <span>${item.qty} x ${formatRupiah(item.price)}</span>
            <span class="card-item-sub">${formatRupiah(subtotal)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const accentColor = getLogoColor(13);

  return `
    <div class="receipt-body tpl-vertical-card">
      <div class="card-inner-frame" style="border-color: ${accentColor};">
        <div class="card-header" style="border-bottom-color: ${accentColor};">
          <div class="card-header-top">
            <span class="card-label" style="color: ${accentColor};">KARTU NOTA</span>
            <span class="card-date">${formatDateIndo(state.date)}</span>
          </div>
          <h2 class="card-store-name">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
          <div class="card-no">No: ${escapeHtml(state.receiptNo || '-')}</div>
        </div>

        <div class="card-separator"></div>

        <div class="card-items-section">
          <div class="card-section-label">ITEM TRANSAKSI</div>
          <div class="card-items-list">
            ${itemsHtml}
          </div>
        </div>

        <div class="card-separator"></div>

        <div class="card-total-block">
          <span class="card-total-text">TOTAL TAGIHAN</span>
          <span class="card-total-val">${formatRupiah(total)}</span>
        </div>

        <div class="card-footer">
          <div>* Simpan kartu nota ini sebagai bukti pembayaran *</div>
        </div>
      </div>
    </div>
  `;
}

// Template 14: Vertikal Modern Minimal (Centered Clean Flow)
function renderTemplate14(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map(item => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="vminimal-item">
        <div class="vminimal-item-name">${escapeHtml(item.name || 'Barang')}</div>
        <div class="vminimal-item-qty">${item.qty} unit &bull; ${formatRupiah(item.price)}</div>
        <div class="vminimal-item-subtotal">${formatRupiah(subtotal)}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="receipt-body tpl-vertical-minimal">
      <div class="vminimal-header">
        <div class="vminimal-tag">NOTA</div>
        <h2 class="vminimal-store">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
        <div class="vminimal-meta">
          <div>${escapeHtml(state.receiptNo || '-')}</div>
          <div>${formatDateIndo(state.date)}</div>
        </div>
      </div>

      <div class="vminimal-divider"></div>

      <div class="vminimal-items">
        ${itemsHtml}
      </div>

      <div class="vminimal-divider"></div>

      <div class="vminimal-total">
        <div class="vminimal-total-title">TOTAL</div>
        <div class="vminimal-total-num">${formatRupiah(total)}</div>
      </div>

      <div class="vminimal-footer">
        <div>Terima kasih</div>
      </div>
    </div>
  `;
}

// Template 15: Vertikal Café & Bistro Order Slip
function renderTemplate15(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map((item, idx) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="cafe-item-row">
        <div class="cafe-item-main">
          <span class="cafe-item-num">${idx + 1}.</span>
          <span class="cafe-item-name">${escapeHtml(item.name || 'Menu')}</span>
        </div>
        <div class="cafe-item-details">
          <span class="cafe-item-calc">${item.qty} &times; ${formatRupiah(item.price)}</span>
          <span class="cafe-item-subtotal">${formatRupiah(subtotal)}</span>
        </div>
      </div>
    `;
  }).join('');

  const accentColor = getLogoColor(15);

  return `
    <div class="receipt-body tpl-vertical-cafe">
      <div class="cafe-header" style="border-top: 4px solid ${accentColor};">
        <div class="cafe-badge" style="color: ${accentColor}; border-color: ${accentColor};">PESANAN MEJA / DINE-IN</div>
        <h2 class="cafe-store">${escapeHtml(state.storeName || 'NAMA CAFE / TOKO')}</h2>
        <div class="cafe-meta-pill">
          <span>NO: ${escapeHtml(state.receiptNo || '-')}</span>
          <span class="cafe-meta-sep">&bull;</span>
          <span>${formatDateIndo(state.date)}</span>
        </div>
      </div>

      <div class="cafe-divider-double"></div>

      <div class="cafe-items-section">
        <div class="cafe-section-title">DAFTAR PESANAN</div>
        <div class="cafe-items-list">
          ${itemsHtml}
        </div>
      </div>

      <div class="cafe-divider-dashed"></div>

      <div class="cafe-total-box">
        <div class="cafe-total-row">
          <span class="cafe-total-label">TOTAL AKHIR</span>
          <span class="cafe-total-val">${formatRupiah(total)}</span>
        </div>
        <div class="cafe-status-sub">STATUS: LUNAS / TUNAI</div>
      </div>

      <div class="cafe-divider-double"></div>

      <div class="cafe-footer">
        <div>TERIMA KASIH ATAS KUNJUNGANNYA</div>
        <div class="cafe-footer-sub">Silakan berkunjung kembali</div>
      </div>
    </div>
  `;
}

// Template 16: Vertikal Label Tag / Price Ticket
function renderTemplate16(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map((item, idx) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="tag-item-row">
        <div class="tag-item-badge">[${(idx + 1).toString().padStart(2, '0')}]</div>
        <div class="tag-item-info">
          <div class="tag-item-title">${escapeHtml(item.name || 'Barang')}</div>
          <div class="tag-item-pricing">
            <span>${item.qty} pcs @ ${formatRupiah(item.price)}</span>
            <span class="tag-item-subtotal">${formatRupiah(subtotal)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const accentColor = getLogoColor(16);

  return `
    <div class="receipt-body tpl-vertical-tag">
      <div class="tag-cut-line">
        <span>- - - - - - - - - ✂ POTONG DI SINI ✂ - - - - - - - - -</span>
      </div>

      <div class="tag-card-box">
        <div class="tag-header" style="border-left: 4px solid ${accentColor};">
          <div class="tag-kicker" style="color: ${accentColor};">BUKTI RESMI TRANSAKSI</div>
          <h2 class="tag-store">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
          <div class="tag-meta-grid">
            <div><span class="tag-lbl">FAKTUR :</span> <strong>${escapeHtml(state.receiptNo || '-')}</strong></div>
            <div><span class="tag-lbl">TANGGAL:</span> <strong>${formatDateIndo(state.date)}</strong></div>
          </div>
        </div>

        <div class="tag-solid-line"></div>

        <div class="tag-items-area">
          <div class="tag-section-heading">RINCIAN ITEM</div>
          <div class="tag-items-list">
            ${itemsHtml}
          </div>
        </div>

        <div class="tag-solid-line"></div>

        <div class="tag-total-container">
          <div class="tag-total-label">TOTAL HARGA</div>
          <div class="tag-total-price">${formatRupiah(total)}</div>
        </div>

        <div class="tag-footer">
          <div class="tag-barcode-mock">||| | |||| | || | ||| |||| | ||</div>
          <div class="tag-guarantee">* Barang yang sudah dibeli tidak dapat ditukar *</div>
        </div>
      </div>
    </div>
  `;
}

// Template 17: Vertikal Retro Tape (Vintage Cash Register Tape)
function renderTemplate17(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map(item => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="retro-item-entry">
        <div class="retro-item-line">
          <span class="retro-item-name">${escapeHtml(item.name || 'Barang')}</span>
          <span class="retro-item-leader">.....................</span>
          <span class="retro-item-subtotal">${formatRupiah(subtotal)}</span>
        </div>
        <div class="retro-item-calc">
          ${item.qty} @ ${formatRupiah(item.price)}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="receipt-body tpl-vertical-retro">
      <div class="retro-star-line">* * * * * * * * * * * * * * * * * * * * *</div>
      <div class="retro-header">
        <div class="retro-store">${escapeHtml(state.storeName || 'NAMA TOKO').toUpperCase()}</div>
        <div class="retro-title">KASIR / REGISTER TAPE</div>
        <div class="retro-meta">
          <div>REG: ${escapeHtml(state.receiptNo || '-')}</div>
          <div>TGL: ${escapeHtml(state.date || '-')}</div>
        </div>
      </div>
      <div class="retro-star-line">* * * * * * * * * * * * * * * * * * * * *</div>

      <div class="retro-items-area">
        ${itemsHtml}
      </div>

      <div class="retro-double-line">=========================================</div>

      <div class="retro-total-block">
        <span class="retro-total-tag">TOTAL IDR:</span>
        <span class="retro-total-val">${formatRupiah(total)}</span>
      </div>

      <div class="retro-double-line">=========================================</div>

      <div class="retro-stamp-box">
        [ *** LUNAS / TUNAI *** ]
      </div>

      <div class="retro-footer">
        <div>TERIMA KASIH ATAS KUNJUNGAN ANDA</div>
        <div class="retro-star-line">* * * * * * * * * * * * * * * * * * * * *</div>
      </div>
    </div>
  `;
}

// Template 18: Vertikal Luxury / High-End Boutique
function renderTemplate18(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map((item, idx) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="luxury-item-row">
        <div class="luxury-item-header">
          <span class="luxury-item-index">${idx + 1}</span>
          <span class="luxury-item-title">${escapeHtml(item.name || 'Item')}</span>
        </div>
        <div class="luxury-item-pricing">
          <span class="luxury-item-qty">${item.qty} Unit &times; ${formatRupiah(item.price)}</span>
          <span class="luxury-item-amount">${formatRupiah(subtotal)}</span>
        </div>
      </div>
    `;
  }).join('');

  const accentColor = getLogoColor(18);

  return `
    <div class="receipt-body tpl-vertical-luxury">
      <div class="luxury-header">
        <div class="luxury-accent-bar" style="background-color: ${accentColor}; width: 40px; height: 3px; margin: 0 auto 10px;"></div>
        <div class="luxury-kicker" style="color: ${accentColor};">R E C E I P T</div>
        <h2 class="luxury-brand">${escapeHtml(state.storeName || 'MAISON / BOUTIQUE')}</h2>
        <div class="luxury-meta-line">
          <span>№ ${escapeHtml(state.receiptNo || '-')}</span>
          <span class="luxury-bullet">&bull;</span>
          <span>${formatDateIndo(state.date)}</span>
        </div>
      </div>

      <div class="luxury-thin-line"></div>

      <div class="luxury-items-section">
        <div class="luxury-section-heading">PURCHASE SUMMARY</div>
        <div class="luxury-items-list">
          ${itemsHtml}
        </div>
      </div>

      <div class="luxury-thin-line"></div>

      <div class="luxury-total-section">
        <div class="luxury-total-label">TOTAL AMOUNT</div>
        <div class="luxury-total-val">${formatRupiah(total)}</div>
      </div>

      <div class="luxury-thin-line"></div>

      <div class="luxury-footer">
        <p class="luxury-thankyou">Thank you for your patronage</p>
        <p class="luxury-terms">Please retain this receipt for warranty purposes</p>
      </div>
    </div>
  `;
}

// Template 19: Vertikal Buku Kas / Bukti Penerimaan Kas
function renderTemplate19(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map((item, idx) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <tr class="kas-row">
        <td class="kas-col-no">${idx + 1}</td>
        <td class="kas-col-name">${escapeHtml(item.name || 'Barang')}</td>
        <td class="kas-col-qty text-center">${item.qty}</td>
        <td class="kas-col-price text-right">${formatRupiah(item.price)}</td>
        <td class="kas-col-sub text-right">${formatRupiah(subtotal)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="receipt-body tpl-vertical-kas">
      <div class="kas-header">
        <div class="kas-badge">BUKTI KAS MASUK</div>
        <h2 class="kas-store">${escapeHtml(state.storeName || 'NAMA USAHA / TOKO')}</h2>
        <div class="kas-meta-grid">
          <div><span>No. Bukti :</span> <strong>${escapeHtml(state.receiptNo || '-')}</strong></div>
          <div><span>Tanggal   :</span> <strong>${formatDateIndo(state.date)}</strong></div>
        </div>
      </div>

      <table class="kas-table">
        <thead>
          <tr>
            <th style="width: 8%;">No</th>
            <th style="width: 44%;">Uraian Barang</th>
            <th style="width: 14%; text-align: center;">Qty</th>
            <th style="width: 17%; text-align: right;">Harga</th>
            <th style="width: 17%; text-align: right;">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr class="kas-total-row">
            <td colspan="4" class="text-right kas-total-label">TOTAL PENERIMAAN:</td>
            <td class="text-right kas-total-value">${formatRupiah(total)}</td>
          </tr>
        </tfoot>
      </table>

      <div class="kas-signatures">
        <div class="kas-sig-box">
          <div class="kas-sig-title">Penerima / Kasir</div>
          <div class="kas-sig-space"></div>
          <div class="kas-sig-line">( ..................................... )</div>
        </div>
        <div class="kas-sig-box">
          <div class="kas-sig-title">Penyetor / Pembeli</div>
          <div class="kas-sig-space"></div>
          <div class="kas-sig-line">( ..................................... )</div>
        </div>
      </div>
    </div>
  `;
}

// Template 20: Vertikal Modern Rounded Pill
function renderTemplate20(state) {
  const total = calculateTotal(state.items);
  const itemsHtml = state.items.map((item, idx) => {
    const subtotal = calculateSubtotal(item.qty, item.price);
    return `
      <div class="pill-item-card">
        <div class="pill-item-top">
          <span class="pill-item-index">${(idx + 1).toString().padStart(2, '0')}</span>
          <span class="pill-item-name">${escapeHtml(item.name || 'Barang')}</span>
          <span class="pill-item-subtotal">${formatRupiah(subtotal)}</span>
        </div>
        <div class="pill-item-bottom">
          <span>Kuantitas: ${item.qty} unit</span>
          <span>Harga: ${formatRupiah(item.price)}</span>
        </div>
      </div>
    `;
  }).join('');

  const logoColor = getLogoColor(20);

  return `
    <div class="receipt-body tpl-vertical-pill">
      <div class="pill-card-frame">
        <div class="pill-header">
          <div class="pill-top-row">
            <div class="pill-badge-with-logo">
              <span class="pill-logo-dot" style="background-color: ${logoColor};"></span>
              <span class="pill-badge">NOTA RESMI</span>
            </div>
            <span class="pill-status-badge" style="background-color: ${logoColor};">LUNAS</span>
          </div>
          <h2 class="pill-store-name">${escapeHtml(state.storeName || 'NAMA TOKO')}</h2>
          <div class="pill-meta-box">
            <div class="pill-meta-col">
              <span class="pill-meta-lbl">NO. NOTA</span>
              <span class="pill-meta-txt">${escapeHtml(state.receiptNo || '-')}</span>
            </div>
            <div class="pill-meta-col text-right">
              <span class="pill-meta-lbl">TANGGAL</span>
              <span class="pill-meta-txt">${formatDateIndo(state.date)}</span>
            </div>
          </div>
        </div>

        <div class="pill-section-heading">RINCIAN BELANJA</div>
        <div class="pill-items-container">
          ${itemsHtml}
        </div>

        <div class="pill-summary-box">
          <div class="pill-summary-row">
            <span class="pill-summary-title">TOTAL TAGIHAN</span>
            <span class="pill-summary-total">${formatRupiah(total)}</span>
          </div>
        </div>

        <div class="pill-footer">
          <div class="pill-barcode">|| | ||| | |||| | || | ||| | ||</div>
          <div class="pill-footer-text">Terima kasih atas transaksi Anda</div>
        </div>
      </div>
    </div>
  `;
}

// Router Utama Renderer
function renderReceipt(state) {
  const tpl = Number(state.selectedTemplate) || 1;
  switch (tpl) {
    case 1: return renderTemplate1(state);
    case 2: return renderTemplate2(state);
    case 3: return renderTemplate3(state);
    case 4: return renderTemplate4(state);
    case 5: return renderTemplate5(state);
    case 6: return renderTemplate6(state);
    case 7: return renderTemplate7(state);
    case 8: return renderTemplate8(state);
    case 9: return renderTemplate9(state);
    case 10: return renderTemplate10(state);
    case 11: return renderTemplate11(state);
    case 12: return renderTemplate12(state);
    case 13: return renderTemplate13(state);
    case 14: return renderTemplate14(state);
    case 15: return renderTemplate15(state);
    case 16: return renderTemplate16(state);
    case 17: return renderTemplate17(state);
    case 18: return renderTemplate18(state);
    case 19: return renderTemplate19(state);
    case 20: return renderTemplate20(state);
    default: return renderTemplate1(state);
  }
}

function renderKwitansi(state) {
  const tpl = Number(state.selectedSewaTemplate) || 21;
  switch (tpl) {
    case 21: return renderTemplate21(state);
    case 22: return renderTemplate22(state);
    case 23: return renderTemplate23(state);
    case 24: return renderTemplate24(state);
    case 25: return renderTemplate25(state);
    default: return renderTemplate21(state);
  }
}

// ==========================================
// BROWSER CLIENT-SIDE CONTROLLER
// ==========================================

const STORAGE_KEY = 'nota_generator_state_v1';
const STORAGE_KEY_SEWA = 'nota_generator_sewa_v1';

let appState = null;
let sewaState = null;
let appMode = 'nota'; // 'nota' | 'sewa'

function saveState() {
  if (typeof localStorage !== 'undefined') {
    try {
      if (appState) localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      if (sewaState) localStorage.setItem(STORAGE_KEY_SEWA, JSON.stringify(sewaState));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", e);
    }
  }
}

function loadState() {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.items)) {
          if (!parsed.logoColors) parsed.logoColors = getDefaultLogoColors();
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Gagal membaca localStorage:", e);
    }
  }
  return getDefaultState();
}

function loadSewaState() {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SEWA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.sewaNo) return parsed;
      }
    } catch (e) {}
  }
  return getDefaultSewaState();
}

function updateLivePreview() {
  const paper = document.getElementById('receiptPaper');
  if (!paper) return;

  if (appMode === 'sewa' && sewaState) {
    paper.innerHTML = renderKwitansi(sewaState);
    // Hide total display in sewa mode
    const totalDisplay = document.getElementById('formTotalDisplay');
    if (totalDisplay) totalDisplay.textContent = sewaState.sewaJumlah > 0 ? formatRupiah(sewaState.sewaJumlah) : 'Rp 0';
  } else if (appState) {
    paper.innerHTML = renderReceipt(appState);
    const totalDisplay = document.getElementById('formTotalDisplay');
    if (totalDisplay) {
      const total = calculateTotal(appState.items);
      totalDisplay.textContent = formatRupiah(total);
    }
  }
}

function renderEditorItems() {
  const tbody = document.getElementById('itemsTableBody');
  if (!tbody || !appState) return;

  tbody.innerHTML = '';
  appState.items.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.className = 'editor-item-row';
    tr.dataset.id = item.id;

    tr.innerHTML = `
      <td>
        <input type="text" class="input-item-name" value="${escapeHtml(item.name)}" placeholder="Nama barang...">
      </td>
      <td>
        <input type="number" class="input-item-qty" value="${item.qty}" min="0" step="any">
      </td>
      <td>
        <input type="number" class="input-item-price" value="${item.price}" min="0" step="any" placeholder="0">
      </td>
      <td style="text-align: center;">
        <button type="button" class="btn-delete-row" title="Hapus baris" data-id="${item.id}">Hapus</button>
      </td>
    `;

    // Event listeners per input row
    const nameInput = tr.querySelector('.input-item-name');
    const qtyInput = tr.querySelector('.input-item-qty');
    const priceInput = tr.querySelector('.input-item-price');
    const deleteBtn = tr.querySelector('.btn-delete-row');

    nameInput.addEventListener('input', (e) => {
      item.name = e.target.value;
      saveState();
      updateLivePreview();
    });

    qtyInput.addEventListener('input', (e) => {
      item.qty = parseFloat(e.target.value) || 0;
      saveState();
      updateLivePreview();
    });

    priceInput.addEventListener('input', (e) => {
      item.price = parseFloat(e.target.value) || 0;
      saveState();
      updateLivePreview();
    });

    deleteBtn.addEventListener('click', () => {
      if (appState.items.length <= 1) {
        // Jika tinggal 1 baris, kosongkan saja jangan hapus seluruhnya
        item.name = '';
        item.qty = 0;
        item.price = 0;
      } else {
        appState.items = appState.items.filter(it => it.id !== item.id);
      }
      saveState();
      renderEditorItems();
      updateLivePreview();
    });

    tbody.appendChild(tr);
  });
}

function initBrowserApp() {
  if (typeof document === 'undefined') return;

  appState = loadState();

  const storeNameInput = document.getElementById('storeNameInput');
  const receiptNoInput = document.getElementById('receiptNoInput');
  const dateInput = document.getElementById('dateInput');
  const addItemBtn = document.getElementById('addItemBtn');
  const loadSampleBtn = document.getElementById('loadSampleBtn');
  const resetBtn = document.getElementById('resetBtn');
  const printBtn = document.getElementById('printBtn');
  const templateButtons = document.querySelectorAll('.tpl-btn');

  // Set nilai awal form input
  if (storeNameInput) storeNameInput.value = appState.storeName || '';
  if (receiptNoInput) receiptNoInput.value = appState.receiptNo || '';
  if (dateInput) dateInput.value = appState.date || '';

  // Event listener form header
  if (storeNameInput) {
    storeNameInput.addEventListener('input', (e) => {
      appState.storeName = e.target.value;
      saveState();
      updateLivePreview();
    });
  }

  if (receiptNoInput) {
    receiptNoInput.addEventListener('input', (e) => {
      appState.receiptNo = e.target.value;
      saveState();
      updateLivePreview();
    });
  }

  if (dateInput) {
    dateInput.addEventListener('input', (e) => {
      appState.date = e.target.value;
      saveState();
      updateLivePreview();
    });
  }

  // Tambah baris barang baru
  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      const newId = 'item-' + Date.now();
      appState.items.push({
        id: newId,
        name: '',
        qty: 1,
        price: 0
      });
      saveState();
      renderEditorItems();
      updateLivePreview();

      // Otomatis fokus ke input nama baris terakhir
      const allNameInputs = document.querySelectorAll('.input-item-name');
      if (allNameInputs.length > 0) {
        allNameInputs[allNameInputs.length - 1].focus();
      }
    });
  }

  // Template switchers
  templateButtons.forEach(btn => {
    const tplNum = parseInt(btn.dataset.template, 10);
    if (tplNum === appState.selectedTemplate) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    btn.addEventListener('click', () => {
      templateButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.selectedTemplate = tplNum;
      saveState();
      updateLivePreview();
    });
  });

  // Isi contoh data
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener('click', () => {
      appState = getDefaultState();
      if (storeNameInput) storeNameInput.value = appState.storeName;
      if (receiptNoInput) receiptNoInput.value = appState.receiptNo;
      if (dateInput) dateInput.value = appState.date;
      saveState();
      renderEditorItems();
      updateLivePreview();
    });
  }

  // Reset form
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      appState = {
        storeName: '',
        receiptNo: 'NOTA-' + Math.floor(1000 + Math.random() * 9000),
        date: today,
        selectedTemplate: appState.selectedTemplate || 1,
        items: [
          { id: 'item-' + Date.now(), name: '', qty: 1, price: 0 }
        ],
        logoColors: (appState && appState.logoColors) ? appState.logoColors : getDefaultLogoColors()
      };
      if (storeNameInput) storeNameInput.value = '';
      if (receiptNoInput) receiptNoInput.value = appState.receiptNo;
      if (dateInput) dateInput.value = appState.date;
      saveState();
      renderEditorItems();
      updateLivePreview();
    });
  }

  // Acak Warna Logo
  const randomizeColorsBtn = document.getElementById('randomizeColorsBtn');
  if (randomizeColorsBtn) {
    randomizeColorsBtn.addEventListener('click', randomizeLogoColors);
  }

  // Cetak Nota
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Download Nota sebagai PNG
  const downloadPngBtn = document.getElementById('downloadPngBtn');
  if (downloadPngBtn) {
    downloadPngBtn.addEventListener('click', downloadReceiptAsPNG);
  }

  // Initial render
  sewaState = loadSewaState();
  renderEditorItems();
  updateLivePreview();
  initSewaForm();
}

function initSewaForm() {
  // Mode tab switcher
  const tabNota = document.getElementById('tabNota');
  const tabSewa = document.getElementById('tabSewa');
  const panelNota = document.getElementById('panelNota');
  const panelSewa = document.getElementById('panelSewa');
  const sewaTemplateBtns = document.querySelectorAll('.sewa-tpl-btn');

  function switchMode(mode) {
    appMode = mode;
    if (mode === 'sewa') {
      if (tabNota) tabNota.classList.remove('active');
      if (tabSewa) tabSewa.classList.add('active');
      if (panelNota) panelNota.style.display = 'none';
      if (panelSewa) panelSewa.style.display = 'block';
    } else {
      if (tabSewa) tabSewa.classList.remove('active');
      if (tabNota) tabNota.classList.add('active');
      if (panelSewa) panelSewa.style.display = 'none';
      if (panelNota) panelNota.style.display = 'block';
    }
    updateLivePreview();
  }

  if (tabNota) tabNota.addEventListener('click', () => switchMode('nota'));
  if (tabSewa) tabSewa.addEventListener('click', () => switchMode('sewa'));

  // Sewa template switchers
  sewaTemplateBtns.forEach(btn => {
    const tplNum = parseInt(btn.dataset.sewaTpl, 10);
    if (tplNum === (sewaState.selectedSewaTemplate || 21)) btn.classList.add('active');
    btn.addEventListener('click', () => {
      sewaTemplateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sewaState.selectedSewaTemplate = tplNum;
      saveState();
      if (appMode === 'sewa') updateLivePreview();
    });
  });

  // Bind sewa form inputs
  const bindSewa = (id, field, isNumber) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = isNumber ? (sewaState[field] || '') : (sewaState[field] || '');
    el.addEventListener('input', (e) => {
      sewaState[field] = isNumber ? (parseFloat(e.target.value) || 0) : e.target.value;
      saveState();
      if (appMode === 'sewa') updateLivePreview();
    });
  };

  bindSewa('sewaNoInput', 'sewaNo', false);
  bindSewa('sewaPenerimaInput', 'sewaPenerima', false);
  bindSewa('sewaDariPihakInput', 'sewaDariPihak', false);
  bindSewa('sewaJumlahInput', 'sewaJumlah', true);
  bindSewa('sewaKeteranganInput', 'sewaKeterangan', false);
  bindSewa('sewaLokasiInput', 'sewaLokasi', false);
  bindSewa('sewaTanggalInput', 'sewaTanggal', false);
  bindSewa('sewaYangMenerimaInput', 'sewaYangMenerima', false);

  // Set initial input values
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  setVal('sewaNoInput', sewaState.sewaNo);
  setVal('sewaPenerimaInput', sewaState.sewaPenerima);
  setVal('sewaDariPihakInput', sewaState.sewaDariPihak);
  const jumlahEl = document.getElementById('sewaJumlahInput');
  if (jumlahEl) jumlahEl.value = sewaState.sewaJumlah || '';
  setVal('sewaKeteranganInput', sewaState.sewaKeterangan);
  setVal('sewaLokasiInput', sewaState.sewaLokasi);
  setVal('sewaTanggalInput', sewaState.sewaTanggal);
  setVal('sewaYangMenerimaInput', sewaState.sewaYangMenerima);
}

// Download Nota sebagai File Gambar PNG (Sesuai Ukuran Asli Nota Tanpa Terpotong)
async function downloadReceiptAsPNG() {
  const paper = document.getElementById('receiptPaper');
  if (!paper) {
    alert("Elemen nota tidak ditemukan.");
    return;
  }

  if (typeof html2canvas === 'undefined') {
    alert("Pustaka html2canvas belum dimuat.");
    return;
  }

  const receiptEl = paper.querySelector('.receipt-body') || paper;
  const downloadBtn = document.getElementById('downloadPngBtn');
  const originalText = downloadBtn ? downloadBtn.textContent : '';

  if (downloadBtn) {
    downloadBtn.textContent = 'Memproses PNG...';
    downloadBtn.disabled = true;
  }

  // Ambil lebar nota — berbeda per mode/template
  const isThermal = appMode !== 'sewa' && appState && appState.selectedTemplate === 1;
  const isSewa = appMode === 'sewa';
  let baseWidth;
  if (isThermal) {
    baseWidth = Math.ceil(parseFloat(window.getComputedStyle(receiptEl).width) || receiptEl.getBoundingClientRect().width || 210);
    if (baseWidth > 280) baseWidth = 250;
  } else if (isSewa) {
    // Kwitansi sewa: landscape/wide, pakai lebar penuh paper
    baseWidth = Math.ceil(parseFloat(window.getComputedStyle(receiptEl).width) || receiptEl.getBoundingClientRect().width || 680);
    if (baseWidth < 500) baseWidth = 620;
  } else {
    baseWidth = Math.ceil(parseFloat(window.getComputedStyle(receiptEl).width) || receiptEl.getBoundingClientRect().width || 600);
    if (baseWidth < 300) baseWidth = 420;
  }

  // Margin putih di sekeliling nota
  const paddingX = isThermal ? 16 : 28;
  const paddingY = isThermal ? 20 : 28;
  const totalWidth = baseWidth + (paddingX * 2);

  // Kumpulkan semua rules CSS dari document untuk diinjeksikan langsung ke iframe
  let inlineCss = '';
  try {
    for (const sheet of document.styleSheets) {
      try {
        if (sheet.cssRules) {
          for (const rule of sheet.cssRules) {
            inlineCss += rule.cssText + '\n';
          }
        }
      } catch (e) {
        // Abaikan cross-origin stylesheet jika ada
      }
    }
  } catch (e) {}

  // Buat iframe terisolasi bebas dari scroll, flexbox, overflow, dan viewport clipping
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = totalWidth + 'px';
  iframe.style.height = '12000px';
  iframe.style.zIndex = '999999';
  iframe.style.border = 'none';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="style.css">
        <style>
          ${inlineCss}
          * { box-sizing: border-box; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            width: ${totalWidth}px !important;
            min-height: auto !important;
            overflow: visible !important;
          }
          #capture-wrapper {
            display: block;
            width: ${totalWidth}px;
            padding: ${paddingY}px ${paddingX}px;
            background: #ffffff;
            box-sizing: border-box;
          }
          .receipt-body {
            box-shadow: none !important;
            margin: 0 auto !important;
            ${isThermal ? '' : `width: ${baseWidth}px !important;`}
            max-width: 100% !important;
          }
        </style>
      </head>
      <body>
        <div id="capture-wrapper">
          ${receiptEl.outerHTML}
        </div>
      </body>
      </html>
    `);
    doc.close();

    // Tunggu fonts & reflow
    if (doc.fonts && doc.fonts.ready) {
      await doc.fonts.ready;
    }
    await new Promise(resolve => setTimeout(resolve, 200));

    const targetEl = doc.getElementById('capture-wrapper') || doc.body;
    const targetHeight = Math.ceil(targetEl.scrollHeight || targetEl.offsetHeight || targetEl.getBoundingClientRect().height);
    const targetWidth = totalWidth;

    const canvas = await html2canvas(targetEl, {
      scale: 2, // Kualitas HD tajam 2x Retina
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: targetWidth,
      height: targetHeight,
      windowWidth: targetWidth,
      windowHeight: targetHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0
    });

    const imgData = canvas.toDataURL('image/png');
    const safeStore = (appState && appState.storeName ? appState.storeName : 'TOKO').replace(/[^a-zA-Z0-9]/g, '_');
    const safeNo = (appState && appState.receiptNo ? appState.receiptNo : 'NOTA').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${safeNo}_${safeStore}.png`;

    const link = document.createElement('a');
    link.href = imgData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Gagal mendownload PNG:", err);
    alert("Gagal membuat gambar PNG: " + err.message);
  } finally {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }

    if (downloadBtn) {
      downloadBtn.textContent = originalText;
      downloadBtn.disabled = false;
    }
  }
}

// Inisialisasi jika berjalan di browser
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initBrowserApp);
}

// Node.js module export untuk unit testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatRupiah,
    calculateSubtotal,
    calculateTotal,
    escapeHtml,
    getDefaultState,
    renderReceipt,
    renderTemplate1,
    renderTemplate2,
    renderTemplate3,
    renderTemplate4,
    renderTemplate5,
    renderTemplate6,
    renderTemplate7,
    renderTemplate8,
    renderTemplate9,
    renderTemplate10,
    renderTemplate11,
    renderTemplate12,
    renderTemplate13,
    renderTemplate14,
    renderTemplate15,
    renderTemplate16,
    renderTemplate17,
    renderTemplate18,
    renderTemplate19,
    renderTemplate20,
    getDefaultLogoColors,
    getLogoColor,
    getStoreInitial,
    randomizeLogoColors
  };
}
