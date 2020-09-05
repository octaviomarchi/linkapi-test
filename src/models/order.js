const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  idPedido: {
    type: String,
    required: true,
    unique: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  dataPedido: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("order", schema);
