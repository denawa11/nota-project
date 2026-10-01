// test-png-multi.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Verifikasi multi template...");
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Tambahkan 6 barang
  for (let i = 0; i < 6; i++) {
    await page.click('#addItemBtn');
  }

  const downloadDir = path.resolve(__dirname, 'verify-multi-downloads');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  await page._client().send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadDir
  });

  const templates = [1, 2, 8, 10, 14];
  for (const tpl of templates) {
    // Hapus file lama di folder
    fs.readdirSync(downloadDir).forEach(f => fs.unlinkSync(path.join(downloadDir, f)));

    await page.click(`button[data-template="${tpl}"]`);
    await new Promise(r => setTimeout(r, 200));

    // Scroll stage
    await page.evaluate(() => {
      const stage = document.querySelector('.paper-stage');
      if (stage) stage.scrollTop = 500;
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
      console.log(`Template ${tpl} berhasil di-download & disimpan ke verify-tpl-${tpl}.png`);
    } else {
      console.error(`Template ${tpl} GAGAL download!`);
    }
  }

  await browser.close();
  console.log("Semua template sukses diverifikasi!");
})();
