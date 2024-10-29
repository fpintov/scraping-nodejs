const express = require('express');
const { scrapeCementerioMetropolitano } = require('./scraping/cementerioMetropolitano');
const { scrapeNuestrosParques } = require('./scraping/nuestrosParques');
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

    //console.log(`Datos de Cementerio Metropolitano: ${JSON.stringify(cementerioMetropolitano)}`);
    //console.log(`Datos de Nuestros Parques: ${JSON.stringify(nuestrosParques)}`);
    //console.log(`Datos de Parque del Sendero: ${JSON.stringify(parqueSendero)}`);

    // Combinamos todos los resultados en un solo array
    const resultadoFinal = [
      ...cementerioMetropolitano,
      ...nuestrosParques,
      ...parqueSendero
    ];

    res.json(resultadoFinal);

  } catch (error) {
    console.error('Error al realizar el scraping:', error);
    res.status(500).json({ message: 'Error al obtener los datos', error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
