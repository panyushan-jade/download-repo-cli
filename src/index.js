import { program, Option } from "commander";
import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import shell from "shelljs";
import giteeApi from "./server/gitee.js";
import githubApi from "./server/github.js";

import { checkFileIsExist, getAnswers, wrapperLoading } from "./utils.js";
import { TEMPFILEPATH, PKG, GITHUB, GITEE,LANGUAGE } from "./constant.js";

let downLoadCommand = "";
let repoFileName = "";

export default function entry() {
  program
    .name(PKG.name)
    .description(PKG.description)
    .version(PKG.version)
    .addOption(
      new Option(
        "-p, --platform <platform>",
        "代码托管平台（github、gitee）"
      ).choices([GITHUB, GITEE])
    )
    .option("-t, --token <token>", "代码托管平台的token")
    .action(async ({ token, platform }) => {
      // 1、检查并更新缓存文件
      await checkAndUpdateCache(token, platform);
      // 2、输入仓库名称、语言等并搜索
      await searchRepositoriesAndTags();
      // // 3、clone 下载
      await downLoadFile();
    });
  program.parse(process.argv);
}

async function checkAndUpdateCache(t, p) {
  if (checkFileIsExist(TEMPFILEPATH)) {
    const { token, platform } = fs.readJsonSync(TEMPFILEPATH);
    fs.writeJsonSync(TEMPFILEPATH, {
      token: t ? t : token,
      platform: p ? p : platform,
    });
  } else if(t && p){
    fs.writeJsonSync(TEMPFILEPATH, {
      token: t,
      platform: p,
    });
  }else{
    await creatCache();
  }
}

async function downLoadFile() {
  if (checkFileIsExist(path.join(process.cwd(), repoFileName))) {
    const { confirm } = await getAnswers([
      {
        type: "confirm",
        name: "confirm",
        message: "当前执行目录下已存在该项目，是否强制更新？",
      },
    ]);
    if (confirm) {
      execaCommand(true)
    } else {
      shell.exit(1);
    }
  } else {
    execaCommand(false)
  }
}

async function execaCommand(rm) {
  if (rm) shell.rm("-rf", repoFileName);
  const res = shell.exec(downLoadCommand);
  if (res?.code === 0) {
    shell.echo(chalk.green("下载成功 √√√"));
  }
}

async function searchRepositoriesAndTags() {
  const answers = await getAnswers([
    {
      type: "input",
      name: "repoName",
      message: "请输入仓库名称",
      validate: function (value) {
        if (value.trim() === "") {
          return "请输入仓库名称";
        }
        return true;
      },
    },
    {
      type: "list",
      name: "language",
      message: "请选择语言",
      choices:LANGUAGE.map( lan => ({name: lan,value:lan}))
    },
    {
      type: "input",
      name: "author",
      message: "请输入作者",
    },
  ]);
  await searchRepoByPlatform(answers);
}

async function searchRepoByPlatform({ repoName, language, author }) {
  const { token, platform } = fs.readJsonSync(TEMPFILEPATH);
  const api = platform === GITHUB ? new githubApi(token) : new giteeApi();
  const params =
    platform === GITHUB
      ? {
          q: author
            ? `repo:${author}/${repoName}`
            : `${repoName}+language:${language}`,
          per_page: 30,
          page: 1,
        }
      : {
          q: repoName,
          owner: author ? author : undefined,
          language: language ? language : undefined,
          per_page: 30,
          page: 1,
          access_token: token,
        };
  const result = await wrapperLoading(
    api.searchRepositories.bind(api, params),
    {
      loadingInfo: "搜索中......",
    }
  );
  if (
    (result?.total_count === 0 && platform === GITHUB) ||
    (result?.length === 0 && platform === GITEE) ||
    !result
  ) {
    console.log(chalk.red("搜索结果为空，请重新输入"));
    await searchRepositoriesAndTags();
    return;
  }
  console.log(
    `共${chalk.green(result?.total_count || result?.length)}条搜索结果`
  );
  const data = platform === GITHUB ? result?.items : result;
  const choicesRepo = data.map((item) => {
    return {
      name: `${chalk.green(item.full_name)}（${item.description}）`,
      value: item.full_name,
    };
  });
  // 选择仓库
  const { full_name } = await getAnswers([
    {
      type: "list",
      name: "full_name",
      message: "请选择仓库",
      choices: choicesRepo,
    },
  ]);
  repoFileName = full_name?.split("/")[1];
  const tagResult = await wrapperLoading(api.searchTags.bind(api, full_name), {
    loadingInfo: "搜索中......",
    failInfo: "搜索失败，请重试",
  });
  // 处理tag为空的情况
  if (tagResult?.length) {
    const tagChoices = tagResult?.map((item) => {
      return {
        name: `${chalk.green(item.name)}`,
        value: item.name,
      };
    });
    const { tag } = await getAnswers([
      {
        type: "list",
        name: "tag",
        message: "请选择tag",
        choices: tagChoices,
      },
    ]);
    downLoadCommand = `git clone --branch ${tag} git@${platform}.com:${full_name}.git`;
  } else {
    downLoadCommand = `git clone git@${platform}.com:${full_name}.git`;
  }
}

async function creatCache() {
  const answers = await getAnswers([
    {
      type: "list",
      name: "platform",
      message: "请选择平台",
      choices: [
        { name: "github", value: GITHUB },
        { name: "gitee", value: GITEE },
      ],
    },
    {
      type: "password",
      name: "token",
      message: "请输入token",
      validate: function (value) {
        if (value.trim() === "") {
          return "请输入token";
        }
        return true;
      },
    },
  ]);
  fs.writeJsonSync(TEMPFILEPATH, answers);
}
