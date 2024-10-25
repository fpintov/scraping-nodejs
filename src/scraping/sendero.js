const puppeteer = require('puppeteer');

const scrapeSendero = async () => {
  try {
    console.log("Iniciando Puppeteer para Parque del Sendero...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const url = 'https://sendero.cl/funerales-del-dia';
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    console.log("Página de Parque del Sendero cargada correctamente.");

    // Esperamos a que el selector de la tabla esté presente
    await page.waitForSelector('table.table tbody', { timeout: 10000 });

    // Añadimos una pausa adicional de 3 segundos para dar tiempo a que se carguen los datos
    await new Promise(resolve => setTimeout(resolve, 3000)); // Pausa de 3 segundos

    // Extraer el número de funerales (filas de la tabla)
    const numFilas = await page.evaluate(() => {
      const filas = document.querySelectorAll('table.table tbody tr');
      // Restamos 1 para no contar la fila de encabezado
      return filas.length - 1;
    });

    console.log(`Número de funerales: ${numFilas}`);

    await browser.close();
    return { "Parque del Sendero": numFilas };

  } catch (error) {
    console.error('Error haciendo scraping en Parque del Sendero:', error);
    return { "Parque del Sendero": 0 };
  }
};

module.exports = { scrapeSendero };
