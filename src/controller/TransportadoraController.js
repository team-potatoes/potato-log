const melhorEnvio = require('../infrastructure/MelhorEnvio');
const db = require('../infrastructure/Postgre');

class TransportadoraController {
  constructor() { }

  async geraCodigo(req, res) {
    const { transaction_id, order_id, name, price } = req.body
    const products = [{ name, quantity: 1, unitary_value: price }];

    request = { ...request, products }

    try {
      const jaRealizouProcessoDeEstorno = await db.procuraPorTransactionIdRealizados(transaction_id);
      if(jaRealizouProcessoDeEstorno.length > 0) return res.json({ message: "Pedido já estornado!" });

      const estaEmProcessoDeEstorno = await db.procuraPorTransactionId(transaction_id);
      if(estaEmProcessoDeEstorno.length > 0) {
        const numero_coleta = parseInt(estaEmProcessoDeEstorno[0].numero_coleta)
        return res.json({ numero_coleta });
      }

      const { data } = await melhorEnvio.inserirFretesNoCarrinho(request);
      await melhorEnvio.checkout(data.id);
      await melhorEnvio.gerarEtiqueta(data.id);
      melhorEnvio.imprimirEtiqueta(data.id);

      const numero_coleta = Date.now()
      db.insere(transaction_id, order_id, data.id, price, numero_coleta);

      return res.json({ numero_coleta });
    } catch (err) {
      if (!err.response) {
        console.log(err);
        return res.status(500).json({ message: 'Deu água!' });
      }

      return res.status(400).json({
        message: err.response.data.message || err.response.data.error,
        errors: err.response.data.errors,
      });
    }
  }

  rastrearOrdens(logisticIds) {
    return melhorEnvio.rastrearEnvio(logisticIds);
  }
}

let request = {
  service: 2,
  agency: 242,
  from: {
    name: 'Thalita Colofatti',
    phone: '21983391656',
    email: 'felipe.fadul@hotmail.com',
    document: '72979580007',
    company_document: '89794131000100',
    state_register: '123456',
    address: 'Rua João Alfredo de Freitas',
    complement: '',
    number: '1',
    district: 'São Paulo',
    city: 'São Paulo',
    country_id: 'BR',
    postal_code: '02930020',
    note: ''
  },
  to: {
    name: 'Potatoes Store',
    phone: '53984470102',
    email: 'contato@potatoestore.com.br',
    document: '99300873032',
    company_document: '89792321000100',
    state_register: '123456',
    address: 'Rua Tapirama',
    complement: '',
    number: '1',
    district: 'Vila Constança',
    city: 'São Paulo',
    country_id: 'BR',
    postal_code: '04658100',
    note: ''
  },
  volumes: [
    {
      height: 15,
      width: 20,
      length: 10,
      weight: 3
    }
  ],
  options: {
    insurance_value: 1000,
    receipt: false,
    own_hand: false,
    reverse: true,
    non_commercial: false,
    invoice: {
      key: '31190307586261000184550010000092481404848162'
    },
    platform: 'Potato Store',
    tags: [
      {
        tag: 'Potato Store',
        url: 'https://hiringcoders10.myvtex.com/'
      }
    ]
  }
}

module.exports = new TransportadoraController()