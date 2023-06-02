
import { program,Option} from 'commander';
import fs from 'fs-extra'
import inquirer from 'inquirer';
import chalk from 'chalk';
import { checkFileIsExist,getAnswers } from './utils.js'
import { TEMPFILEPATH,PKG } from './constant.js';



export default function entry() {
    program
    .name(PKG.name)
    .description(PKG.description)
    .version(PKG.version)
    .addOption(new Option('-p, --platform <platform>', '代码托管平台（github、gitee）').choices(['github', 'gitee']))
    .option('-t, --token <token>', '代码托管平台的token')
    .action( async ({token,platform}) => {
      // 1、检查并更新缓存文件
      await checkAndUpdateCache(token,platform);
      console.log('gggggg===');
      // 2、输入仓库名称、语言并搜索
      // await searchRepositories()
      // 3、

    });
    program.parse(process.argv);
}

async function checkAndUpdateCache(t,p){
  if(checkFileIsExist(TEMPFILEPATH)){
    const { token,platform } = fs.readJsonSync(TEMPFILEPATH);
    fs.writeJsonSync(TEMPFILEPATH, {token: t ? t : token,platform: p ? p : platform});
  }else{
    creatCache()
  }
}


async function creatCache(){
  const answers = await getAnswers([
    {
      type: 'list',
      name: 'platform',
      message: '请选择平台',
      choices: [{name:'github',value:'github'},{name:'gitee',value:'gitee'}]
    },
    {
        type: 'password',
        name: 'token',
        message: '请输入token',
        validate: function (value) {
          if (value.trim() === '') {
            return '请输入token';
          }
          return true;
        }
      },
  ]);
  fs.writeJsonSync(TEMPFILEPATH, answers);
}

