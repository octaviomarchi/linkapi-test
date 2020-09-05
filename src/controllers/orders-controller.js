const xmlbuilder = require("xmlbuilder");

const pipedrive = require("../integrations/pipedrive");
const bling = require("../integrations/bling");
const orderRepository = require("../repositories/order-repository");

exports.getOrders = async (req, res, next) => {
  //get pipedrive deals
  const pipedriveDeals = await getPipedriveWonDeals();

  //transform the deals into bling xml request format
  const blingXmlArray = pipedriveDealsToBlingXml(pipedriveDeals);

  // get all the return
  blingXmlArray.forEach(blingXml => {
    bling.postOrder(blingXml);
  });

  // prepare orders to be saved in the db
  const orderModels = pipedriveDealsToOrderModels(pipedriveDeals);

  //save orders to mongo
  try {
    await orderRepository.createOrders(orderModels);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }

  //get all orders
  let allOrders = [];
  try {
    allOrders = await orderRepository.findAll();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }

  res.status(200).send(allOrders);
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

function pipedriveDealsToBlingXml(pipedriveDeals) {
  const xmlArray = [];

  pipedriveDeals.data.forEach((order) => {
    let root = xmlbuilder.begin().dec("1.0", "UTF-8");
    let pedido = root.ele("pedido");
    // prettier-ignore
    pedido
      .ele("cliente")
        .ele("nome", {}, order.person_id.name ? order.person_id.name : "No name").up()
      .up()
      .ele("data", {}, order.won_time).up()
      .ele("numero", {}, order.id).up()
      .ele("itens")
        .ele("item")
          .ele("codigo", {}, "999").up()
          .ele("descricao", {}, "produto da venda").up()
          .ele("qtde", {}, 1).up()
          .ele("vlr_unit", {}, parseFloat(order.weighted_value).toFixed(2)).up()
        .up()
      .up();
      
      const xml = root.end();
      xmlArray.push(xml);
  });

  return xmlArray;
}

function pipedriveDealsToOrderModels(pipedriveDeals) {
  const orderModels = [];

  pipedriveDeals.data.forEach((order) => {
    const model = {
      idPedido: order.id,
      valor: order.weighted_value,
      dataPedido: order.won_time,
    };

    orderModels.push(model);
  });

  return orderModels;
}

function orderModelsToReturnObject(orderModels){
  
}
