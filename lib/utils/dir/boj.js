const fs = require("node:fs");
const path = require("node:path");

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
      const createInputFilePath = path.join(dirPath, `input${index}.txt`);
      const createOutputFilePath = path.join(dirPath, `output${index}.txt`);
      const createProblemFilePath = path.join(dirPath, "index.js");

      fs.writeFileSync(createInputFilePath, input[i]);
      fs.writeFileSync(createOutputFilePath, output[i]);
      fs.writeFileSync(createProblemFilePath, _template);
    }

    console.log(`문제번호: ${dirPath} 생성완료`);
  } catch (error) {
    errorHandling(error);
  }
};

module.exports = makeBoj;
