#!/usr/bin/env node

import readline from "readline";

import { accessDir } from "./utils/dir/access.js";
import { makeBoj } from "./utils/dir/boj.js";
import { makeDir } from "./utils/dir/make.js";
import { copyProblem } from "./utils/crawling/index.js";

import { errorHandling } from "./utils/common/error.js";
import { submit } from "./utils/submit/index.js";
import { IOResultType } from "./type/index.js";

export class Question {
  root: string | null;
  problemNum: string | null;
  path: string;
  ioResult: IOResultType;
  rl: readline.Interface;

  constructor(rl: readline.Interface) {
    this.root = null;
    this.problemNum = null;
    this.path = `${this.root}/${this.problemNum}`;
    this.ioResult = {
      input: [],
      output: [],
      count: 0,
    };
    this.rl = rl;
  }

  qSetRootDir = async () => {
    return new Promise((resolve) => {
      this.rl.question("디렉토리를 설정하시겠습니까? (y/n): ", (answer) => {
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
    this.rl.question("생성할 디렉토리 이름을 설정해주세요: ", async (root) => {
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
    this.rl.question("문제번호를 입력해주세요. ex)1084: ", async (answer) => {
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
        const ioResult = await copyProblem(problemNum);

        if (!ioResult.count) {
          this.rl.close();
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
        this.rl.close();
      }
    });
  };

  qSubmit = async () => {
    this.rl.setPrompt("코드 실행하기");
    this.rl.prompt();

    this.rl.on("line", async () => {
      const isAnswer = await submit(this.path, this.ioResult);

      if (isAnswer) {
        this.qMakeBoj();
      }
    });
  };

  /**
   * 디렉토리 생성 재시도 함수
   */
  retryCreateDir = async (): Promise<string> => {
    let count = 1;

    const rename = (): Promise<string> => {
      errorHandling("디렉토리가 이미 존재합니다.");

      if (count > 3) {
        errorHandling("디렉토리 정리 후 다시 시도해주세요.");
        this.rl.close();
      }

      return new Promise<string>((resolve) => {
        this.rl.question("다른 이름을 입력해주세요: ", (dir) => {
          if (accessDir(dir)) {
            count++;
            resolve(rename());
          } else {
            resolve(dir);
          }
        });
      });
    };

    return await rename();
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdin,
});

const question = new Question(rl);
question.qSetRootDir();
