/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2023/12/27 20:01:12 (GMT+0900)
 */
import { execSync } from 'child_process'
import { writeFileSync, readFileSync } from 'fs'
import process from 'process'
import inquirer from 'inquirer'

const {
  createPromptModule,
  ui: { Prompt },
} = inquirer

const COMMIT_TYPES = {
  feat: '新增功能',
  fix: '修复BUG',
  merge: '合并代码',
  lint: '代码格式化',
  test: '测试',
  build: '构建',
  style: '修改CSS样式',
  refactor: '重构',
  docs: '文档修改',
  revert: '回滚提交',
  perf: '性能优化',
  chore: '其他',
}

/**
 * 创建Commit类型选项数组
 */
const commitTypeList = Object.keys(COMMIT_TYPES).map(
  (key) => `${key}: ${COMMIT_TYPES[key]}`,
)

function main () {
  return new Promise((resolve, reject) => {
    // 获取commit消息，并去除结尾的换行符
    const msg = readFileSync(process.env.GIT_PARAMS, 'utf-8').replace(
      /(\r|\n)*$/,
      '',
    )
    // 执行git branch --show-current，获取当前分支名
    const stdout = execSync('git branch --show-current').toString()
    const currentBranch = stdout.replace(/\n|\r/g, '')
    // 执行Merge时的提交无需确认, 直接Commit
    const mergeReg = new RegExp(`Merge branch '.+' into ${currentBranch}`, 'g')
    if (msg.match(mergeReg)) { resolve(); return }

    const promptModule = createPromptModule()
    const ui = new Prompt(promptModule.prompts, {})
    // Ctrl+C中断事件处理
    const handleCtrlC = () => {
      ui.rl.off('SIGINT', handleCtrlC)
      ui.close()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      reject(new Error('Commit已终止!', ui))
    }
    ui.rl.on('SIGINT', handleCtrlC)

    const questions = [
      {
        type: 'message',
        name: 'branch',
        message: '请确定分支名称, On branch',
        default: currentBranch,
      },
      {
        type: 'list',
        name: 'commitType',
        message: '请选择提交的分类',
        choices: commitTypeList,
      },
      {
        name: 'message',
        message: '消息确认（或重新输入）',
        default: msg,
      },
    ]

    ui.run(questions)
      .then(({ commitType, message }) => {
        writeFileSync(
          process.env.GIT_PARAMS,
          `${commitType.substring(0, commitType.indexOf(':'))}: ${message}`,
        )
        resolve()
      })
      .catch(reject)
  })
}

await main()
