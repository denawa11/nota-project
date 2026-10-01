// test-iframe-capture.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Tambahkan 12 barang agar nota sangat panjang (~2200px)
  for (let i = 0; i < 12; i++) {
    await page.click('#addItemBtn');
  }

  // Pilih template 9 (Vertikal Tall)
  await page.click('button[data-template="9"]');
  await new Promise(r => setTimeout(r, 200));

  // User scroll jauh ke bawah di paper stage dan window
  await page.evaluate(() => {
    const stage = document.querySelector('.paper-stage');
    if (stage) stage.scrollTop = 900;
    window.scrollTo(0, 500);
  });

  // Uji metode iframe capture
  const result = await page.evaluate(async () => {
    const paper = document.getElementById('receiptPaper');
    const receiptEl = paper.querySelector('.receipt-body') || paper;
    const computedWidth = parseInt(window.getComputedStyle(receiptEl).width) || 360;

    // 1. Buat iframe bersih
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = (computedWidth + 48) + 'px';
    iframe.style.height = '5000px';
    iframe.style.zIndex = '999999';
    iframe.style.border = 'none';
    iframe.style.opacity = '0'; // transparan agar tidak mengganggu pandangan
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="style.css">
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 24px;
            background: #ffffff;
            width: ${computedWidth + 48}px;
            min-height: auto;
            overflow: visible;
          }
        </style>
      </head>
      <body>
        ${receiptEl.outerHTML}
      </body>
      </html>
    `);
    doc.close();

    // Tunggu render CSS & font di dalam iframe
    await new Promise(r => setTimeout(r, 150));

    const target = doc.body;
    const rect = target.getBoundingClientRect();
    const actualHeight = Math.ceil(target.scrollHeight);
    const actualWidth = computedWidth + 48;

    const canvas = await html2canvas(target, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: actualWidth,
      height: actualHeight,
      windowWidth: actualWidth,
      windowHeight: actualHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0
    });

    document.body.removeChild(iframe);

    return {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      dataUrl: canvas.toDataURL('image/png')
    };
  });

  console.log("Iframe capture result:", result.canvasWidth, "x", result.canvasHeight);
  const base64Data = result.dataUrl.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync('iframe-result.png', base64Data, 'base64');
  console.log("iframe-result.png saved successfully!");

  await browser.close();
})();
