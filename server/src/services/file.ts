import klawSync from 'klaw-sync';
import path from 'path';

interface TreeDir {
  name: string,
  path: string,
  isDir: boolean,
  children?: TreeDir[],
}

export function getProjectDirTree(project: {origin: string, base: string}): TreeDir[] {
  const result: TreeDir[] = []
  const paths = klawSync(project.base, {
    depthLimit: 0,
    filter: item => {
      const WhiteReg = /\.(j|t)sx?$/;
      const DirReg = /src/;
      const rel = path.relative(project.origin, item.path);
      return item.stats.isDirectory() && DirReg.test(rel) || WhiteReg.test(item.path);
    },
  });
  for(let i of paths) {
    const isDir = i.stats.isDirectory();
    const name = path.basename(i.path);
    const children: TreeDir[] = isDir ? getProjectDirTree({
      origin: project.origin,
      base: i.path,
    }) : null;
    const item: TreeDir = {
      name,
      isDir,
      path: i.path,
      children,
    }
    result.push(item);
  }
  return result
}