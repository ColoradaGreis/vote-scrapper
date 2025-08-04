const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  await page.goto('https://votacion-mujeres-en-innovacion.pages.dev/');

  // Ahora sí, acá deberías poder encontrar los botones de votar
  await page.waitForSelector('button.vote-button', { timeout: 20000 });
  await page.$$eval('button.vote-button', (buttons) => {
    const target = Array.from(buttons).find(btn => btn.textContent.includes('Patricia Alejandra Velazquez'));
    if (target) target.click();
  });

  // El resto del flujo igual que antes:
  await page.waitForSelector('button.swal2-confirm', { timeout: 7000 });
  await page.$$eval('button.swal2-confirm', (buttons) => {
    const target = Array.from(buttons).find(btn => btn.textContent.includes('Sí, votar'));
    if (target) target.click();
  });

  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.waitForSelector('button.swal2-confirm', { timeout: 7000 });
  await page.$$eval('button.swal2-confirm', (buttons) => {
    const target = Array.from(buttons).find(btn => btn.textContent.trim() === 'OK');
    if (target) target.click();
  });

  await new Promise(resolve => setTimeout(resolve, 2000));
  await browser.close();
})();
