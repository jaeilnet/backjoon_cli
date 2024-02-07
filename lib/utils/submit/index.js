const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { exec } = require("node:child_process");

const submit = async (dirPath, ioResult) => {
  const rootDirPath = process.env.PWD;
  const dirName = `${rootDirPath}/${dirPath}`;

  const getIoFilePath = (file) => {
    return process.platform === "linux" ? "/dev/stdin" : join(dirName, file);
  };

  const watchSolution = async (input) => {
    const reInput = JSON.stringify(input);
    const replaceName = reInput.replace(/"/g, "'");

    const command = `node -e "console.log(require('${dirName}/index.js')(${replaceName}))"`;

    return await new Promise((res, rej) => {
      return exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`실행 오류: ${error}`);
          return;
        }
        console.log(stdout, "stdout");
        console.log(stderr, "stderr");
        res(stdout);
      });
    });
  };

  const { count } = ioResult;

  for (let i = 1; i <= count; i++) {
    const inputPath = getIoFilePath(`input${i}.txt`);
    const outputPath = getIoFilePath(`output${i}.txt`);

    const readInputTxt = readFileSync(inputPath).toString().trim();
    const readOutputTxt = readFileSync(outputPath).toString().trim();

    const result = await watchSolution(readInputTxt);

    console.log("-----------------------");
    console.log("Test Case", i);
    console.log("\nExpected Output:\n", readOutputTxt);
    console.log("\nActual Output:\n", result);
    console.log("-----------------------");
  }

  return true;
};

module.exports = submit;
