import fs from "fs";
import path from "path";

import { makeDir } from "./make.js";

import { errorHandling } from "../common/error.js";
import { IOResultType } from "../../type/index.js";
import { template } from "../../template/index.js";

export const makeBoj = async (
  _answer: string,
  ioResult: IOResultType
): Promise<boolean> => {
  const { input, output, count } = ioResult;

  const _template = template();

  try {
    const dirPath = makeDir(_answer);

    for (let i = 0; i < count; i++) {
      const index = i + 1;
      const createInputFilePath = path.join(dirPath, `input${index}.txt`);
      const createOutputFilePath = path.join(dirPath, `output${index}.txt`);
      const createProblemFilePath = path.join(dirPath, "index.js");

      fs.writeFileSync(createInputFilePath, input[i]);
      fs.writeFileSync(createOutputFilePath, output[i]);
      fs.writeFileSync(createProblemFilePath, _template);
    }

    console.log(`문제번호: ${dirPath} 생성완료`);
    return true;
  } catch (error) {
    errorHandling(error);
    return false;
  }
};
