import fs from 'fs/promises';
import path from 'path';

import { makeDir } from './make.js';

import { errorHandling } from '../common/error.js';
import { IOResultType } from '../../type/index.js';
import { esmTemplate } from '../../template/esm.js';
import { commonTemplate } from '../../template/common.js';
import { getPackageModuleType } from '../common/module.js';

export const makeBoj = (_answer: string, ioResult: IOResultType): boolean => {
	const { input, output, count } = ioResult;

	const template =
		getPackageModuleType() === 'commonjs' ? commonTemplate() : esmTemplate();

	try {
		const dirPath = makeDir(_answer);

		for (let i = 0; i < count; i++) {
			const index = i + 1;
			const createInputFilePath = path.join(dirPath, `input${index}.txt`);
			const createOutputFilePath = path.join(dirPath, `output${index}.txt`);
			const createProblemFilePath = path.join(dirPath, 'index.js');

			fs.writeFile(createInputFilePath, input[i]);
			fs.writeFile(createOutputFilePath, output[i]);
			fs.writeFile(createProblemFilePath, template);
		}

		console.log(`문제번호: ${dirPath} 생성완료`);
		return true;
	} catch (error) {
		errorHandling(error);
		return false;
	}
};
