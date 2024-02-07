const { writeFileSync } = require("node:fs");
const { join } = require("node:path");

const makeDir = require("./make");
const template = require("../../template");
const errorHandling = require("../common/error");

/**
 *
 * @param {number} _answer - 파일명(문제번호)
 * @param {string[]} input - 입력란
 * @param {string[]} output - 출력란
 */

const makeBoj = async (_answer, input, output) => {
  const _template = template();

  try {
    const dirPath = makeDir(_answer);

    for (let i = 0; i < input.length; i++) {
      const index = i + 1;
      const createInputFilePath = join(dirPath, `input${index}.txt`);
      const createOutputFilePath = join(dirPath, `output${index}.txt`);
      const createProblemFilePath = join(dirPath, "index.js");

      writeFileSync(createInputFilePath, input[i]);
      writeFileSync(createOutputFilePath, output[i]);
      writeFileSync(createProblemFilePath, _template);
    }

    console.log(`문제번호: ${dirPath} 생성완료`);
  } catch (error) {
    errorHandling(error);
  }
};

module.exports = makeBoj;
