#!/usr/bin/env node

import readline from 'readline';

import { accessDir } from './utils/dir/access.js';
import { makeBoj } from './utils/dir/boj.js';
import { makeDir } from './utils/dir/make.js';
import { copyProblem } from './utils/crawling/index.js';

import { errorHandling } from './utils/common/error.js';
import { examine } from './utils/examine/index.js';
import { type IOResultType } from './type/index.js';
import { getPackageModuleType } from './utils/common/module.js';

export class Question {
	root: string | null = null;
	problemNum: string | null = null;
	path: string = '';
	ioResult: IOResultType = { input: [], output: [], count: 0 };
	rl: readline.Interface;

	constructor(rl: readline.Interface) {
		this.rl = rl;
	}

	qSetRootDir = async () => {
		if (getPackageModuleType() !== 'module') {
			console.log('ESM으로 실행해주시기 바랍니다.');
			this.rl.close();
			return;
		}

		const answer = await this.askQuestion(
			'사용하실 디렉토리를 설정하시겠습니까? (y/n): ',
		);

		const answerType = ['y', 'n'];
		if (!answerType.includes(answer)) {
			errorHandling('y/n 으로만 입력해주세요');
			this.qSetRootDir();
		}

		if (answer === 'y') {
			await this.qMakeRootDir();
		} else {
			await this.qMakeBoj();
		}
	};

	qMakeRootDir = async (): Promise<void> => {
		this.root = await this.askQuestion('생성할 디렉토리 이름을 설정해주세요: ');
		await this.qMakeBoj();
	};

	qMakeBoj = async (): Promise<void> => {
		const answer = await this.askQuestion('문제번호를 입력해주세요. ex)1084: ');
		const problemNum = answer.trim();

		if (isNaN(Number(problemNum))) {
			errorHandling('숫자만 입력해주세요');
			await this.qMakeBoj();
			return;
		}

		if (accessDir(problemNum)) {
			errorHandling('이미 생성한 문제 입니다.');
			await this.qMakeBoj();
			return;
		}

		try {
			const ioResult = await copyProblem(problemNum);

			if (ioResult.count === 0) {
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

				const isMakeBoj = makeBoj(problemNumPath, ioResult);
				if (isMakeBoj) await this.qCheck();

				return;
			}

			this.path = problemNum;

			if (makeBoj(problemNum, ioResult)) {
				await this.qCheck();
			}
		} catch (error) {
			errorHandling(error);
			this.rl.close();
		}
	};

	qCheck = async (): Promise<void> => {
		this.rl.on('SIGINT', async () => {
			const answer = await this.askQuestion(
				'다른 문제를 푸시려면 (y/n)을 입력해주세요, 종료하시려면 아무 키나 눌러주십시오. ',
			);

			const answerType = ['y', 'n'];
			if (!answerType.includes(answer)) {
				this.rl.close();
				return;
			}

			if (answer === 'y') {
				await this.qMakeBoj();
			} else {
				console.log('계속 진행해주세요.');
				await this.qCheck();
				return;
			}
		});

		this.rl.resume();
		this.rl.setPrompt('코드 실행하기\n');
		this.rl.prompt();

		this.rl.on('line', async () => {
			const isAnswer = await examine(this.path, this.ioResult);

			if (isAnswer) {
				await this.qMakeBoj();
			}
		});
	};

	/**
	 * 디렉토리 생성 재시도 함수
	 */
	async retryCreateDir(): Promise<string | null> {
		let count = 1;

		while (count <= 3) {
			errorHandling('디렉토리가 이미 존재합니다.');
			const dir = await this.askQuestion('다른 이름을 입력해주세요: ');
			if (accessDir(dir)) {
				count++;
			} else {
				return dir;
			}
		}

		errorHandling('디렉토리 정리 후 다시 시도해주세요.');
		this.rl.close();
		return null;
	}

	/**
	 * 질문하는 함수
	 */
	private async askQuestion(question: string): Promise<string> {
		return await new Promise((resolve) => {
			this.rl.question(`${question}\n`, (answer) => {
				resolve(answer.trim());
			});
		});
	}
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdin,
});

const question = new Question(rl);
void question.qSetRootDir();
