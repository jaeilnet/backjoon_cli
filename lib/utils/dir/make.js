const fs = require("fs");
const path = require("path");

const accessDir = require("./access");
const errorHandling = require("../lib/error");

/**
 * 디렉토리 생성
 * @param {string} dir 디렉토리 경로
 * @returns {string} 디렉토리 경로
 */

const makeDir = (dir) => {
  try {
    let resDir = "";

    const dirname = path
      .relative(".", path.normalize(dir))
      .split(path.sep)
      .filter((p) => !!p);

    dirname.forEach((d, idx) => {
      const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
      if (!accessDir(pathBuilder)) {
        fs.mkdirSync(pathBuilder);

        resDir = pathBuilder;
      }
    });

    console.log(`디렉토리: ${resDir} 생성완료`);
    return resDir;
  } catch (error) {
    errorHandling(error);
  }
};

module.exports = makeDir;
