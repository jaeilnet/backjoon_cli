const fs = require("fs");

/**
 * 생성 전에 디렉토리가 이미 존재하는지 검사
 * @param {string} dir 디렉토리 경로
 * @returns
 */
const accessDir = (dir) => {
  try {
    const isOk = fs.constants.F_OK || fs.constants.R_OK || fs.constants.W_OK;
    fs.accessSync(dir, isOk);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = accessDir;
