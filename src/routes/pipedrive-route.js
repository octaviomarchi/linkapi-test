const express = require("express");
const router = express.Router();
const controller = require("../controllers/pipedrive-controller");

router.get("/deals", controller.getDeals);

module.exports = router;
