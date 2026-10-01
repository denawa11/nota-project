// test-capture.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Menjalankan Chrome Headless untuk diagnostik capture...");
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Klik template 8 (Vertikal Slim)
  await page.click('button[data-template="8"]');
  await new Promise(r => setTimeout(r, 500));

  // Ambil dataURL yang dihasilkan oleh downloadReceiptAsPNG
  const dataUrl = await page.evaluate(async () => {
    // Kita jalankan logika yang sama dengan downloadReceiptAsPNG tapi ambil dataUrl-nya
    const paper = document.getElementById('receiptPaper');
    const receiptEl = paper.querySelector('.receipt-body') || paper;
    
    // Log info receiptEl
    console.log("receiptEl rect:", JSON.stringify(receiptEl.getBoundingClientRect()));
    console.log("receiptEl scrollHeight:", receiptEl.scrollHeight, "offsetHeight:", receiptEl.offsetHeight);

    const paperStage = document.querySelector('.paper-stage');
    const prevStageScrollTop = paperStage ? paperStage.scrollTop : 0;
    const prevWindowScrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
    const prevWindowScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (paperStage) paperStage.scrollTop = 0;
    window.scrollTo(0, 0);

    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.zIndex = '999999';
    wrapper.style.backgroundColor = '#ffffff';
    wrapper.style.padding = '24px';
    wrapper.style.margin = '0';
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.display = 'inline-block';
    wrapper.style.boxShadow = 'none';
    wrapper.style.border = 'none';

    const clone = receiptEl.cloneNode(true);
    const computedStyle = window.getComputedStyle(receiptEl);
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.width = computedStyle.width;
    clone.style.maxWidth = 'none';

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    await new Promise(resolve => setTimeout(resolve, 50));

    const rect = wrapper.getBoundingClientRect();
    const targetWidth = Math.ceil(rect.width);
    const targetHeight = Math.ceil(rect.height);

    console.log("wrapper rect:", JSON.stringify(rect));

    const canvas = await html2canvas(wrapper, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: true,
      width: targetWidth,
      height: targetHeight,
      windowWidth: targetWidth,
      windowHeight: targetHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0
    });

    document.body.removeChild(wrapper);
    if (paperStage) paperStage.scrollTop = prevStageScrollTop;
    window.scrollTo(prevWindowScrollX, prevWindowScrollY);

    return {
      dataUrl: canvas.toDataURL('image/png'),
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      targetWidth,
      targetHeight
    };
  });

  console.log("Hasil canvas:", {
    canvasWidth: dataUrl.canvasWidth,
    canvasHeight: dataUrl.canvasHeight,
    targetWidth: dataUrl.targetWidth,
    targetHeight: dataUrl.targetHeight
  });

  // Simpan hasil gambar ke file untuk diperiksa
  const base64Data = dataUrl.dataUrl.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync('debug-result.png', base64Data, 'base64');
  console.log("File debug-result.png berhasil disimpan!");

  await browser.close();
})();
