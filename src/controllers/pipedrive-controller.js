const pipedrive = require("../integrations/pipedrive");

exports.getDeals = async (req, res, next) => {
  const parameters = {status: 'won'};

  try {
    const data = await pipedrive.getDeals(parameters);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
