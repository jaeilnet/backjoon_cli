import fs from 'node:fs/promises';
import path from 'node:path';

import { accessDir } from './access.js';
import { errorHandling } from '../common/error.js';

/**
 * 디렉토리 생성
 */
export const makeDir = (dir: string): string => {
	try {
		let dirPath = dir;

		const normalizedDir = path.normalize(dir);
		const dirname = normalizedDir.split(path.sep).filter(Boolean);

		dirname.forEach((d, idx) => {
			const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
			if (!accessDir(pathBuilder)) {
				fs.mkdir(pathBuilder);
				console.log(`디렉토리: ${pathBuilder} 생성완료`);

				dirPath = pathBuilder;
			}
		});

		return dirPath;
	} catch (error) {
		errorHandling(error);
		throw Error('디렉토리 생성 실패');
	}
};
