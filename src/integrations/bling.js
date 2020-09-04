const config = require("../config");
const axios = require("axios").default;

const blingBaseUrl = "https://bling.com.br/Api/v2";

async function makeRequest(method, route, data) {
  try {
    axios
      .request({
        baseURL: blingBaseUrl,
        url: route,
        method: method,
        data: data,
        params: { apikey: config.blingToken },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("Error on response for request " + blingBaseUrl + route);
        console.log(error);
        return error;
      });
  } catch (error) {
    console.log("Error on bling.makeRequest");
    console.log(error);
  }
}

exports.postOrder = async (order) => {
  const route = "/pedido/json/";
  try {
    const createdOrder = await makeRequest("post", route, order);
    return createdOrder;
  } catch (error) {
    console.log("Error on bling.postOrder:");
    console.log(error);
    return {};
  }
};
