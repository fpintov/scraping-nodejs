const axios = require('axios');
const cheerio = require('cheerio');

const scrapeCementerioMetropolitano = async () => {
  try {
    const url = 'https://cementeriometropolitano.cl/funerales-dia/Index.aspx'; // URL del cementerio
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // Seleccionamos los elementos que contienen la información del obituario
    // Arreglo para almacenar la información de los funerales
    const funerales = [];
    
    // Seleccionamos los elementos con la clase que contiene la información
    $('.dxcvBreakpointsCard').each((i, el) => {
      const horaSepultacion = $(el).find('.fas.fa-clock').next().text().trim();
      const nombre = $(el).find('.fas.fa-user').next().text().trim();
      const apellido = $(el).find('.fas.fa-user').next().next().text().trim();
      const ubicacion = $(el).find('.fas.fa-map-marker-alt').next().text().trim();
      const numeroUbicacion = $(el).find('.fas.fa-map-marker-alt').next().next().text().trim();

      // Guardamos la información en un objeto
      funerales.push({
        horaSepultacion,
        nombreCompleto: `${nombre} ${apellido}`,
        ubicacion,
        numeroUbicacion
      });
    });

    // Devolvemos solo el número de funerales encontrados
    return funerales.length;
    
  } catch (error) {
    console.error('Error haciendo scraping:', error);
    return [];
  }
};

module.exports = { scrapeCementerioMetropolitano };
