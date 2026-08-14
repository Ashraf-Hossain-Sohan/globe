const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('response', async (response) => {
    if (response.url().includes('/api/auth/login')) {
      console.log('Response Status:', response.status());
      console.log('Response Headers:', response.headers());
      try {
        const text = await response.text();
        console.log('Response Body:', text);
      } catch (e) {
        console.log('Could not read body:', e.message);
      }
    }
  });

  await page.goto('http://localhost:5173');
  await page.type('#password', '123'); // appending to 'admin123' or overwriting?
  // Actually, let's just click the button because it has 'admin123' by default!
  
  // Clear and type
  await page.click('#password', { clickCount: 3 });
  await page.type('#password', 'admin123');
  
  await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/auth/login')),
    page.click('button[type="submit"]')
  ]);
  
  // Wait a bit to see if there's any error on the screen
  await new Promise(r => setTimeout(r, 1000));
  
  const errorText = await page.evaluate(() => {
    const el = document.querySelector('.login-error');
    return el ? el.innerText : null;
  });
  console.log('Error on screen:', errorText);

  await browser.close();
})();
