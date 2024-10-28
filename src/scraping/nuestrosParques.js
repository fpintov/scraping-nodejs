const puppeteer = require('puppeteer');

// Función para convertir a Title Case
const toTitleCase = (str) => {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

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

    const resultado = [];
    for (let i = 0; i < 7; i++) {
      await page.waitForSelector('.container_links_parques', { timeout: 60000 });
      const parques = await page.$$('.container_links_parques li a img');

      const src = await page.evaluate(el => el.src, parques[i]);
      let cementerio;
      let region;

      // Asignar cementerio y región según la imagen
      switch (true) {
        case src.includes('/1.svg'):
          cementerio = 'Nuestros Parques-El Prado';
          region = 'Región Metropolitana';
          break;
        case src.includes('/101.svg'):
          cementerio = 'Nuestros Parques-Canaán';
          region = 'Región Metropolitana';
          break;
        case src.includes('/103.svg'):
          cementerio = 'Nuestros Parques-Santiago Huechuraba';
          region = 'Región Metropolitana';
          break;
        case src.includes('/1031.svg'):
          cementerio = 'Nuestros Parques-Santiago Los Olivos';
          region = 'Región Metropolitana';
          break;
        case src.includes('/102.svg'):
          cementerio = 'Nuestros Parques-Templo Parque El Manantial';
          region = 'Región Metropolitana';
          break;
        case src.includes('/11.svg'):
          cementerio = 'Nuestros Parques-La Foresta-La Serena';
          region = 'Región de Coquimbo';
          break;
        case src.includes('/cinerario.svg'):
          cementerio = 'Nuestros Parques-Cinerario El Manantial';
          region = 'Región Metropolitana';
          break;
        default:
          cementerio = '';
          region = '';
      }

      console.log(`Haciendo clic en el parque: ${cementerio}`);
      await parques[i].click();
      await page.waitForNavigation({ waitUntil: 'load', timeout: 0 });

      // Extraer los datos de la tabla y pasar cementerio y region al contexto de evaluación
      const datosFallecidos = await page.evaluate((cementerio, region, toTitleCase) => {
        const rows = Array.from(document.querySelectorAll('tbody tr'));
        const data = [];

        rows.forEach(row => {
          let nombre = row.querySelector('td:nth-child(1)')?.innerText.trim();

          // Convertir el nombre a Title Case
          if (nombre) {
            nombre = toTitleCase(nombre);
          }

          // Obtener la fecha actual en formato dd-mm-yyyy
          const fechaActual = new Date();
          const dia = String(fechaActual.getDate()).padStart(2, '0');
          const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
          const anio = fechaActual.getFullYear();
          const fechaServicio = `${dia}-${mes}-${anio}`; // Formato estandarizado

          // Agregar los datos extraídos de la fila
          if (nombre && fechaServicio && region) {
            data.push({
              destino: cementerio, // Cementerio correspondiente
              region: region,
              nombre: nombre,
              fechaServicio: fechaServicio
            });
          }
        });

        return data;
      }, cementerio, region, toTitleCase); // Pasamos cementerio, region y la función toTitleCase a page.evaluate

      resultado.push(...datosFallecidos); // Agregamos los datos de este cementerio

      await page.goto(mainURL, { waitUntil: 'load', timeout: 0 });
      console.log("Regresando a la página principal...");
    }

    await browser.close();
    console.log("Navegador cerrado.");
    return resultado;

  } catch (error) {
    console.error("Ocurrió un error:", error);
    return [];
  }
};

module.exports = { scrapeNuestrosParques };
