const { constants, accessSync } = require("node:fs");

/**
 * 생성 전에 디렉토리가 이미 존재하는지 검사
 * @param {string} dir 디렉토리 경로
 * @returns
 */
const accessDir = (dir) => {
  try {
    const isOk = constants.F_OK || constants.R_OK || constants.W_OK;
    accessSync(dir, isOk);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = accessDir;
