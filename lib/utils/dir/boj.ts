import fs from 'fs/promises';
import path from 'path';

import { makeDir } from './make.js';

import { errorHandling } from '../common/error.js';
import { IProblemCrawlerResponseType } from '../../type/index.js';
import { esmTemplate } from '../../template/esm.js';

import { exec } from 'node:child_process';

export const makeBoj = (
	_answer: string,
	ioResult: IProblemCrawlerResponseType,
): boolean => {
	const template = esmTemplate(ioResult);

	try {
		const dirPath = makeDir(_answer);

		for (let i = 0; i < ioResult.io.count; i++) {
			const index = i + 1;
			const createInputFilePath = path.join(dirPath, `input${index}.txt`);
			const createOutputFilePath = path.join(dirPath, `output${index}.txt`);
			const createProblemFilePath = path.join(dirPath, 'index.js');

			fs.writeFile(createInputFilePath, ioResult.io.input[i]);
			fs.writeFile(createOutputFilePath, ioResult.io.output[i]);
			fs.writeFile(createProblemFilePath, template);
		}

		console.log(`문제번호: ${dirPath} 생성완료\n`);

		exec(`code ${dirPath}/index.js`);

		return true;
	} catch (error) {
		errorHandling(error);
		return false;
	}
};
