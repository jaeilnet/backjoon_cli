const template = () => {
  const inputTemplate = `
    const fs = require("fs");

    const filePath = process.platform === "linux" ? "/dev/stdin" : "./input1.txt";

    const input = fs.readFileSync(filePath).toString().trim();

    console.log(input)
`;

  return inputTemplate;
};

module.exports = template;
