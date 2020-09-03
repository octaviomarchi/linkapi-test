const pipedrive = require("../integrations/pipedrive");

exports.getDeals = async (req, res, next) => {
  try {
    const data = await pipedrive.getAllDeals();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
