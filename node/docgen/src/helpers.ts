/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
import fs from 'node:fs'
import { isObject, toNumber } from '@zx-libs/utils'
import { BLANK_LINE } from './const'
import { warn } from './log'
import type {
  OutputFileOptions,
  CommentInfoItemParam,
  CommentInfoItemReturn,
  CommentInfoItemProp,
  CommentInfoItem,
  GetCommentsDataOptions,
  ToTableLinesParamData,
} from './types.d'

const DEF_TABLE_ALIGN = ':--'

/**
 * TABLE_ALIGNS
 */
const TABLE_ALIGNS = {
  left: DEF_TABLE_ALIGN,
  center: ':--:',
  right: '--:',
}

/**
 * @method mkdirSync(dir)
 * make a directory synchronously
 * @param dir `string` directory path
 * @returns `void`
 */
export function mkdirSync(dir?: string) {
  if (!dir || fs.existsSync(dir)) {
    warn(`The directory already exists, or is null, ${dir}`)
    return
  }
  const index = dir.lastIndexOf('/')
  if (index === -1) {
    warn(`The 'dir' maybe a valid directory name, ${dir}`)
    return
  }
  const parent = dir.substring(0, index)
  if (fs.existsSync(parent)) {
    fs.mkdirSync(dir)
  } else {
    mkdirSync(parent)
    mkdirSync(dir)
  }
}

/**
 * @method isFileLike(filePath)
 * is file like, `*.ext`.
 * @param filePath `string`
 * @returns `boolean`
 */
export function isFileLike(filePath: unknown) {
  if (typeof filePath === 'string') {
    return /.+\.\w+$/.test(filePath)
  }
  return false
}

/**
 * @method isValidArray<T>(arr)
 * Determine whether `arr` is an array and it has some elements.
 * @param arr? `T[]`
 * @returns `boolean`
 */
export function isValidArray<T>(i?: T[]): i is Array<T> {
  return Array.isArray(i) && i.length > 0
}

/**
 * input `['str1', 'str2', '...', 'strN']`
 * output `str1 str2 ... strN`
 * input `[]`
 * output `-`
 * @param arr
 * @param spliceSymbol
 * @param defaultReturnValue
 * @returns `string`
 */
export function toStrForStrArray(
  arr: string[],
  spliceSymbol = ' ',
  defaultReturnValue = '-'
) {
  const newArr = arr.filter((str) => !!str)
  return newArr.length ? newArr.join(spliceSymbol) : defaultReturnValue
}

/**
 * Find the N occurrence of a string
 * @param {*} str `string`
 * @param {*} char `string`
 * @param {*} times `number`
 * @returns `number`
 */
export function findCharIndex(
  str: string,
  char: string,
  times: number
): number {
  let index = -1
  for (let i = 0; i < times; i++) {
    index = str.indexOf(char, index + 1)
    if (index === -1) break
  }
  return index
}

/**
 * formatAsArray
 * @param input `string | string[]`
 * @returns `string[]`
 */
export function formatAsArray(input?: string | string[]): string[] {
  if (typeof input === 'undefined') return []
  return Array.isArray(input) ? input : [input]
}

/**
 * format as types
 * @param input `string` Type string data of members of `interface` etc.
 * @returns `string[]`
 *
 * For example `interface IF`
 *
 * ```ts
 * interface IF {
 *   fieldA: string | number;
 * }
 * ```
 *
 * ```ts
 * formatAsTypes(' string | number;') // ['string', 'number']
 * ```
 */
