#!/usr/bin/env node

const readline = require("node:readline");

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

class Question {
  constructor() {
    this.root = null;
    this.problemNum = null;
    this.path = `${this.root}/${this.problemNum}`;
    this.ioResult = {
      input: [],
      output: [],
      count: null,
    };
  }

  qSetRootDir = async () => {
    return new Promise((resolve) => {
      rl.question("디렉토리를 설정하시겠습니까? (y/n): ", (answer) => {
        const answerType = ["y", "n"];

        if (!answerType.includes(answer)) {
          errorHandling("y/n 으로만 입력해주세요");
          resolve(this.qSetRootDir());
        }

        if (answer === "y") {
          resolve(this.qMakeRootDir());
        } else {
          resolve(this.qMakeBoj());
        }
      });
    });
  };

  qMakeRootDir = async () => {
    rl.question("생성할 디렉토리 이름을 설정해주세요: ", async (root) => {
      if (accessDir(root)) {
        const setRoot = await this.retryCreateDir();

        if (setRoot) {
          this.root = setRoot;
          this.qMakeBoj();
        }
        return;
      }

      this.root = root;
      this.qMakeBoj();
    });
  };

  qMakeBoj = async () => {
    rl.question("문제번호를 입력해주세요. ex)1084: ", async (answer) => {
      const problemNum = answer.trim();
      const isValidAnswer = isNaN(Number(problemNum));

      if (isValidAnswer) {
        errorHandling("숫자만 입력해주세요");
        this.qMakeBoj();
        return;
      }

      if (accessDir(problemNum)) {
        errorHandling("이미 생성한 문제 입니다.");
        this.qMakeBoj();
        return;
      }

      try {
        const ioResult = await crawling(problemNum);

        if (!ioResult.count) {
          rl.close();
          return;
        }

        this.problemNum = problemNum;
        this.ioResult = ioResult;

        if (this.root) {
          let root = this.root;

          if (!accessDir(root)) {
            root = makeDir(root);
          }

          const problemNumPath = `${root}/${problemNum}`;
          this.path = problemNumPath;

          const isMakeBoj = await makeBoj(problemNumPath, ioResult);
          if (isMakeBoj) await this.qSubmit();

          return;
        }

        this.path = problemNum;

        const isMakeBoj = await makeBoj(problemNum, ioResult);
        if (isMakeBoj) await this.qSubmit();
      } catch (error) {
        errorHandling(error);
        rl.close();
      }
    });
  };

  qSubmit = async () => {
    rl.setPrompt("코드 실행하기");
    rl.prompt();

    rl.on("line", async () => {
      const isAnswer = await submit(this.path, this.ioResult);

      if (isAnswer) {
        this.qMakeBoj();
      }
    });
  };

  /**
   * 디렉토리 재시도 함수
   * @returns {Promise.<string>} - 디렉토리 경로
   */
  retryCreateDir = async () => {
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
}

const question = new Question();
question.qSetRootDir();
