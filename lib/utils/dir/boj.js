const { writeFileSync } = require("node:fs");
const { join } = require("node:path");

const makeDir = require("./make");
const template = require("../../template");
const errorHandling = require("../common/error");

const makeBoj = async (_answer, ioResult) => {
  const { input, output, count } = ioResult;

  const _template = template();

  try {
    const dirPath = makeDir(_answer);

    for (let i = 0; i < count; i++) {
      const index = i + 1;
      const createInputFilePath = join(dirPath, `input${index}.txt`);
      const createOutputFilePath = join(dirPath, `output${index}.txt`);
      const createProblemFilePath = join(dirPath, "index.js");

      writeFileSync(createInputFilePath, input[i]);
      writeFileSync(createOutputFilePath, output[i]);
      writeFileSync(createProblemFilePath, _template);
    }

    console.log(`문제번호: ${dirPath} 생성완료`);
    return true;
  } catch (error) {
    errorHandling(error);
    return false;
  }
};

module.exports = makeBoj;
