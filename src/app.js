const express = require("express")
const app = express();
const connectDB = require('./config/database')
const User = require('./models/user')

app.use(express.json())

app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save(user);
    res.send("User added successfully!")
  } catch (error) {
    res.status(400).send(error.message)
  }

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

app.post("/user", async (req, res) => {
  const { firstName, updateData } = req.body
  try {
    const updatedUser = await User.findOneAndUpdate({ firstName: firstName }, { $set: updateData }, { new: true });
    if (updatedUser) {
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
      console.log("updatedUser", updatedUser)
    } else {
      res.status(404).json({ message: 'User not found' });
    }

  } catch (error) {

  }
})

connectDB()
  .then(() => {
    console.log('Database connection established Successfully');
    app.listen(7777, () => {
      console.log('Server is Running on PORT 7777')
    })
  })
  .catch((error) => {
    console.log(error.message);
  })
