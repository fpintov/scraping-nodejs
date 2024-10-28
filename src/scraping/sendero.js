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

    // Extraer los datos de la tabla
    const scrapingData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      const data = [];

      rows.forEach(row => {
        let nombre = row.querySelector('td:nth-child(1)')?.innerText.trim();
        const fechaServicio = row.querySelector('td:nth-child(2)')?.innerText.trim();
        let region = row.querySelector('td:nth-child(5)')?.innerText.trim();

        // Asignamos la región según el valor extraído
        switch (region) {
          case 'CONCEPCION':
            region = 'Región del Biobío';
            break;
          case 'MAIPU':
            region = 'Región Metropolitana';
            break;
          case 'SACRAMENTAL PARQUE PADRE HURTADO':
            region = 'Región Metropolitana';
            break;
          case 'VILLA ALEMANA':
            region = 'Región de Valparaíso';
            break;
          case 'IQUIQUE':
            region = 'Región de Tarapacá';
            break;
          case 'SAN BERNARDO':
            region = 'Región Metropolitana';
            break;
          case 'VALPARAISO':
            region = 'Región de Valparaíso';
            break;
          case 'ARICA':
            region = 'Región de Arica y Parinacota';
            break;
          case 'RANCAGUA':
            region = "Región de O'Higgins";
            break;
          default:
            region = 'No disponible';
            break;
        }

        // Eliminamos 'Q.E.P.D.' del nombre si existe
        if (nombre) {
          nombre = nombre.replace('Q.E.P.D', '').trim();
          nombre = nombre.replace('Sr. ', '').trim();
          nombre = nombre.replace('Sra. ', '').trim();
        }

        if (nombre && fechaServicio && region) {
          data.push({
            destino: "Parque del Sendero", // Se asigna el destino fijo
            region: region,
            nombre: nombre,
            fechaServicio: fechaServicio
          });
        }
      });

      return data;
    });

    await browser.close();

    // Devolvemos directamente los datos en un formato estandarizado
    return scrapingData;

  } catch (error) {
    console.error('Error haciendo scraping en Parque del Sendero:', error);
    return [];
  }
};

module.exports = { scrapeSendero };
