const express = require("express")
const app = express();
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());

const authRoter = require("./routes/auth");
const requestRouter = require("./routes/requests");
const profileRouter = require("./routes/profile");

app.use("/", authRoter);
app.use("/",profileRouter);
app.use("/", requestRouter);

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
