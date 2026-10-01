// test-png-verify.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Memulai verifikasi download PNG...");
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Tambahkan 10 barang lagi sehingga total 13 barang
  for (let i = 0; i < 10; i++) {
    await page.click('#addItemBtn');
  }

  // Pilih template 9 (Vertikal Tall)
  await page.click('button[data-template="9"]');
  await new Promise(r => setTimeout(r, 200));

  // Simulasikan user scroll ke bawah preview sebelum download
  await page.evaluate(() => {
    const stage = document.querySelector('.paper-stage');
    if (stage) stage.scrollTop = 950;
    window.scrollTo(0, 400);
  });

  // Siapkan folder download sementara
  const downloadDir = path.resolve(__dirname, 'verify-downloads');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  await page._client().send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadDir
  });

  // Hapus isi folder download sebelum tes
  fs.readdirSync(downloadDir).forEach(f => fs.unlinkSync(path.join(downloadDir, f)));

  // Klik tombol download PNG
  console.log("Mengklik tombol #downloadPngBtn...");
  await page.click('#downloadPngBtn');

  // Tunggu download selesai
  let downloadedFile = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    const files = fs.readdirSync(downloadDir).filter(f => f.endsWith('.png'));
    if (files.length > 0) {
      downloadedFile = path.join(downloadDir, files[0]);
      break;
    }
  }

  if (!downloadedFile) {
    console.error("FAILED: File PNG tidak terdownload!");
    process.exit(1);
  }

  const stats = fs.statSync(downloadedFile);
  console.log("File berhasil didownload:", downloadedFile, `(${stats.size} bytes)`);

  // Salin ke file verifikasi untuk diinspeksi
  const targetCheckPath = path.resolve(__dirname, 'verified-output.png');
  fs.copyFileSync(downloadedFile, targetCheckPath);
  console.log("Tersimpan sebagai verified-output.png");

  await browser.close();
  console.log("Test sukses selesai!");
})();
