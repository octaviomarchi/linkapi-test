const mongoose = require("mongoose");
const Order = mongoose.model("order");

exports.createOrders = async (orders) => {
  const createdOrders = [];

  orders.forEach(async (element) => {
    try {
      const newOreder = await Order.findOneAndUpdate(
        { idPedido: element.idPedido },
        element,
        { upsert: true }
      );
      createdOrders.push(newOreder);
    } catch (error) {
      console.log(error);
      return {};
    }
  });

  return createdOrders;
};

exports.findAll = async () => {
  const orders = await Order.find({}, 'idPedido valor dataPedido -_id', {sort: {date: -1}});
  return orders;
};
