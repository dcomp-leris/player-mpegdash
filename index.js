const puppeteer = require('puppeteer');
const fs = require('fs');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const logs = [];

  const config = {
    headless: false,
    defaultViewport: null,
    // args: ['--start-maximized'],
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  };

  const browser = await puppeteer.launch(config);

  const page = await browser.newPage();

  page.on('console', (msg) => {
    console.log('LOG:', msg.text());
    logs.push(msg.text());
  });

  await page.goto(`file://${__dirname}/index.html`);

  // const videoDuration = await page.evaluate(() => {
  //   const video = document.querySelector('video');

  //   return video.duration;
  // });
  const videoDuration = 5 * 1000; // 5 seconds

  await page.click('video');

  await wait(videoDuration);

  await browser.close();

  const time = new Date()
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })
    .replace(/[\/\s:]|, /g, '-');

  fs.writeFileSync(`logs-${time}.txt`, logs.join('\n'));
})();
