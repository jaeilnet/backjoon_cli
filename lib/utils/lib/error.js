/**
 *
 * @param {string | Error} error - 에러메세지
 */
const errorHandling = (error) => {
  if (error instanceof Error) console.log(error.message);
  else console.log(error);
};

module.exports = errorHandling;
