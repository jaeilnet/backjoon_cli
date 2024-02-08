import fs from "fs";
import path from "path";

import { accessDir } from "./access.js";
import { errorHandling } from "../common/error.js";

/**
 * 디렉토리 생성
 */
export const makeDir = (dir: string): string => {
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
    throw Error("디렉토리 생성 실패");
  }
};
