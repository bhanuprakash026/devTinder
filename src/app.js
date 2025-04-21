const express = require("express")
const app = express();

app.use('/', (req, res) => {
  res.send('Hello From Home Route!')
})

app.listen(7777, () => {
  console.log('Server is Running on PORT 7777')
})