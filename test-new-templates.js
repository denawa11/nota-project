// test-new-templates.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Menguji download PNG untuk template baru (15 s.d. 20)...");
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Tambahkan 5 barang baru sehingga nota panjang
  for (let i = 0; i < 5; i++) {
    await page.click('#addItemBtn');
  }

  const downloadDir = path.resolve(__dirname, 'verify-new-downloads');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  await page._client().send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadDir
  });

  const newTemplates = [15, 16, 17, 18, 19, 20];
  for (const tpl of newTemplates) {
    fs.readdirSync(downloadDir).forEach(f => fs.unlinkSync(path.join(downloadDir, f)));

    await page.click(`button[data-template="${tpl}"]`);
    await new Promise(r => setTimeout(r, 200));

    // Scroll stage untuk memastikan scroll offset tidak mempengaruhi hasil
    await page.evaluate(() => {
      const stage = document.querySelector('.paper-stage');
      if (stage) stage.scrollTop = 450;
    });

    await page.click('#downloadPngBtn');

    let downloadedFile = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 300));
      const files = fs.readdirSync(downloadDir).filter(f => f.endsWith('.png'));
      if (files.length > 0) {
        downloadedFile = path.join(downloadDir, files[0]);
        break;
      }
    }

    if (downloadedFile) {
      const dest = path.resolve(__dirname, `verify-tpl-${tpl}.png`);
      fs.copyFileSync(downloadedFile, dest);
      console.log(`Template ${tpl} berhasil: diunduh dan disimpan ke verify-tpl-${tpl}.png`);
    } else {
      console.error(`Template ${tpl} GAGAL download!`);
      process.exit(1);
    }
  }

  await browser.close();
  console.log("Semua template baru (15-20) berhasil diuji!");
})();
