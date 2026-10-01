// test-all-14.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Test all 14 templates
  for (let i = 1; i <= 14; i++) {
    await page.click(`button[data-template="${i}"]`);
    await new Promise(r => setTimeout(r, 150));

    const result = await page.evaluate(async (tplNum) => {
      const paper = document.getElementById('receiptPaper');
      const receiptEl = paper.querySelector('.receipt-body') || paper;

      // Jalankan download logic
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

      const canvas = await html2canvas(wrapper, {
        scale: 2,
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

      document.body.removeChild(wrapper);
      if (paperStage) paperStage.scrollTop = prevStageScrollTop;
      window.scrollTo(prevWindowScrollX, prevWindowScrollY);

      return {
        tplNum,
        width: canvas.width,
        height: canvas.height,
        dataUrl: canvas.toDataURL('image/png')
      };
    }, i);

    console.log(`Template ${i} dimension: ${result.width}x${result.height}`);
    const base64Data = result.dataUrl.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(`tpl-${i}.png`, base64Data, 'base64');
  }

  console.log("All 14 templates saved.");
  await browser.close();
})();
