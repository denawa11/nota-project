// test-capture-all.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Tambahkan 5 barang baru sehingga nota panjang ke bawah (melebihi tinggi layar)
  for (let i = 0; i < 5; i++) {
    await page.click('#addItemBtn');
    await new Promise(r => setTimeout(r, 50));
  }

  // Isi nama & harga barang yang baru
  const items = await page.$$('.editor-item-row');
  console.log("Total baris barang:", items.length);

  // Scroll preview ke paling bawah
  await page.evaluate(() => {
    const stage = document.querySelector('.paper-stage');
    if (stage) stage.scrollTop = stage.scrollHeight;
  });

  // Test beberapa template: 1 (Termal), 2 (Klasik), 8 (Vertikal Slim), 10 (Tiket), 13 (Card)
  const templatesToTest = [1, 2, 8, 10, 13];

  for (const tpl of templatesToTest) {
    await page.click(`button[data-template="${tpl}"]`);
    await new Promise(r => setTimeout(r, 200));

    // Siapkan handler download
    await page._client().send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: 'C:\\Users\\ptxin\\Downloads\\nota generator'
    });

    // Panggil fungsi downloadReceiptAsPNG langsung
    await page.evaluate(async () => {
      await downloadReceiptAsPNG();
    });

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("Selesai test capture semua template.");
  await browser.close();
})();
