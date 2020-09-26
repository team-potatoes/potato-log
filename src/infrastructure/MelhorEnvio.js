const axios = require('axios');

const melhorEnvioClient = axios.create({
    baseURL: process.env.URL,
    timeout: 10000,
    headers: {
        Authorization: `Bearer ${process.env.TOKEN}`
    }
});

class MelhorEnvio {
    constructor() { }

    inserirFretesNoCarrinho(request) {
        return melhorEnvioClient.post('/cart', request);
    }

    checkout(id) {
        return melhorEnvioClient.post('/shipment/checkout', { orders: [ id ] });
    }

    gerarEtiqueta(id) {
        return melhorEnvioClient.post('/shipment/generate', { orders: [ id ] });
    }

    imprimirEtiqueta(id) {
        return melhorEnvioClient.post('/shipment/print', { orders: [ id ] });
    }

    rastrearEnvio(ids) {
        return melhorEnvioClient.post('/shipment/tracking', { orders: ids });
    }

}

module.exports = new MelhorEnvio()