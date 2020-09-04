const xmlBuilder = require('xmlbuilder', { encoding: 'utf-8' });

const pipedrive = require("../integrations/pipedrive");
const bling = require("../integrations/bling");
// const order = require("../models/order");
const xmlbuilder = require("xmlbuilder");

exports.getOrders = async (req, res, next) => {
  //get pipedrive deals
  const pipedriveDeals = await getPipedriveWonDeals();

  //transform the delas into bling xml request format
  const blingXml = pipedriveOrderToBlingXml(pipedriveDeals);

  // get all the return
  const blingOrders = await bling.postOrder(blingXml);
  
};

async function getPipedriveWonDeals() {
  const parameters = { status: "won" };

  try {
    const deals = await pipedrive.getDeals(parameters);
    return deals;
  } catch (error) {
    console.log("Error at getPipedriveWonDeals");
    console.log(error);
    return {};
  }
}

function pipedriveOrderToBlingXml(pipedriveOrders) {
  let root = xmlbuilder.begin().dec('1.0', 'UTF-8');

  pipedriveOrders.data.forEach((order) => {
    let pedido = root.ele("pedido");
    pedido
      .ele("cliente")
        .ele("nome", {}, order.person_id.name ? order.person_id.name : 'No name').up()
      .up()
      .ele("data", {}, order.won_time).up()
      .ele("numero", {}, order.id).up()
      .ele("itens")
        .ele("item")
          .ele("codigo", {}, "999")
          .ele("descricao", {}, "produto da venda").up()
          .ele("qtde", {}, 1).up()
          .ele("vlr_unit", {}, parseFloat(order.weighted_value).toFixed(2) ).up()
        .up()
      .up();
  });

  const xml = root.end();
  return xml;
}
