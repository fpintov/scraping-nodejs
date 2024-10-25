const puppeteer = require('puppeteer');

const scrapeNuestrosParques = async () => {
  try {
    console.log("Iniciando Puppeteer...");
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-web-security', 
        '--disable-features=IsolateOrigins,site-per-process',
        '--no-sandbox'
      ]
    });
    const page = await browser.newPage();
    const mainURL = 'https://autoconsulta.nuestrosparques.cl/BuscarObituario?w=1';

    await page.goto(mainURL, {
      waitUntil: 'load',
      timeout: 0
    });
    console.log("Página cargada correctamente.");

    const resultado = {};
    for (let i = 0; i < 7; i++) {
      await page.waitForSelector('.container_links_parques', { timeout: 60000 });
      const parques = await page.$$('.container_links_parques li a img');

      const src = await page.evaluate(el => el.src, parques[i]);
      let cementerio;

      switch (true) {
        case src.includes('/1.svg'):
          cementerio = 'Nuestros Parques - El Prado';
          break;
        case src.includes('/101.svg'):
          cementerio = 'Nuestros Parques - CANAÁN';
          break;
        case src.includes('/103.svg'):
          cementerio = 'Nuestros Parques - Santiago Huechuraba';
          break;
        case src.includes('/1031.svg'):
          cementerio = 'Nuestros Parques - Santiago Los Olivos';
          break;
        case src.includes('/102.svg'):
          cementerio = 'Nuestros Parques - Templo Parque El Manantial';
          break;
        case src.includes('/11.svg'):
          cementerio = 'Nuestros Parques - La Foresta - La Serena';
          break;
        case src.includes('/cinerario.svg'):
          cementerio = 'Nuestros Parques - Cinerario El Manantial';
          break;
        default:
          cementerio = 'Desconocido';
      }

      console.log(`Haciendo clic en el parque: ${cementerio}`);
      await parques[i].click();
      await page.waitForNavigation({ waitUntil: 'load', timeout: 0 });

      let numRows = await page.evaluate(() => {
        const rows = document.querySelectorAll('tbody tr');
        return Array.from(rows).filter(row => row.offsetParent !== null).length;
      });

      if (numRows > 1) {
        numRows -= 1;
      }

      resultado[cementerio] = numRows;

      await page.goto(mainURL, { waitUntil: 'load', timeout: 0 });
      console.log("Regresando a la página principal...");
    }

    await browser.close();
    console.log("Navegador cerrado.");
    return resultado;

  } catch (error) {
    console.error("Ocurrió un error:", error);
    return {};
  }
};

module.exports = { scrapeNuestrosParques };
