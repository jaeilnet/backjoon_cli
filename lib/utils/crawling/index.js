const cheerio = require("cheerio");
const axios = require("axios");
const errorHandling = require("../common/error");

/**
 * 백준 문제 입력과 결과 값 type
 * @typedef {Object} Result
 * @property {string[]} input - 입력 값
 * @property {string[]} output - 결과 값
 * @property {number} count - 갯수
 *
 */

/**
 * @param {number} problemNumber 문제번호
 * @returns {Promise.<Result>} Result

 */
const crawling = async (problemNumber) => {
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

    let count = 1;

    while (count) {
      const input = $(`#sample-input-${count}`).text();
      const output = $(`#sample-output-${count}`).text();

      if (!input || !output) break;

      result["input"].push(input);
      result["output"].push(output);
      count++;
    }

    return {
      ...result,
      count: count - 1,
    };
  } catch (error) {
    errorHandling(error);
  }
};

module.exports = crawling;
