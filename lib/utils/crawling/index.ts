import cheerio from 'cheerio';
import axios from 'axios';
import { errorHandling } from '../common/error.js';
import {
	IOResultType,
	IProblemCrawlerResponseType,
	IProblemCrawlerType,
	ProblemCrawlerKey,
	ProblemNumberType,
} from '../../type/index.js';

export const copyProblem = async (
	problemNumber: ProblemNumberType,
): Promise<IProblemCrawlerResponseType> => {
	try {
		const url = `https://www.acmicpc.net/problem/${problemNumber}`;

		const res = await axios.get<string>(url, {
			headers: {
				'user-agent':
					'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
				'Accept-Charset': 'utf-8',
			},
		});

		const io: IOResultType = {
			input: [],
			output: [],
			count: 0,
		};

		const problemResult: IProblemCrawlerType = {
			description: {
				title: '',
				desc: [],
			},
			input: {
				title: '',
				desc: [],
			},
			output: {
				title: '',
				desc: [],
			},
		};

		const $ = cheerio.load(res.data);

		if ($('.error-v1-title').text() === '404') {
			throw Error('존재하지 않는 문제입니다');
		}

		for (const key in problemResult) {
			const title = $(`#${key} > .headline > h2`).text();

			$(`#${key} > #problem_${key}`).each((i, el) => {
				problemResult[key as ProblemCrawlerKey].desc.push($(el).text().trim());
			});

			problemResult[key as ProblemCrawlerKey].title = title;
		}

		for (let count = 1; ; count++) {
			const input = $(`#sample-input-${count}`).text();
			const output = $(`#sample-output-${count}`).text();

			if (input.length === 0 || output.length === 0) break;

			io.input.push(input);
			io.output.push(output);
			io.count = count;
		}

		return {
			...problemResult,
			io,
			url,
		};
	} catch (error) {
		errorHandling(error);
		throw Error('문제 가져오기 실패');
	}
};