export function formatAsTypes(input: string): string[] {
  input = input.trim()

  // remove last ';' of type string
  // e.g. `Array<string>;` => `Array<string>`
  if (input.endsWith(';')) {
    input = input.substr(0, input.length - 1)
  }

  // only one type
  if (
    !input.includes('|') ||
    /^(\w+<([^<]|\([^(]+\)\[\]|\w+<[^<]+>)+>|\([^(]+\)\[\])$/.test(input)
  ) {
    return [input]
  }

  // if (!/(\w+<.+>|\(.+\)\[\])/.test(input))
  return input.split(/\s*\|\s*/)

  // Record<'document' | 'method' | 'type', string | string[]> | OtherType
  // Record<string, Array<AnyType | OtherType> | Record<string, AnyType>>
  // Array<string | number> or
  // (string | number)[] | keyof type SomeObject | OtherType
  // Array<string> | Array<number> or string[] | number[]
}

/**
 * Replace vertical bars in tables so they don't affect table rendering in Markdown.
 * @param input
 * @returns `string`
 */
export function replaceVerticalBarsInTables(input: string): string {
  return input.replace(/\|/g, '\\|')
}

/**
 * getSpDescription(input)
 * When the parameter description cannot be obtained using regular expressions.
 * @param input `string`
 * @returns `string`
 */
function getSpDescription(input: string): string {
  const index = findCharIndex(input, '`', 2)
  return index === -1 ? '' : input.substr(index + 1)
}

/**
 * handleParam
 * Convert function's parameter raw string to [CommentInfoItemParam](#CommentInfoItemParam) object.
 * @param input `string` raw string.
 * @returns `CommentInfoItemParam` [CommentInfoItemParam](#CommentInfoItemParam).
 */
export function handleParam(input: string): CommentInfoItemParam {
  input = input.replace('@param', '').trim()
  const data: CommentInfoItemParam = {
    raw: input,
    name: '',
    required: false,
    types: [],
    desc: [],
  }
  // paramName? `type` param description
  // paramName `type1 | type2` param description
  if (/(\w+\??)\s+`([^`]+)`(.*)/.test(input)) {
    const name = RegExp.$1
    data.name = name.replace('?', '')

    data.required = !name.includes('?')
    // Convert type string to array
    data.types.push(...formatAsTypes(RegExp.$2))
    // desc
    const desc = RegExp.$3 || getSpDescription(input)
    data.desc.push(desc.trim())
  }
  return data
}

/**
 * handleReturn
 * Convert function's returns raw string to [CommentInfoItemReturn](#CommentInfoItemReturn) object.
 * @param input `string`
 * @returns `CommentInfoItemReturn`
 */
export function handleReturn(input: string): CommentInfoItemReturn {
  input = input.replace(/@returns?/, '').trim()
  const data: CommentInfoItemReturn = {
    raw: input,
    types: [],
    desc: [],
  }
  // `type` Return's description
  // `type1 | type2` Return's description
  if (/`([^`]+)`\s*(.*)/.test(input)) {
    // no support for `Array<string | number>` or `(string | number)[]`
    // please use `Array<string> | Array<number>` or `string[] | number[]`
    data.types.push(...formatAsTypes(RegExp.$1))

    data.desc.push(RegExp.$2)
  }
  return data
}

/**
 * handle sort number of line
 * @param line `string`
 * @return {number}
 */
export function handleSort(line: string): number {
  if (/@sort\s*(-?\d+)/.test(line)) {
    return toNumber(RegExp.$1)
  }
  return 0
}

/**
 * Get type name:
 * `setContents(box, newContents)`  -> `setContents`.
 * `InterfaceName<Type1, Type2>`    -> `InterfaceName`.
 * `classInstance.someMethod(param)`-> `classInstance.someMethod`.
 * @param fullName `string`
 * @returns `string`
 */
export function getTypeName(fullName: string): string {
  // only words and '.'
  return fullName.replace(/^([\w.]+).*/, '$1')
}

/**
 * createPropsTable
 * @param props `CommentInfoItemParam[] | CommentInfoItemProp[]`
 * @param docType `DocTypes`
 * @param typeName
 * @param options `{alias: tableHead?: {...}}`
 * @returns `string[]`
 */
export function createPropsTable(
  props: CommentInfoItemParam[] | CommentInfoItemProp[],
  docType: string,
  typeName = 'Name',
  options: OutputFileOptions = {}
): string[] {
  if (!isValidArray(props)) return []
  // alias
  const alias = options.alias || {}
  const tableHeadAlias = alias.tableHead || {}
  // requiredValues
  let requiredValues: Record<string, string> = {
    0: 'no',
    1: 'yes',
  }
  if (alias.requiredValues) {
    if (alias.requiredValues[docType]) {
      requiredValues = alias.requiredValues[docType] as Record<string, string>
    } else if (alias.requiredValues[0] && alias.requiredValues[1]) {
      requiredValues = alias.requiredValues as Record<string, string>
    }
  }

  // align
  const align = options.tableAlign || {}

  const tableData = {
    align: [
      align[typeName],
      align['Types'],
      align['Required'],
      align['Description'],
    ],
    // table head
    thead: [
      tableHeadAlias[typeName] || typeName,
      tableHeadAlias['Types'] || 'Types',
      tableHeadAlias['Required'] || 'Required',
      tableHeadAlias['Description'] || 'Description',
    ],
    // table body
    tbody: props.map((item) => {
      return [
        item.name,
        '`' + replaceVerticalBarsInTables(item.types?.join('`/`')) + '`',
        requiredValues[+item.required],
        replaceVerticalBarsInTables(toStrForStrArray(item.desc)),
      ]
    }),
  }

  const lines = toTableLines(tableData)
  // BLANK_LINE
  lines.push(BLANK_LINE)

  return lines
}

/**
 * mergeIntoArray
 * @param data `Record<filePath, Record<commentTypeName, CommentInfoItem>>`
 * @param options `GetCommentsDataOptions` [GetCommentsDataOptions](#getcommentsdataoptions)
 * @returns `CommentInfoItem[]`
 */
export function mergeIntoArray(
  data: Record<string, Record<string, CommentInfoItem>>,
  options: GetCommentsDataOptions
): CommentInfoItem[] {
  const mergeData = Object.keys(data).reduce(
    (prev, filePath) => {
      Object.keys(data[filePath]).forEach((key) => {
        prev[key] = data[filePath][key]
      })
      return prev
    },
    {} as Record<string, CommentInfoItem>
  )
  return toArray(mergeData, options)
}

/**
 * to array
 * @param data `Record<typeAndName, CommentInfoItem>`
 * @param options `GetCommentsDataOptions`
 * @returns `CommentInfoItem[]`
 */
export function toArray(
  data: Record<string, CommentInfoItem>,
  options: GetCommentsDataOptions = {}
) {
  const arr: CommentInfoItem[] = []
  const keys = Object.keys(data)
  // sort by keys
  if (!options.disableKeySorting) {
    keys.sort()
  }

  keys.forEach((key) => arr.push(data[key]))

  // sort by item.sort
  if (arr.some((item) => item.sort)) {
    arr.sort((a, b) => a.sort - b.sort)
  }

  return arr
}

const REG_INTERFACE_EXTENDS = /interface\s+\w+\s+extends\s(.+)\s+\{/

// export interface T extends A, B<P extends O>
export function getExtendsTypes(input: string): string[] | null {
  const result = input.match(REG_INTERFACE_EXTENDS)
  return result
    ? result[1].split(/,\s*/).map((str) => str.replace(/^(\w+).*/, '$1'))
    : null
}

/**
 * handleProps
 * @param item `CommentInfoItem`
 * @param types `CommentInfoItem[]`
 * @returns `CommentInfoItemProp[]` [CommentInfoItemProp](#CommentInfoItemProp)
 */
export function handleProps(item: CommentInfoItem, types: CommentInfoItem[]) {
  // props has been processed
  if (item.props) return item.props

  const arr: CommentInfoItemProp[] = []

  const firstCodeLine = item.codes[0] || ''
  // handle extends, get extends interface or class's props
  // interface ColorfulCircle<T> extends Colorful<T>, Circle {}
  const extendTypes = getExtendsTypes(firstCodeLine)
  if (extendTypes) {
    extendTypes.forEach((extendName) => {
      // find extendName from types
      const typeItem = types.find((item) => item.name === extendName)

      if (typeItem) {
        // props of extends type object has not been processed
        if (!typeItem.props) {
          typeItem.props = handleProps(typeItem, types)
        }
        arr.push(...typeItem.props)
      }
    })
  }

  let isCodeStart = false
  let description: string[] = []

  item.codes.forEach((line) => {
    // type A = {
    //   prop: type
    // }
    if (!isCodeStart && /\{\s*$/.test(line)) {
      return (isCodeStart = true)
    }

    // desc?: string[] | OtherType // description ...
    // install: (e: Editor, parent?: HTMLElement) => void // description ...
    // [key]: any, or [key: string]: OtherType // description ...
    // 'hello-world': any
    // interface ReadonlyStringArray {
    //   readonly [index: number]: string;
    // }
    if (
      /^\s*(?:(?:readonly|static|public)\s+)?((?:(?:\w|\[.+\])+|(?:'.+')|(?:".+"))\??)\s*:\s*([^/]*)(?:\/\/(.*))?/.test(
        line
      )
    ) {
      // $1~$3
      const name = RegExp.$1
      const types = formatAsTypes(RegExp.$2)
      description.push(RegExp.$3.trim())

      const data: CommentInfoItemProp = {
        raw: line,
        name: name.replace(/('|")(.+)\1/, '$2').replace(/\?/g, ''),
        required: !name.includes('?'),
        desc: description.filter(Boolean),
        types,
      }

      // Has extends, a property with the same name may already exist
      const index = arr.findIndex((item) => item.name === data.name)
      if (index >= 0) {
        arr.splice(index, 1)
      }
      arr.push(data)

      // reset
      description = []
    } else if (/^\s*\/\/(.+)/.test(line)) {
      if (!description) description = []
      description.push(RegExp.$1.trim())
    }
  })
  return arr
}

/**
 * createTableAlignLine
 * => `:--|:--:|:--`
 * @param trArr `string`
 * @param align `string`
 * @returns `string`
 */
function createTableAlignLine(trArr: string[], align: string[] = []): string {
  return trArr
    .map(
      (_, i) =>
        TABLE_ALIGNS[align[i] as keyof typeof TABLE_ALIGNS] || DEF_TABLE_ALIGN
    )
    .join('|')
}

/**
 * @method toTableLines(data)
 * Convert `data` to a table in Markdown format.
 * @param data `ToTableLinesParamData` see type [ToTableLinesParamData](#ToTableLinesParamData).
 * @returns `string[]`
 */
export function toTableLines(data: ToTableLinesParamData) {
  if (!isObject(data) || !isValidArray(data.tbody)) return []
  const { align = [], thead, tbody } = data
  const lines = []

  let i = 0
  // thead
  if (isValidArray(thead)) {
    lines.push(thead.join('|'), createTableAlignLine(thead, align))
  } else {
    lines.push(tbody[0].join('|'), createTableAlignLine(tbody[0], align))
    i = 1
  }

  for (; i < tbody.length; i++) {
    lines.push(tbody[i].join('|'))
  }

  return lines
}

// fun<T extends Object>(props) => { fullName: string, generics: string[] }
export function splitFullNameRaw(input: string) {
  const result = input.match(/^(\w+)<(\w(?:.+\w)?)>([^<>]+)/)
  console.log(result)
  if (result) {
    // TODO: 多泛型处理
    return { fullName: result[1] + result[3], generics: [result[2]] }
  }
  return { fullName: input, generics: [] }
}

export function getGenericsFromLine(line: string) {
  return line.replace(/^@generic\s+`?<?(\w.+\w)>?`?/, '$1')
}
