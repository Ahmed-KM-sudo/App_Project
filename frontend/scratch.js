
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  // Set local storage token so it doesn't redirect to login
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('token', 'fake-token-for-test');
  });

  console.log('Navigating to apply?edit=true...');
  await page.goto('http://localhost:5173/apply?edit=true', { waitUntil: 'networkidle0' });

  await browser.close();
})();
