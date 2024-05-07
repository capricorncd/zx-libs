/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { isObject } from '@zx-libs/utils'
import { BLANK_LINE, DOC_TYPES } from './const'
import { getCommentsData } from './docs-input'
import {
  mkdirSync,
  isFileLike,
  isValidArray,
  formatAsArray,
  createPropsTable,
  mergeIntoArray,
} from './helpers'
import { log } from './log'
import type {
  OutputFileOptions,
  CommentInfoItem,
  OutputFileInput,
  CommentInfoItemProp,
} from './types.d'

/**
 * create method docs
 * @param item `CommentInfoItem`
 * @param lines `string[]`
 */
function createMethodsDoc(
  item: CommentInfoItem,
  lines: string[],
  options: OutputFileOptions = {}
) {
  if (!item.returns.length) {
    item.returns.push({
      raw: '`void`',
      types: ['void'],
      desc: [],
    })
  }

  lines.push(
    `### ${item.fullName}`,
    BLANK_LINE,
    ...item.desc,
    BLANK_LINE,
    // '*' will be replaced by 'npx pretty-quick --staged' with '-'
    // item.params.map((param) => `* @param ${param}`),
    ...(options.methodWithRaw
      ? item.params.map((param) => `- @param ${param.raw}`)
      : createPropsTable(item.params, DOC_TYPES.method, 'Param', options)),
    BLANK_LINE
  )

  if (item.generics.length) {
    lines.push('- @generic `' + item.generics.join(', ') + '`', BLANK_LINE)
  }

  lines.push(...item.returns.map((ret) => `- @returns ${ret.raw}`), BLANK_LINE)
  pushCodesIntoLines(item.codes, lines)
}

/**
 * 将注释中的代码，添加到desc行的后面
 * 目前document/property/method有效
 * `isExtractCodeFromComments`为`true`时，`codes`里才有数据
 * @param codes 注释中的代码数组
 * @param lines 已处理的文档行数组
 * @param options
 */
function pushCodesIntoLines(codes: string[], lines: string[]) {
  if (isValidArray(codes)) {
    lines.push(...codes, BLANK_LINE)
  }
}

/**
 * create types docs
 * @param item `CommentInfoItem`
 * @param lines `string[]`
 * @param options `{typeWithTable: false, typeWithSourceCode: false}`
 */
function createTypesDoc(
  item: CommentInfoItem,
  lines: string[],
  options: OutputFileOptions = {}
) {
  lines.push(`### ${item.fullName}`, BLANK_LINE, ...item.desc, BLANK_LINE)

  const hasCodes = item.codes.length > 0

  // table
  const typeTable = createPropsTable(
    item.props as CommentInfoItemProp[],
    DOC_TYPES.type,
    'Prop',
    options
  )
  // codes
  const codes = hasCodes ? ['```ts', ...item.codes, '```', BLANK_LINE] : []
  // source code alias
  const sourceCodeSummary = options.alias?.sourceCodeSummary

  // 没有codes时，不生成<details>
  const details = hasCodes
    ? [
        '<details>',
        `<summary>${sourceCodeSummary || 'Source Code'}</summary>`,
        BLANK_LINE,
        ...codes,
        BLANK_LINE,
        '</details>',
        BLANK_LINE,
      ]
    : []

  const { typeWithSourceCode, typeWithTable, typeWithAuto } = options

  if (typeWithSourceCode && typeWithTable) {
    lines.push(...typeTable, ...codes)
  } else if (typeWithSourceCode) {
    // only source code
    lines.push(...codes)
  } else if (typeWithTable) {
    // only table
    lines.push(...typeTable)
  } else {
    // table and source code
    if (typeTable.length) {
      lines.push(...typeTable, ...details)
    } else {
      if (typeWithAuto) {
        // When typeWithAuto is true and typeTable is not, display only code.
        lines.push(...codes)
      } else {
        // default `<details>...</details>`
        lines.push(...details)
      }
    }
  }
}

/**
 * remove consecutive blank lines
 * @param lines `string[]`
 * @returns `string[]`
 */
function removeConsecutiveBlankLine(lines: string[]) {
  let blankLineCount = 0
  const outputLines: string[] = []
  lines.forEach((line) => {
    if (line === BLANK_LINE) {
      blankLineCount++
    } else {
      blankLineCount = 0
    }
    if (blankLineCount > 1) return
    outputLines.push(line)
  })
  return outputLines
}

