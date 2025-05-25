const express = require("express");
const { userAuth } = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send("Connection Request has been sent....");
  } catch (error) {
    res.send("ERROR : " + error.message);
  }
});

module.exports = requestRouter;