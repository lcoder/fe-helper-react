/**
 * 重命名有冲突的标识符
 * @param {Array<String>} preserveKeyWords 保留标识符关键字
 * @param {NodePath} path path
 * @param {Function} filter 过滤不需要冲突检测的标识符
 */
function scopeRename(preserveKeyWords = [], path, filter = () => true) {
  const { bindings, labels } = path.scope;
  // 比较hack 借用labels 来mock 变量已被占用
  for (let id of preserveKeyWords) {
    const hasDefined = path.scope.hasLabel(id);
    if (hasDefined) {
      continue;
    } else {
      labels.set(id, true);
    }
  }
  // 重命名冲突的变量
  Object.keys(bindings)
    .filter(id => filter(id, bindings[id]))
    .forEach(id => {
      const isConflict = preserveKeyWords.includes(id);
      if (isConflict) {
        const idPath = bindings[id];
        idPath.scope.rename(id);
      }
    });
  // 恢复labels
  for (let id of preserveKeyWords) {
    const labelValue = path.scope.getLabel(id);
    if (labelValue === true) {
      labels.delete(id);
    }
  }
}

module.exports = scopeRename;
