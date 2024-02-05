const cheerio = require("cheerio");
const axios = require("axios");
const errorHandling = require("../common/error");

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

    const res = await axios.get(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
        "Accept-Charset": "utf-8",
      },
    });

    const result = {
      input: [],
      output: [],
    };

    const $ = cheerio.load(res.data);

    if ($(".error-v1-title").text() === "404") {
      throw Error("존재하지 않는 문제입니다");
    }

    for (let i = 1; i <= inputCount; i++) {
      const input = $(`#sample-input-${i}`).text();
      const output = $(`#sample-output-${i}`).text();

      if (!input || !output) break;

      result["input"].push(input);
      result["output"].push(output);
    }

    return result;
  } catch (error) {
    errorHandling(error);
  }
};

module.exports = crawling;
