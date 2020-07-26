const generate = require("@babel/generator").default;
const prettier = require("prettier");

function ast2stirng(ast) {
  const output = generate(ast, {});
  const { code } = output;
  // return code
  const prettierCode = prettier.format(code, {
    semi: false,
    parser: "babel",
  });
  return prettierCode;
}

module.exports = ast2stirng;
