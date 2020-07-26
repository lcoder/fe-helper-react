const t = require("@babel/types");

function _generateUid(name, i) {
  let id = name;
  if (i > 1) id += i;
  return `_${id}`;
}

function generateUid(name = "", preserved = []) {
  name = t
    .toIdentifier(name)
    .replace(/^_+/, "")
    .replace(/[0-9]+$/g, "");

  let uid;
  let i = 0;
  do {
    uid = _generateUid(name, i);
    i++;
  } while (preserved.includes(uid));

  return uid;
}

module.exports = generateUid;
