const { scrapeCementerioMetropolitano } = require('../scraping/cementerioMetropolitano');

(async () => {
    try {
      const resultado = await scrapeCementerioMetropolitano();
      if (resultado.length > 0) {
        console.log("Datos extraídos correctamente:");
        console.log(JSON.stringify(resultado, null, 2));
      } else {
        console.log("No se extrajo ningún dato.");
      }
    } catch (error) {
      console.error("Error durante la prueba de scraping:", error);
    }
  })();
