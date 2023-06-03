
import { program,Option} from 'commander';
import fs from 'fs-extra'
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { checkFileIsExist,getAnswers } from './utils.js'
import { TEMPFILEPATH,PKG,GITHUB,GITEE } from './constant.js';

import giteeApi from './server/gitee.js';
import githubApi from './server/github.js';


export default function entry() {
    program
    .name(PKG.name)
    .description(PKG.description)
    .version(PKG.version)
    .addOption(new Option('-p, --platform <platform>', '代码托管平台（github、gitee）').choices([GITHUB, GITEE]))
    .option('-t, --token <token>', '代码托管平台的token')
    .action( async ({token,platform}) => {
      // 1、检查并更新缓存文件
      await checkAndUpdateCache(token,platform);
      // 2、输入仓库名称、语言并搜索
      await searchRepositoriesAndTags();
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


async function searchRepositoriesAndTags(){
  const answers = await getAnswers([
    {
      type: 'input',
      name: 'repoName',
      message: '请输入仓库名称',
      validate: function (value) {
        if (value.trim() === '') {
          return '请输入仓库名称';
        }
        return true;
      }
    },{
      type: 'input',
      name: 'language',
      message: '请输入语言'
    }
  ]);
  searchRepoByPlatform(answers)
}

async function searchRepoByPlatform({repoName,language}) {
  const spinner = ora('搜索中......').start();
  const { token,platform } = fs.readJsonSync(TEMPFILEPATH);
  if(platform === GITHUB){
    const api = new githubApi(token)
    const params = {
      q:`${repoName}+language:${language}`,
      per_page:10,
      page:1
    }
    try {
      // 搜索仓库
      const res = await api.searchRepositories(params);
      spinner.stop();
      if(res?.total_count === 0){
        console.log(chalk.red('搜索结果为空，请重新输入'));
        searchRepositories()
      }
      console.log(`共${chalk.green(res?.total_count)}条搜索结果`);
      const choices = res?.items.map(item =>{
        return {
          name:`${chalk.green(item.full_name)}（${item.description}）`,
          value:item.full_name
        }
      })
      // 选择仓库
      const repo = await getAnswers([
        {
          type: 'list',
          name: 'full_name',
          message: '请选择仓库',
          choices: choices
        },
      ]);
      // 搜索tags
      const tagsResult = await api.searchTags(repo.full_name);
      console.log('tagsResult: ', tagsResult);
      //选择tags
    } catch (error) {
      spinner.stop();
      console.log(chalk.red(error));
    }
    
  }else{

  }
}


async function creatCache(){
  const answers = await getAnswers([
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
  ]);
  fs.writeJsonSync(TEMPFILEPATH, answers);
}

