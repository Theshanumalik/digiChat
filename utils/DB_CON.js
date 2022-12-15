const mongoose = require("mongoose");
const { DB_URI } = require("./KEY");

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI || DB_URI);
    if (conn) {
      console.log("CONNECTED TO DB SUCCESSFULL");
    }
  } catch (error) {
    console.log("FAILED TO CONNECT", error);
  }
};

module.exports = dbConnection;
