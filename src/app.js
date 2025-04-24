const express = require("express")
const app = express();
const connectDB = require('./config/database')
const User = require('./models/user')

app.post('/signup', async (req, res) => {
    const user = new User({
        firstName: "John",
        lastName: "Doe",
        emailId: "john.doe@gmail.com",
        age: 25,
        gender: "male",
        password: "John@123"
    })

    await user.save();
    res.send("User added successfully!")
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
