const db = require('../infrastructure/Postgre');
const vtexApi = require('../infrastructure/VTex');
const transportadora = require('../controller/TransportadoraController');
const dataHora = require('../util/util');

module.exports = async function executaRotinaDeEstornos() {
  const ordens = await db.leTodos();
  if(!ordens || ordens.length == 0) {
    console.log(`${dataHora}: -- Não há estornos para serem realizados ---`); return;
  } 

  const ids = ordens.map(o => o.logistic_id);
  const { data } = await transportadora.rastrearOrdens(ids)
  const ordemChecadas = Object.values(data);
  if(!ordemChecadas || ordemChecadas.length == 0) {
    console.log(`${dataHora}: -- Nenhum dos pedidos retornou a loja ---`); return;
  } 
  
  ordensQueChegaram = ordemChecadas.filter(ordem => ordem.status === "released");
  const ordensFiltradas = ordens.filter(o => ordensQueChegaram.map(o => o.id).includes(o.logistic_id));
  
  ordensFiltradas.map(ordem => {
    vtexApi.refund(ordem.transaction_id, ordem.price).then(() => {
      db.deleta(ordem.transaction_id);
      db.insereTabelaRealizados(ordem.transaction_id, ordem.order_id, ordem.logistic_id, ordem.price, ordem.numero_coleta);
      console.log(`${dataHora}: Transação ${ordem.transaction_id} da ordem ${order.order_id} foi estornada!`);
    },
    (err) => {
      console.log(`${dataHora}: deu águia: ${err}`);
      console.log(err.response.data);
    });
  });
};




