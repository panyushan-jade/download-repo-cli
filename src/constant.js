
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url'


const TEMPFILEPATH = path.join(os.tmpdir(),'dl-repo-cli-cache.json');
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG = fs.readJsonSync(path.resolve(__dirname,'../package.json'));
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