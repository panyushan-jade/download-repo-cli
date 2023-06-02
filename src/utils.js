
import fs from 'fs-extra';
import inquirer from 'inquirer';
export function checkFileIsExist(filePath){
    const isExist = fs.existsSync(filePath);
    return isExist;
}

export async function getAnswers(questions){
    const result =  await inquirer.prompt(questions)
    return result
}