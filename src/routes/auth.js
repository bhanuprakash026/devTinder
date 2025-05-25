const express = require("express");
const User = require('../models/user');
const { validateSignUpData } = require("../helpers/validations");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    // Validating the Data
    validateSignUpData(req);

    // Encrypting the Password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating the new Instance of User.
    const user = new User({
      firstName, lastName, emailId, password: passwordHash
    });
    await user.save(user);
    res.send("User added successfully!")
  } catch (error) {
    res.status(400).send("ERROR : " + error.message)
  }

});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    };
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {

      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
      res.send("Login Successful !!!");
    } else {
      throw new Error("Invalid Credentials")
    }

  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = authRouter;