
import os from 'os';
import path from 'path';
import fs from 'fs-extra'

const TEMPFILEPATH = path.join(os.tmpdir(),'dl-repo-cli-cache.json');
const PKG = fs.readJsonSync('package.json');
const GITHUB = 'github';
const GITEE = 'gitee';

const LANGUAGE = ['TypeScript','JavaScript','HTML','CSS','Python','C','C++','C#','Shell','Java','NodeJS','Dart','Go','Ruby','Swift']

export {
    TEMPFILEPATH,
    PKG,
    GITHUB,
    GITEE,
    LANGUAGE
}