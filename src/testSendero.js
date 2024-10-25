const { scrapeSendero } = require('./scraping/sendero');

(async () => {
  try {
    const resultado = await scrapeSendero();
    if (resultado.success) {
      console.log(`Archivo guardado en: ${resultado.filePath}`);
    } else {
      console.error('Error al guardar el archivo:', resultado.error);
    }
  } catch (error) {
    console.error('Error ejecutando el scraping:', error);
  }
})();
