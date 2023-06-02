
import os from 'os';
import path from 'path';
import fs from 'fs-extra'

const TEMPFILEPATH = path.join(os.tmpdir(),'dl-repo-cli-cache.json');
const PKG = fs.readJsonSync('./package.json');

export {
    TEMPFILEPATH,
    PKG
}