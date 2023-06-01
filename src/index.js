import { program } from 'commander';
import fs from 'fs-extra'
import inquirer from 'inquirer';
import { GITHUB,GITEE } from './constant.js'
const pkg = fs.readJsonSync('./package.json')

/**
 * 1、选择平台 输入token
 *    本地是否有缓存的平台和token 如果有则直接取 没有则创建本地缓存 并写入
 *    如果加上 -t -p 参数 则直接更新本地缓存
 * 2、输入仓库名（是否分页）
 * 3、获取仓库tags
 * 4、拉取指定tags并下载
 * 5、安装如果有package.json安装node_modules 并启动项(检查是否有启动命令)
 * 
*/

export default function entry() {
    program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version)
    .option('-p, --platform <platform>', '代码托管平台')
    .option('-t, --token <token>', '代码托管平台的token')
    .action( async ({token,platform}) => {
        // console.log('xxxxxxx: ', platform,token);
        const answers = await getAnswers()
        console.log('answers: ', answers);
    });
    program.parse(process.argv);
}

async function getAnswers(){
    const questions = [
        {
          type: 'list',
          name: 'platform',
          message: '请选择平台',
          choices: [{name:'github',value:GITHUB},{name:'gitee',value:GITEE}]
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
      ]; 
   const result =  await inquirer.prompt(questions)
   return result
}