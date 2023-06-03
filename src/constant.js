
import os from 'os';
import path from 'path';
import fs from 'fs-extra'

const TEMPFILEPATH = path.join(os.tmpdir(),'dl-repo-cli-cache.json');
const PKG = fs.readJsonSync('./package.json');
const GITHUB = 'github';
const GITEE = 'gitee';

export {
    TEMPFILEPATH,
    PKG,
    GITHUB,
    GITEE
}