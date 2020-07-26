const { parse } = require("@babel/parser");
const fse = require("fs-extra");

function codeParser(code, file) {
  const options = {
    sourceType: "module",
    plugins: [
      "jsx",
      "classProperties",
      [
        "decorators",
        {
          decoratorsBeforeExport: true,
        },
      ],
    ],
  };
  try {
    const jsxAst = parse(code, options);
    return jsxAst;
  } catch (e) {
    if (file) {
      e.message = `${file}:` + e.message;
    }
    throw e;
  }
}

async function fileParser(file) {
  const source = await fse.readFile(file, "utf8");
  return codeParser(source, file);
}

exports.fileParser = fileParser;

exports.codeParser = codeParser;
