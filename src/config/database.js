const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://namastenode123:namastenode123@namaste-node.4wmws.mongodb.net/devTinder");
}

module.exports = connectDB;