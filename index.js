const cron = require('node-cron');
const puppeteer = require('puppeteer');

async function runBot() {
  const browser = await puppeteer.launch({ headless: true });
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  await page.goto('https://votacion-mujeres-en-innovacion.pages.dev/');

  await page.waitForSelector('button.vote-button', { timeout: 20000 });
  await page.$$eval('button.vote-button', (buttons) => {
    const target = Array.from(buttons).find(btn => btn.textContent.includes('Patricia Alejandra Velazquez'));
    if (target) target.click();
  });

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
}

// Función para loop con intervalo variable (0 a 20 seg)
async function runBotLoop() {
  try {
    await runBot();
  } catch (err) {
    console.error('❌ Error en bot:', err);
  }
  const nextDelay = Math.floor(Math.random() * 2000); // 0-20000 ms
  console.log(`Próxima ejecución en ${nextDelay / 1000} segundos`);
  setTimeout(runBotLoop, nextDelay);
}

// Iniciar loop
runBotLoop();
