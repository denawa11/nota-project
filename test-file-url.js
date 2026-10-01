// test-file-url.js
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('FILE LOG:', msg.text()));
  page.on('pageerror', err => console.log('FILE ERROR:', err.message));

  await page.goto('file:///C:/Users/ptxin/Downloads/nota%20generator/index.html', { waitUntil: 'networkidle0' });

  console.log("File URL berhasil dimuat.");

  // Coba jalankan downloadReceiptAsPNG via file://
  const res = await page.evaluate(async () => {
    try {
      await downloadReceiptAsPNG();
      return "SUCCESS";
    } catch (e) {
      return "ERROR: " + e.message;
    }
  });

  console.log("Hasil via file:// :", res);
  await browser.close();
})();
