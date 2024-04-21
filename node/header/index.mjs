/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/12 13:14:13 (GMT+0900)
 */
import fs from 'node:fs'
import { EOL } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { formatDate } from '@zx-libs/utils'
import { parseArgs } from './utils.mjs'

const args = parseArgs(process.argv.slice(2))

function getPackageJson() {
  const pkgRawData = fs.readFileSync(path.join(process.cwd(), 'package.json'))
  return JSON.parse(pkgRawData)
}

function getDefHeaderLines(pkg) {
  pkg = pkg || getPackageJson()
  return [
    '/*!',
    ` * ${pkg.name} version ${pkg.version}`,
    ` * Author: ${pkg.author}`,
    ` * Homepage: ${pkg.homepage}`,
    ` * Released on: ${formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss (g)')}`,
    ` */`,
  ]
}

function addHeader(file, prependLines) {
  const liens = fs.readFileSync(file, 'utf8').toString().split(EOL)
  fs.writeFileSync(file, [...prependLines, ...liens].join(EOL))
}

/**
 * header
 *
 * @param {string} dir
 * @param {string[] | object} headerLines Prepend header lines or package.json data.
 */
export function header(dir, headerLines) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory or file ${dir} does not exist。`)
  }

  let prependLines = Array.isArray(headerLines)
    ? headerLines
    : getDefHeaderLines(headerLines)

  const stat = fs.statSync(dir)
  if (stat.isFile()) {
    addHeader(dir, prependLines)
  } else if (stat.isDirectory()) {
    fs.readdirSync(dir).forEach((file) => {
      header(path.join(dir, file), prependLines)
    })
  }
}

if (args.dir) {
  const cwd = process.cwd()
  const dir = path.join(cwd, args.dir)
  let prependFile = args.prependFile
  if (prependFile) {
    if (!fs.existsSync(prependFile)) {
      prependFile = path.join(cwd, prependFile)
      if (!fs.existsSync(prependFile)) {
        throw new Error(`File ${args.prependFile} does not exist。`)
      }
    }
    header(dir, fs.readFileSync(prependFile).toString().split(EOL))
  } else {
    header(dir)
  }
}
