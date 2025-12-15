// models/EventRegistration.js
const { contestConn } = require("../db");
const { Schema } = require("mongoose");

const ParticipantSchema = new Schema(
  {
    name: String,
    email: String,
    password: String, // hash in real app
  },
  { timestamps: true }
);

module.exports = contestConn.model("Participant", ParticipantSchema);
