#!/usr/bin/env node

const readline = require("readline");

const accessDir = require("./utils/dir/access");
const makeBoj = require("./utils/dir/boj");
const makeDir = require("./utils/dir/make");
const crawling = require("./utils/crawling");

const line = require("./utils/lib/line");
const errorHandling = require("./utils/lib/error");

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
      return;
    }

    if (accessDir(problemNum)) {
      errorHandling("이미 생성한 문제 입니다.");
      return;
    }

    try {
      // 백준 입력란의 갯수
      const inputCount = 5;
      const ioResult = await crawling(problemNum, inputCount);

      if (!ioResult) {
        rl.close();
        return;
      }

      const { input, output } = ioResult;

      if (root) {
        const dirPath = makeDir(root);
        const problemNumPath = `${dirPath}/${problemNum}`;
        await makeBoj(problemNumPath, input, output);
        return;
      }

      await makeBoj(problemNum, input, output);
    } catch (error) {
      errorHandling(error);
      rl.close();
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

/**
 * 처음 설정하는 디렉토리 경로의 중복을 체크하는 함수
 *
 * accessDir 은 디렉토리의 중복을 확인하는 함수
 * @param {string} dir - 디렉토리 경로
 * @returns {Promise.<string>} 디렉토리 경로
 */

qSetRootDir();
