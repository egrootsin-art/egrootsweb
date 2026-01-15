// backend/db.js
const mongoose = require("mongoose");

const mainConn = mongoose.createConnection(process.env.MONGO_URL);
const contestConn = mongoose.createConnection(process.env.MONGO_URL_CONTEST);

mainConn.on("connected", () => console.log("✅ Connected to test DB"));
contestConn.on("connected", () => console.log("✅ Connected to contestdb"));

module.exports = { mainConn, contestConn };
