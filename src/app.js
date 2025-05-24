const express = require("express")
const app = express();
const connectDB = require('./config/database')
const User = require('./models/user');
const { validateSignUpData } = require("../src/helpers/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

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

    const doesUserExist = await User.findOne({ emailId: emailId });

    if (!doesUserExist) {
      throw new Error("Invalid Credentials");
    };
    const isPasswordValid = await bcrypt.compare(password, doesUserExist.password);
    if (isPasswordValid) {

      const token = jwt.sign({ _id: doesUserExist._id }, "DEV@Tinder$7868");
      res.cookie("token", token)
      res.send("Login Successful !!!")
    } else {
      throw new Error("Invalid Credentials")
    }

  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.get("/profile", async (req, res) => {

  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedMessage = jwt.verify(token, "DEV@Tinder$7868");

    const { _id } = decodedMessage;
    const loggedInuser = await User.findById(_id);
    if (!loggedInuser) {
      throw new Error("User not found");
    }
    res.send(loggedInuser);

  } catch (error) {
    res.send("ERROR : " + error.message);
  };
});

app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found!!")
    } else {
      res.send(user);
    }

  } catch (error) {
    res.status(400).send(`Something went wrong ${error.message}`)
  }
})

app.get("/feed", async (req, res) => {
  const users = await User.find({});
  try {
    res.send(users)
  } catch (error) {
    res.send(`${error.message}`)
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const allowedFields = ["age", "phoneNumber", "skills"] // example fields

  const isValidUpdate = Object.keys(data).every(field =>
    allowedFields.includes(field)
  );

  if (!isValidUpdate) {
    return res.status(400).send({
      message: "Update contains disallowed fields. Only the following fields can be updated: " + allowedFields.join(", ")
    });
  }

  if (data.skills?.length > 20) {
    return res.status(400).send({
      message: "Skills should not exceed more than 20"
    })
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      data,
      { returnDocument: "after", runValidators: true }
    );

    if (updatedUser) {
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    };
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
