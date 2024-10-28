const { scrapeSendero } = require('../scraping/sendero');

(async () => {
  try {
    const resultado = await scrapeSendero();
    if (resultado) {
      console.log('Resultado del scraping:', resultado);
    } else {
      console.error('Error al extraer datos de la página');
    }
  } catch (error) {
    console.error('Error ejecutando el scraping:', error);
  }
})();
