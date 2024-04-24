/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
import fs from 'node:fs'
import { EOL } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { outputFile } from '@zx-libs/docgen'

const METHOD_START = '<!--METHOD_START-->'
const METHOD_END = '<!--METHOD_END-->'

function resolve(filePath) {
  return path.resolve(process.cwd(), filePath)
}

/**
 * <!--METHOD_START-->
 * <!--METHOD_END-->
 * @param inputLines
 */
function writeInReadmeFile(inputLines) {
  const readmeFile = resolve('README.md')
  const lines = []
  let isMethodStart = false
  fs.readFileSync(readmeFile, 'utf8')
    .toString()
    .split(new RegExp(EOL))
    .forEach((line) => {
      if (line.trim() === METHOD_START) {
        isMethodStart = true
        lines.push(METHOD_START, ...inputLines, METHOD_END)
        return
      }
      if (line.trim() === METHOD_END) {
        isMethodStart = false
        return
      }
      if (!isMethodStart) lines.push(line)
    })
  fs.writeFileSync(readmeFile, lines.join(EOL))
}

const getCommentsDataOptions = {
  // disableKeySorting: true,
  // isExtractCodeFromComments: true,
  tableAlign: {
    Required: 'center',
  },
}

function main() {
  const srcDir = resolve('./src')
  const { lines } = outputFile(srcDir, getCommentsDataOptions)
  // README.md
  writeInReadmeFile(lines)
}

main()
