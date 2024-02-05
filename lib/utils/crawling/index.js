const cheerio = require("cheerio");
const request = require("request");
const errorHandling = require("../lib/error");

/**
 * 백준 문제 입력과 결과 값 type
 * @typedef {Object} Result
 * @property {string[]} input - 입력 값
 * @property {string[]} output - 결과 값
 *
 */

/**
 * @param {number} problemNumber 문제번호
 * @param {number} inputCount 가져올 입력란 갯수 default 1.
 * @returns {Promise.<Result>} Result

 */
const crawling = async (problemNumber, inputCount = 1) => {
  try {
    const url = `https://www.acmicpc.net/problem/${problemNumber}`;

    const res = await new Promise((resolve, reject) => {
      request(url, (error, res) => {
        if (error) {
          const errorMessage = "문제 불러오기 실패";
          errorHandling(errorMessage);
          reject(error);
        } else resolve(res);
      });
    });

    const result = {
      input: [],
      output: [],
    };

    const $ = cheerio.load(res.body);

    if ($(".error-v1-title").text() === "404") {
      throw Error("존재하지 않는 문제입니다");
    }

    for (let i = 1; i <= inputCount; i++) {
      const input = $(`#sample-input-${i}`).text();
      const output = $(`#sample-output-${i}`).text();

      result["input"].push(input);
      result["output"].push(output);
    }

    return result;
  } catch (error) {
    errorHandling(error);
  }
};

module.exports = crawling;