// # Documents
function handleDocumentLines(
  arr: CommentInfoItem[],
  options: OutputFileOptions,
  lines: string[]
) {
  if (!isValidArray(arr)) return
  // types alias
  const typesAlias = options.alias?.types || {}
  const linesAfterTitles = formatAsArray(
    options.lines?.afterTitle?.[DOC_TYPES.document]
  )

  let outputFileName = null

  arr.forEach((item, i) => {
    if (i === 0) {
      outputFileName = item.name + '.md'
      lines.push(
        `# ${typesAlias[DOC_TYPES.document] || item.fullName}`,
        BLANK_LINE
      )
      // insert lines after method title
      if (isValidArray(linesAfterTitles)) {
        lines.push(...linesAfterTitles, BLANK_LINE)
      }
    } else {
      lines.push(`### ${item.fullName}`, BLANK_LINE)
    }
    lines.push(...item.desc, BLANK_LINE)

    pushCodesIntoLines(item.codes, lines)
  })

  return outputFileName
}

// ## Methods
export function handleMethodLines(
  arr: CommentInfoItem[],
  options: OutputFileOptions,
  lines: string[]
) {
  if (!isValidArray(arr)) return

  handleMarkdownTitle(DOC_TYPES.method, options, lines)

  arr.forEach((item) => {
    createMethodsDoc(item, lines, options)
  })
}

// ## Types
function handleTypesLines(
  arr: CommentInfoItem[],
  options: OutputFileOptions,
  lines: string[]
) {
  if (!isValidArray(arr)) return

  handleMarkdownTitle(DOC_TYPES.type, options, lines)

  arr.forEach((item) => {
    createTypesDoc(item, lines, options)
  })
}

function handleMarkdownTitle(
  type: string,
  options: OutputFileOptions,
  lines: string[]
) {
  const typesAlias = options.alias?.types || {}

  const mdTitles = {
    document: 'Document',
    method: 'Methods',
    type: 'Types',
    constant: 'Constants',
    property: 'Property',
  }

  lines.push(
    `## ${typesAlias[type] || mdTitles[type as keyof typeof mdTitles] || type}`,
    BLANK_LINE
  )

  const linesAfterTitles = formatAsArray(options.lines?.afterTitle?.[type])

  // insert lines after type title
  if (isValidArray(linesAfterTitles)) {
    lines.push(...linesAfterTitles, BLANK_LINE)
  }
}

function handleConstLines(
  arr: CommentInfoItem[],
  options: OutputFileOptions,
  lines: string[]
) {
  if (!isValidArray(arr)) return

  handleMarkdownTitle(DOC_TYPES.constant, options, lines)

  arr.forEach((item) => {
    lines.push(`### ${item.fullName}`, BLANK_LINE, ...item.desc, BLANK_LINE)
    if (isValidArray(item.codes)) {
      lines.push('```ts', ...item.codes, '```', BLANK_LINE)
    }
  })
}

/**
 * handle property
 * @param arr
 * @param options
 * @param lines
 */
export function handlePropertyLines(
  arr: CommentInfoItem[],
  options: OutputFileOptions,
  lines: string[]
) {
  if (!isValidArray(arr)) return

  handleMarkdownTitle(DOC_TYPES.property, options, lines)

  arr.forEach((item) => {
    lines.push(`### ${item.fullName}`, BLANK_LINE, ...item.desc, BLANK_LINE)
    if (item.returns.length) {
      lines.push(
        ...item.returns.map((ret) => `- @returns ${ret.raw}`),
        BLANK_LINE
      )
    }
    pushCodesIntoLines(item.codes, lines)
  })
}

/**
 * handle output
 * @param arr `CommentInfoItem[]`
 * @param outputDir `string` optional parameter.
 * @param options `OutputFileOptions`
 * @returns `{ outputFileName: string | null, lines: string[], data: CommentInfoItem[] }`
 */
