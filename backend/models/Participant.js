// models/EventRegistration.js
const { contestConn } = require("../db");
const { Schema } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ParticipantSchema = new Schema(
  {
    // Core identity
    id: {
      type: String,
      default: uuidv4, // required by contest system
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      default: null, // password not mandatory for payment-created users
    },

    // Contest participation flags
    round1Attendance: {
      type: Boolean,
      default: false,
    },

    round2Attendance: {
      type: Boolean,
      default: false,
    },

    round1TestcasesPassed: {
      type: Number,
      default: 0,
    },

    round1TotalTestcases: {
      type: Number,
      default: 0,
    },

    round2TestcasesPassed: {
      type: Number,
      default: 0,
    },

    round2TotalTestcases: {
      type: Number,
      default: 0,
    },

    round1Timestamp: {
      type: Date,
      default: null,
    },

    round2Timestamp: {
      type: Date,
      default: null,
    },

    round2Eligible: {
      type: Boolean,
      default: false,
    },

    // Exit / violation tracking
    exitAttemptCount: {
      type: Number,
      default: 0,
    },

    exitLogs: {
      type: [
        {
          type: {
            type: String, // tab-switch, refresh, close
          },
          timestamp: {
            type: Date,
          },
          round: {
            type: String,
          },
        },
      ],
      default: [],
    },

    // Source tracking
    source: {
      type: String,
      enum: ["payment", "admin"],
      default: "payment",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Prevent duplicate registrations by email
ParticipantSchema.index({ email: 1 }, { unique: true });

module.exports = contestConn.model("Participant", ParticipantSchema);