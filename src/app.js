const express = require("express")
const app = express();
const connectDB = require('./config/database')
const User = require('./models/user');
const { validateSignUpData } = require("../src/helpers/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {

  try {

    const user = req.user
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);

  } catch (error) {
    res.send("ERROR : " + error.message);
  };
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send("Connection Request has been sent....");
  } catch (error) {
    res.send("ERROR : " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log('Database connection established Successfully');
    app.listen(7777, () => {
      console.log('Server is Running on PORT 7777')
    })
  })
  .catch((error) => {
    console.log(error.message);
  });
