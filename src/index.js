const express = require('express');
const { scrapeCementerioMetropolitano } = require('./scraping/cementerioMetropolitano');
const { scrapeNuestrosParques } = require('./scraping/nuestrosParques(puppeteer)');
const { scrapeSendero } = require('./scraping/sendero');

const app = express();
const PORT = 3000;

console.log('Iniciando servidor...');

app.get('/fallecidos', async (req, res) => {
  try {
    console.log('Realizando scraping...');

    // Ejecutar todos los procesos de scraping en paralelo
    const [cementerioMetropolitano, nuestrosParques, parqueSendero] = await Promise.all([
      scrapeCementerioMetropolitano(),
      scrapeNuestrosParques(),
      scrapeSendero()
    ]);

    console.log(`Total fallecidos cementerioMetropolitano: ${cementerioMetropolitano}`);
    console.log(`Datos de Nuestros Parques: ${JSON.stringify(nuestrosParques)}`);
    console.log(`Datos de Parque del Sendero: ${JSON.stringify(parqueSendero)}`);

    // Combinamos el resultado en un solo objeto plano
    const resultadoFinal = {
      cementerioMetropolitano,
      ...nuestrosParques,
      ...parqueSendero // Expande los campos de parqueSendero en el objeto principal
    };

    res.json(resultadoFinal);

  } catch (error) {
    console.error('Error al realizar el scraping:', error);
    res.status(500).json({ message: 'Error al obtener los datos', error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/fallecidos`);
});

