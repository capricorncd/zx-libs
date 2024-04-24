/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
import path from 'node:path'
import process from 'node:process'
import { outputFile } from '@zx-libs/docgen'

function resolve(filePath) {
  return path.resolve(process.cwd(), filePath)
}

const getCommentsDataOptions = {
  // disableKeySorting: true,
  // isExtractCodeFromComments: true,
  tableAlign: {
    Required: 'center',
  },
}

const outputFileOptions = {
  ...getCommentsDataOptions,
  lines: {
    // start: [
    //   'start ============='
    // ],
    end: [
      '',
      '## License',
      '',
      'MIT License © 2022-Present [Capricorncd](https://github.com/capricorncd).',
    ],
    //   afterType: {
    //     document: 'afterType document ------',
    //     method: ['afterType method', 'method==='],
    //     type: 'afterType ty[e'
    //   },
    //   afterTitle: {
    //     document: 'afterTitle document ------',
    //     method: ['afterTitle method', 'method==='],
    //     type: 'afterTitle type'
    //   },
  },
  alias: {
    // requiredValues: ['x', 'o'],
    // requiredValues: {
    //    0: 'x',
    //    1: 'o',
    //   //  method: ['no', 'yes'],
    //    type: ['可选', '必须'],
    // },
    // tableHead: {
    //   Param: '参数',
    //   Prop: '属性',
    //   Types: '类型',
    //   Required: '必须',
    //   Description: '描述'
    // },
    //   sourceCodeSummary: '代码'
    types: {
      // method: '函数',
      // constant: '常量'
    },
  },
  typeWithAuto: true,
  // // outputDocTypesAndOrder: ['document', 'constant', 'type', 'method'],
  handlers: {
    // constant: (arr, options, lines) => {
    //   if (isValidArray(arr)) {
    //     lines.push('## Constant', '')
    //     const linesAfterType = options.lines?.afterType?.['constant']
    //     if (isValidArray(linesAfterType)) {
    //       lines.push(...linesAfterType)
    //     }
    //     arr.forEach((item) => {
    //       lines.push(`### ${item.fullName}`, '', ...item.desc, '')
    //       if (isValidArray(item.codes)) {
    //         lines.push('```ts', ...item.codes, '```', '')
    //       }
    //     })
    //   }
    //   // console.log(arr, options, lines)
    // },
  },
  // // GetCommentsDataOptions
  // expendTypesHandlers: {
  //   // constant: (data, line) => {
  //   //   console.log(line)
  //   // },
  // },
  // codeTypes: [],
}

function main() {
  const input = resolve('src')
  const { lines } = outputFile(input, resolve('./README.md'), outputFileOptions)
  console.log(lines)
}

main()
