import { IProblemCrawlerResponseType } from 'lib/type';

export const esmTemplate = ({
	description,
	input,
	output,
	url,
	io,
}: IProblemCrawlerResponseType) => {
	const inputTemplate = `
/*

문제링크 ${url}

${description.title}
${description.desc}

${input.title}
${input.desc}

${output.title}
${output.desc}

입력예제1)
${io.input[0]}

출력예제1)
${io.output[0]}

총 TC 수: ${io.count}

*/

function solution(input) {
  console.log('입력 값: ',input)

  let answer = "";

  return answer;
}

// 지우지마시오
export default solution
`;

	return inputTemplate;
};
