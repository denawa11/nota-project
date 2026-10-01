// test-laptop-viewport.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  // Standard laptop screen: 1366x768
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  page.on('console', msg => console.log('LOG:', msg.text()));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Tambahkan 10 barang sehingga nota sangat panjang (~2000px)
  for (let i = 0; i < 10; i++) {
    await page.click('#addItemBtn');
  }

  // Pilih template 9 (Vertikal Tall yang sangat memanjang ke bawah)
  await page.click('button[data-template="9"]');
  await new Promise(r => setTimeout(r, 200));

  // User scroll ke tengah atau bawah preview
  await page.evaluate(() => {
    const stage = document.querySelector('.paper-stage');
    if (stage) stage.scrollTop = 800; // scroll 800px ke bawah
  });

  // Klik tombol Download PNG asli di halaman
  await page._client().send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: 'C:\\Users\\ptxin\\Downloads\\nota generator'
  });

  await page.click('#downloadPngBtn');

  // Tunggu proses download selesai
  await new Promise(r => setTimeout(r, 2500));

  console.log("Download test selesai.");
  await browser.close();
})();
