const mongoose= require("mongoose");

async function connectMongo(URI) {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB Connected to host:", mongoose.connection.host);
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
  }
}


module.exports={
    connectMongo,
}