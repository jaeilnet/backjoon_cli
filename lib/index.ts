#!/usr/bin/env node

import readline from 'readline';

import { accessDir } from './utils/dir/access.js';
import { makeBoj } from './utils/dir/boj.js';
import { makeDir } from './utils/dir/make.js';
import { copyProblem } from './utils/crawling/index.js';

import { errorHandling } from './utils/common/error.js';
import { submit } from './utils/submit/index.js';
import { type IOResultType } from './type/index.js';

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
		const answer = await this.askQuestion(
			'디렉토리를 설정하시겠습니까? (y/n): ',
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
		const root = await this.askQuestion(
			'생성할 디렉토리 이름을 설정해주세요: ',
		);
		if (accessDir(root)) {
			this.root = await this.retryCreateDir();
		} else {
			this.root = root;
		}

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
				if (isMakeBoj) await this.qSubmit();

				return;
			}

			this.path = problemNum;

			const isMakeBoj = makeBoj(problemNum, ioResult);
			if (isMakeBoj) await this.qSubmit();
		} catch (error) {
			errorHandling(error);
			this.rl.close();
		}
	};

	qSubmit = async (): Promise<void> => {
		this.rl.setPrompt('코드 실행하기');
		this.rl.prompt();

		this.rl.on('line', async () => {
			const isAnswer = await submit(this.path, this.ioResult);

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
			this.rl.question(question, (answer) => {
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
