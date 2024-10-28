const axios = require('axios');
const cheerio = require('cheerio');

const scrapeCementerioMetropolitano = async () => {
  try {
    const url = 'https://cementeriometropolitano.cl/funerales-dia/Index.aspx'; 
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const funerales = [];

    // Obtener la fecha actual en formato dd-mm-yyyy
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const anio = fechaActual.getFullYear();
    const fechaServicio = `${dia}-${mes}-${anio}`;

    $('.div_fallecidos').each((i, el) => {
      // Obtenemos todos los spans dentro del div_fallecidos
      const spans = $(el).find('span.dxeBase');
      let nombreCompleto = '';

      // Concatenamos el texto de los spans que contienen el nombre y apellido (excluyendo el primero que es la hora)
      spans.each((index, span) => {
        if (index >= 1 && index <= 2) { // Capturamos los spans del nombre y apellido
          nombreCompleto += $(span).text().trim() + ' ';
        }
      });

      nombreCompleto = nombreCompleto.trim(); // Quitamos el espacio extra al final

      funerales.push({
        destino: 'Cementerio-Metropolitano',
        region: 'Región Metropolitana',
        nombre: nombreCompleto,
        fechaServicio: fechaServicio // Usamos la fecha actual
      });
    });

    return funerales;

  } catch (error) {
    console.error('Error haciendo scraping:', error);
    return [];
  }
};

module.exports = { scrapeCementerioMetropolitano };