function handleOutput(
  arr: CommentInfoItem[],
  outputDir?: string,
  options: OutputFileOptions = {}
) {
  console.log('Output file is start ...')
  // method|type|constant|document|component|...
  const originalData: Record<string, CommentInfoItem[]> = {}

  let outputFileName = null

  arr.forEach((item) => {
    if (!originalData[item.type]) {
      originalData[item.type] = []
    }
    originalData[item.type].push(item)
  })

  const lines: string[] = []

  // start lines
  const startLines = formatAsArray(options.lines?.start)
  if (isValidArray(startLines)) {
    lines.push(...startLines, BLANK_LINE)
  }

  // linesAfterType
  const linesAfterType = options.lines?.afterType || {}

  // Output types and their order
  const outputDocTypesAndOrder = isValidArray(options.outputDocTypesAndOrder)
    ? options.outputDocTypesAndOrder
    : [
        DOC_TYPES.document,
        DOC_TYPES.property,
        DOC_TYPES.method,
        DOC_TYPES.type,
        DOC_TYPES.constant,
      ]

  outputDocTypesAndOrder.forEach((type) => {
    const handler = options.handlers?.[type]
    if (typeof handler === 'function') {
      handler(originalData[type], options, lines)
    } else {
      // # document
      if (type === DOC_TYPES.document) {
        outputFileName = handleDocumentLines(originalData[type], options, lines)
      } else if (type === DOC_TYPES.property) {
        handlePropertyLines(originalData[type], options, lines)
      } else if (type === DOC_TYPES.method) {
        handleMethodLines(originalData[type], options, lines)
      } else if (type === DOC_TYPES.type) {
        handleTypesLines(originalData[type], options, lines)
      } else if (type === DOC_TYPES.constant) {
        handleConstLines(originalData[type], options, lines)
      }
    }

    // lines after docTypes
    if (linesAfterType[type]) {
      lines.push(...formatAsArray(linesAfterType[type]), BLANK_LINE)
    }
  })

  // end lines
  const endLines = formatAsArray(options.lines?.end)
  if (isValidArray(endLines)) {
    lines.push(...endLines, BLANK_LINE)
  }

  const outputLines = removeConsecutiveBlankLine(lines)

  if (outputDir) {
    // file check
    if (isFileLike(outputDir)) {
      outputFileName = outputDir
    } else if (outputFileName) {
      outputFileName = path.join(outputDir, outputFileName)
    }

    // output file
    if (outputFileName) writeFileSync(outputFileName, outputLines)
  }

  log(outputFileName || 'no files were output!')
  console.log('Output file is ended.')
  return {
    outputFileName,
    lines: outputLines,
    data: arr,
  }
}

/**
 * @method writeFileSync(outputFileName, outputLines)
 * Synchronized file write function.
 * @param outputFileName `string` Output filename, absolute path.
 * @param outputLines `string[] | NodeJS.ArrayBufferView | string` The output file content, an array of strings.
 */
export function writeFileSync(
  outputFileName: string,
  outputLines: string[] | NodeJS.ArrayBufferView | string
) {
  if (Array.isArray(outputLines)) {
    outputLines = outputLines.join(os.EOL)
  }
  fs.writeFileSync(outputFileName, outputLines, 'utf8')
}

/**
 * @method outputFile(input, outputDirOrFile, options)
 * Output the obtained annotation content as a document.
 * @param input `{[filePath]: {[key]: CommentInfoItem}} | CommentInfoItem[] | string` Comment obtained from the source. When `string` it's a file path, and the [getCommentsData](#getcommentsdatainput-needarray-options) will be called. What's [CommentInfoItem](#commentinfoitem).
 * @param outputDirOrFile? `string` Optional parameter. The file or directory where the output will be written. When `outputDirOrFile` is `undefined`, no file will be output.
 * @param options? `OutputFileOptions` [OutputFileOptions](#OutputFileOptions)
 * @returns `OutputFileReturns | OutputFileReturns[]` What's [OutputFileReturns](#outputfilereturns)
 */
export function outputFile(
  input: OutputFileInput,
  outputDirOrFile?: string | OutputFileOptions,
  options?: OutputFileOptions
) {
  // check other parameters
  if (isObject(outputDirOrFile)) {
    options = outputDirOrFile
    outputDirOrFile = undefined
  }

  options = options || {}

  // file or directory's path, or an array of paths
  if (
    // file or directory's path
    typeof input === 'string' ||
    // or an array of paths
    (Array.isArray(input) &&
      input.length > 0 &&
      (input as string[]).every((str) => typeof str === 'string'))
  ) {
    input = getCommentsData(input as string | string[], true, options)
  }

  const optionsLines = options.lines || {}
  const optionsAlias = options.alias || {}

  options = {
    ...options,
    lines: optionsLines,
    alias: optionsAlias,
  }

  if (outputDirOrFile && !fs.existsSync(outputDirOrFile)) {
    if (isFileLike(outputDirOrFile)) {
      const outputDir = outputDirOrFile.split('/')
      outputDir.pop()
      mkdirSync(outputDir.join('/'))
    } else {
      mkdirSync(outputDirOrFile)
    }
  }
  if (Array.isArray(input)) {
    return handleOutput(input as CommentInfoItem[], outputDirOrFile, options)
  } else {
    // Combine output into one file
    return handleOutput(
      mergeIntoArray(input, options),
      outputDirOrFile,
      options
    )
    // // Separate output of different files, provided that outputDirOrFile is a file directory, and each file contains `@document`.
    // return Object.keys(input).map((key) => {
    //   return handleOutput(
    //     toArray(input[key], options),
    //     outputDirOrFile,
    //     options
    //   )
    // })
  }
}
