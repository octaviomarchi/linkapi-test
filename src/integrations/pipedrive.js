const pipedrive = require("pipedrive");
const config = require("../config");

pipedrive.Configuration.apiToken = config.pipedriveToken;

exports.getAllDeals = async () => {
  return await pipedrive.DealsController.getAllDeals({});
};

exports.getUserData = async () => {
  return await pipedrive.UsersController.getCurrentUserData();
}
