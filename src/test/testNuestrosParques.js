const { scrapeNuestrosParques } = require('../scraping/nuestrosParques');

(async () => {
  try {
    console.log("Iniciando prueba de scraping para Nuestros Parques...");
    const resultado = await scrapeNuestrosParques();

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
