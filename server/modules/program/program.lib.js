const extend = require("lodash/extend");
const { Program, Step, STEP_MODES } = require("./program.model");
const errorHandler = require("../../helpers/dbErrorHandler");

const PROGRAM = [
  generateStep(STEP_MODES.SINGLE_OPTION, {
    title: "Welcome to the program",
  }),
  generateStep(STEP_MODES.MULTI_OPTIONS, {
    title: "Agreement",
  }),
  generateStep(STEP_MODES.NUMBER, {
    title: "Age in years?",
  }),
];

function generateStep(stepMode, payload = {}) {
  return {
    stepMode,
    ...payload,
  };
}
/**
 *
 */
function completeStep(_stepIn = {}, _res = {}) {
  switch (_stepIn.mode) {
    case STEP_MODES.ANSWER:
      if (_res.payload) {
        _stepIn.res = _res;
      } else {
      }
      break;
  }
  console.log(STEP_MODES);
  return { ...stepIn };
}
/**
 *
 */
function getProgramStatus(idx = 0) {
  // const program = Program.findById(programId);
  // const stepIdx = program.stepIdx;
  // const step = program.steps[stepIdx];
  // console.log(program);
  return PROGRAM[idx];
}

const create = async () => {};

module.exports = {
  getProgramStatus,
  PROGRAM,
};
