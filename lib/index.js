#!/usr/bin/env node

const readline = require("node:readline");
const {} = require("node:path");

const accessDir = require("./utils/dir/access");
const makeBoj = require("./utils/dir/boj");
const makeDir = require("./utils/dir/make");
const crawling = require("./utils/crawling");

const errorHandling = require("./utils/common/error");
const submit = require("./utils/submit");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdin,
});

const qSetRootDir = async () => {
  return new Promise((resolve) => {
    rl.question("디렉토리를 설정하시겠습니까? (y/n): ", (answer) => {
      const answerType = ["y", "n"];

      if (!answerType.includes(answer)) {
        errorHandling("y/n 으로만 입력해주세요");
        resolve(qSetRootDir());
      }

      if (answer === "y") {
        resolve(qMakeRootDir());
      } else {
        resolve(qMakeBoj());
      }
    });
  });
};

const qMakeRootDir = () => {
  rl.question("생성할 디렉토리 이름을 설정해주세요: ", async (root) => {
    if (accessDir(root)) {
      const setRoot = await retryCreateDir();
      if (setRoot) qMakeBoj(setRoot);
      return;
    }

    qMakeBoj(root);
  });
};

/**
 *
 * @param {string} root - 디렉토리 경로를 설정한 경우 그 경로
 */
const qMakeBoj = (root) => {
  rl.question("문제번호를 입력해주세요. ex)1084: ", async (answer) => {
    const problemNum = answer.trim();
    const isValidAnswer = isNaN(Number(problemNum));

    if (isValidAnswer) {
      errorHandling("숫자만 입력해주세요");
      qMakeBoj(root);
      return;
    }

    if (accessDir(problemNum)) {
      errorHandling("이미 생성한 문제 입니다.");
      qMakeBoj(root);
      return;
    }

    try {
      const ioResult = await crawling(problemNum);

      if (!ioResult.count) {
        rl.close();
        return;
      }

      if (root) {
        const dirPath = makeDir(root);
        const problemNumPath = `${dirPath}/${problemNum}`;
        await makeBoj(problemNumPath, ioResult);
        await qSubmit(problemNumPath, ioResult);
        return;
      }

      await makeBoj(problemNum, ioResult);
      await qSubmit(problemNum, ioResult);
    } catch (error) {
      errorHandling(error);
      rl.close();
    }
  });
};

const qSubmit = async (problemNumPath, ioResult) => {
  rl.setPrompt("코드 실행하기");
  rl.prompt();

  rl.on("line", async () => {
    const isResult = submit(problemNumPath, ioResult);

    if (isResult) {
      rl.on("history", (history) => {
        console.log(`Received: ${history}`);
      });
    }
  });
};

/**
 * 디렉토리 재시도 함수
 * @returns {Promise.<string>} - 디렉토리 경로
 */
const retryCreateDir = async () => {
  let count = 1;

  function rename() {
    errorHandling("디렉토리가 이미 존재합니다.");

    if (count > 3) {
      errorHandling("디렉토리 정리 후 다시 시도해주세요.");
      rl.close();
      return;
    }

    return new Promise((resolve) => {
      rl.question("다른 이름을 입력해주세요: ", (dir) => {
        if (accessDir(dir)) {
          count++;
          resolve(rename());
        } else {
          resolve(dir);
        }
      });
    });
  }

  return await rename();
};

qSetRootDir();
