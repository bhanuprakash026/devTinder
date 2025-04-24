const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://bhanutankasala26:Bhanu2609@namastenode.mbcy9es.mongodb.net/devTinder')
}

module.exports = connectDB