
import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
export function checkFileIsExist(filePath){
    const isExist = fs.existsSync(filePath);
    return isExist;
}

export async function getAnswers(questions){
    const result =  await inquirer.prompt(questions)
    return result
}

export async function wrapperLoading(fn,message){
    const spinner = ora(message.loadingInfo);
    try{
        spinner.start();
        const data = await fn();
        spinner.stop()
        return data
    }catch(err){
        spinner.stop()
        return null
    }
}
