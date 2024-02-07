import { IOResultType } from "../../type/index.js";

import fs from "fs";
import path from "path";

export const submit = async (
  dirPath: string,
  ioResult: IOResultType
): Promise<boolean> => {
  let isAnswerCorrect = false;

  const rootDirPath = process.env.PWD;
  const dirName = `${rootDirPath}/${dirPath}`;

  const getIoFilePath = (file: string): string => {
    return process.platform === "linux"
      ? "/dev/stdin"
      : path.join(dirName, file);
  };

  const watchSolution = async (input: string) => {
    const problem = await import(`${dirName}/index.js`);

    return problem.default(input);
  };

  const { count } = ioResult;

  for (let i = 1; i <= count; i++) {
    const inputPath = getIoFilePath(`input${i}.txt`);
    const outputPath = getIoFilePath(`output${i}.txt`);

    const readInputTxt = fs.readFileSync(inputPath).toString().trim();
    const readOutputTxt = fs.readFileSync(outputPath).toString().trim();

    const result = await watchSolution(readInputTxt);

    console.log("-----------------------");
    console.log("Test Case", i);
    console.log("\nExpected Output:\n");
    console.log(readOutputTxt);
    console.log("\nActual Output:\n");
    console.log(result);
    console.log("-----------------------");

    // todo: 정답 체크하기
    isAnswerCorrect = true;
  }

  return isAnswerCorrect;
};

// node -e "console.log(import('/Users/gv03/Documents/npm/backjoon_auto_input_js/boj/1084/index.js')('3\n6 7 8\n21'))"
