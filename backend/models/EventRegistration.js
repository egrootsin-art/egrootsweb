// models/EventRegistration.js
const { contestConn } = require("../db");
const { Schema } = require("mongoose");

const eventRegistrationSchema = new Schema(
  {
    eventId: String,
    eventName: String,
    name: String,
    email: String,
    password: String, // hash in real app
  },
  { timestamps: true }
);

module.exports = contestConn.model("EventRegistration", eventRegistrationSchema);
