import { type IOResultType } from '../../type/index.js';

import fs from 'fs';
import path from 'path';

export const examine = async (
	dirPath: string,
	ioResult: IOResultType,
): Promise<boolean> => {
	let isAnswerCorrect = false;

	const rootDirPath = process.env.PWD;
	const dirName = `${rootDirPath}/${dirPath}`;

	const getIoFilePath = (file: string): string => {
		return process.platform === 'linux'
			? '/dev/stdin'
			: path.join(dirName, file);
	};

	const watchSolution = async (input: string): Promise<string> => {
		const path = `${dirName}/index.js?version=${Date.now()}`;
		const problem = await import(path);
		const result = await problem.default(input);

		return result.toString();
	};

	const { count } = ioResult;

	for (let i = 1; i <= count; i++) {
		const inputPath = getIoFilePath(`input${i}.txt`);
		const outputPath = getIoFilePath(`output${i}.txt`);

		const readInputTxt = fs.readFileSync(inputPath).toString().trim();
		const readOutputTxt = fs.readFileSync(outputPath).toString().trim();

		const result = await watchSolution(readInputTxt);

		console.log('-----------------------');
		console.log('\nTest Case', i);
		console.log('\nExpected Output:\n');
		console.log(readOutputTxt);
		console.log('\nActual Output:\n');
		console.log(result);
		console.log('-----------------------');

		if (result === readOutputTxt) {
			console.log('정답입니다');
			isAnswerCorrect = true;
		} else {
			console.log('틀렸습니다.');
			isAnswerCorrect = false;
			break;
		}

		// todo: 정답 체크하기
	}

	return isAnswerCorrect;
};
