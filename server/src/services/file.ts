'/Users/maotingfeng/netease/opstask/opstask-web/src/main/webapp/source';
import fs from 'fs';

interface TreeDir {
  name: string,
  path: '',
  children?: TreeDir[],
}

export async function getProjectDirTree(project: string): Promise<TreeDir[]> {
  return []
}