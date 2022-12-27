const mongoose = require("mongoose");
const crypto = require("crypto");
const config = require("../../config/config");
const STEP_MODES_LIST = [
  "SINGLE_OPTION",
  "MULTI_OPTIONS",
  "SINGLE_LINE_TEXT",
  "MULTI_LINE_TEXT",
  "NUMBER",
];
const STEP_MODES = {
  OPTION: "OPTION",
  OPTIONS: "OPTIONS",
  TEXT: "TEXT",
  DATE: "DATE",
  NUMBER: "NUMBER",
};

const ActionSchema = new mongoose.Schema(
  {
    stepId: { type: mongoose.Schema.ObjectId, ref: "Step" },
    body: {},
  },
  { timestamps: true }
);

const StepSchema = new mongoose.Schema(
  {
    nextStepId: { type: mongoose.Schema.ObjectId, ref: "Step" },

    title: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
      trim: true,
    },
    mode: {
      type: String,
      enum: Object.keys(STEP_MODES),
      default: STEP_MODES.SINGLE_OPTION,
    },
  },
  { timestamps: true }
);

const ProgramSchema = new mongoose.Schema(
  {
    stepIdx: { type: Number, default: 0 },
    actions: [ActionSchema],
    steps: [StepSchema],
  },
  { timestamps: true }
);

module.exports = {
  Program: mongoose.model("Program", ProgramSchema),
  Step: mongoose.model("Step", StepSchema),
  Action: mongoose.model("Action", ActionSchema),
  STEP_MODES,
};
