/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/05/08 16:37:46 (GMT+0900)
 */

/**
 * @type CommentInfoItem
 * CommentInfoItem is the comment information read with the [getCommentsData](#getcommentsdatainput-needarray-options) function.
 */
export interface CommentInfoItem {
  // method/type/class/document
  type: string
  // @method name(...args)'s `name`
  name: string
  // @method name(...args)'s `name(...args)`
  fullName: string
  // description
  desc: string[]
  // method's params
  params: CommentInfoItemParam[]
  // method's returns
  returns: CommentInfoItemReturn[]
  // for example codes
  codes: string[]
  // Whether the member method of the class is private
  private: boolean
  // file path
  path: string
  // [CommentInfoItemProp](#CommentInfoItemProp)
  props?: CommentInfoItemProp[]
  // sort in the output file
  sort: number
  // generic
  generics: string[]
}

/**
 * @type CommentInfoItemParam
 * [CommentInfoItem](#CommentInfoItem)'s `params`.
 */
export interface CommentInfoItemParam {
  // unprocessed raw string
  raw: string
  // parameter name or property name
  name: string
  // Whether the parameter is required, or the field must exist in the returned data.
  required: boolean
  // parameter or property's descriptions
  desc: string[]
  // parameter or property's types
  types: string[]
}

/**
 * @type CommentInfoItemProp
 * The properties of [CommentInfoItem](#CommentInfoItem), only exists when the type is `type` or `interface`.
 */
export interface CommentInfoItemProp extends CommentInfoItemParam {
  raw: string // raw annotation string
}

/**
 * @type CommentInfoItemReturn
 * [CommentInfoItem](#CommentInfoItem)'s `return`.
 */
export interface CommentInfoItemReturn {
  // returned's descriptions.
  desc: string[]
  // returned's types
  types: string[]
  // raw annotation string
  raw: string
}

/**
 * @type OutputFileReturns
 * Returned data of function [outputFile](#outputfileinput-outputdirorfile-options).
 */
export interface OutputFileReturns {
  // outputted filename
  outputFileName: string | null
  // line array in the output file
  lines: string[]
  // comments data read from code
  data: CommentInfoItem[]
}

/**
 * @type OutputFileInput
 * A parameter `input` of function [outputFile](#outputfileinput-outputdirorfile-options).
 */
export type OutputFileInput =
  | string
  | string[]
  | Record<string, Record<string, CommentInfoItem>>
  | CommentInfoItem[]

/**
 * OutputFileReturnData<T>
 * Returned data of function outputFile.
 */
type OutputFileReturnData<T> = T extends string | string[] | CommentInfoItem[]
  ? OutputFileReturns[]
  : OutputFileReturns

/**
 * getCommentsData
 * @param input
 * @param needArray
 * @param options
 */
export function getCommentsData(
  input: string | string[],
  needArray?: boolean,
  options?: GetCommentsDataOptions
): CommentInfoItem[] | Record<string, Record<string, CommentInfoItem>>

export function getCommentsData(
  input: string | string[],
  options?: GetCommentsDataOptions
): Record<string, Record<string, CommentInfoItem>>

/**
 * @type DocTypes
 */
export type DocTypes = 'document' | 'method' | 'type' | 'constant'

/**
 * @type OutputFileOptionLines
 */
export interface OutputFileOptionLines {
  // The `start` that need to be added at the start.
  start?: string | string[]
  // The 'end' that need to be added at the end, such as adding some license information. `['## License', 'BLANK_LINE', 'MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).']`.
  end?: string | string[]
  // It's will be appended to the `[type]`, before the `## [other type]`
  afterType?: Record<string, string | string[]>
  // It's will be insert after `type` title line.
  // For example, `{method: ['some type description content']}`,
  // It's will to insert after `method` line, like this's `['## Methods', 'some type description content', '...']`
  afterTitle?: Record<string, string | string[]>
}

/**
 * @type TableHeadInnerText
 * Table head th inner text of the output file.
 */
export type TableHeadInnerText =
  | 'Name'
  | 'Param'
  | 'Prop'
  | 'Types'
  | 'Required'
  | 'Description'

/**
 * @type OutputFileOptionAliasRequiredValues
 * Required values of [OutputFileOptionAlias](#OutputFileOptionAlias). For example `{requiredValues: {0: 'no', 1: 'yes'}}` or `{requiredValues: {method: {0: 'no', 1: 'yes'}}}`. And `{requiredValues: ['no', 'yes']}` or `{requiredValues: {method: ['no', 'yes']}}`
 */
export type OutputFileOptionAliasRequiredValues =
  | Record<string, string>
  | Record<string, Record<string, string>>

/**
 * @type OutputFileOptionAlias
 */
export interface OutputFileOptionAlias {
  // Alias of table head th inner text.
  tableHead?: Record<string, string>
  // Summary of details, `<details><summary>Source Code</summary></details>`'s summary, default `Source Code`.
  sourceCodeSummary?: string
  // Required values
  requiredValues?: OutputFileOptionAliasRequiredValues
  // Alias of the DocTypes name. `types: { method: '方法/函数' }`
  types?: Record<string, string>
}

/**
 * @type OutputFileOptionHandler
 * Custom type output handler.
 */
export type OutputFileOptionHandler = (
  arr: CommentInfoItem[],
  options: OutputFileOptions,
  lines: string[]
) => void

/**
 * @type OutputFileOptions
 * Options of the function [outputFile](#outputfileinput-outputdirorfile-options), extends [GetCommentsDataOptions](#GetCommentsDataOptions)
 */
export interface OutputFileOptions extends GetCommentsDataOptions {
  // Display `methods` using raw string, not table. default `false`
  methodWithRaw?: boolean
  // Display `types` using only table, not Source Code. default `false`
  typeWithTable?: boolean
  // Display `types` using only Source Code, not table. default `false`
  typeWithSourceCode?: boolean
  // By default, `table` and `<details><summary>Source Code</summary></details>` are displayed,
  // but sometimes `table`'s data may not exist, only `Source Code` can be displayed and `<details>` not using.
  typeWithAuto?: boolean
  // lines. [OutputFileOptionLines](#OutputFileOptionLines)
  lines?: OutputFileOptionLines
  // alias. [OutputFileOptionAlias](#OutputFileOptionAlias)
  alias?: OutputFileOptionAlias
  // Output types and their order, default `['document', 'method', 'type', 'constant']`
  outputDocTypesAndOrder?: string[]
  // Custom type output handler. Note that the default handler function will not be executed when this parameter is set. For example `{method: (arr, options, lines) => do something}`.
  handlers?: Record<string, OutputFileOptionHandler>
  // Alignment of table columns, {Required: 'center'}. Default `{[key]: 'left'}`
  tableAlign?: Record<string, 'left' | 'center' | 'right'>
}

/**
 * outputFile
 * @param input
 * @param outputDirOrFile
 * @param options
 */
export function outputFile<T extends OutputFileInput>(
  input: T,
  outputDirOrFile?: string,
  options?: OutputFileOptions
): OutputFileReturnData<T>

export function outputFile<T extends OutputFileInput>(
  input: T,
  options?: OutputFileOptions
): OutputFileReturnData<T>

export function mkdirSync(dir: string): void

export function log(...args: Array<any>): void

export function warn(...args: Array<any>): void

export function error(...args: Array<any>): void

/**
 * @type GetCommentsDataOptions
 * Parameter `options` of function [getCommentsData](#getcommentsdatainput-needarray-options)
 */
export interface GetCommentsDataOptions {
  // Regular expression for the type of file to be read, defaults to `/\.[tj]s$/`.
  fileType?: RegExp
  // Disables key sorting, defaults to `false`, and sorts alphabetically.
  disableKeySorting?: boolean
  // This `types` array is obtained from other files or directories for `extends` related processing.
  types?: CommentInfoItem[]
  // expend types of getCommentsData function.
  expendTypes?: string[]
  // handler of the expend types.
  expendTypesHandlers?: Record<string, ExpendTypesHandler>
  // Need to get source code of the type, default `['type', 'constant']`.
  codeTypes?: string[]
  // If true, the code in the comment will be added to the end of the @document or @method.
  isExtractCodeFromComments?: boolean
}

/**
 * @type ExpendTypesHandler
 * expend types handler of [GetCommentsDataOptions](#GetCommentsDataOptions)
 */
export type ExpendTypesHandler = (data: CommentInfoItem, line: string) => void

/**
 * @type ToTableLinesParamData
 * The options type of function [toTableLines](#totablelinesdata).
 */
export interface ToTableLinesParamData {
  // Alignment of the table content, `left`, `center` or `right`, the default is `left`.
  align: string[]
  // The table header displays a one-dimensional array of content.
  // `{thead: ['Name', 'Description']}`.
  thead?: string[]
  // The table body displays a two-dimensional array of contents.
  // `{tbody: [['someName1', 'someDescription1'],['someName2', 'someDescription2']]}`.
  tbody?: string[][]
}

/**
 * 兼容处理，后期版本移除
 */
export type ToTableLinesData = ToTableLinesParamData

/**
 * toTableLines
 * @param data `ToTableLinesParamData`
 */
export function toTableLines(data: ToTableLinesParamData): string[]

/**
 * isValidArray
 * @param arr
 */
export function isValidArray(arr: any): boolean

/**
 * isFileLike
 * @param input
 */
export function isFileLike(input: any): boolean

/**
 * getTypes
 * @param data
 */
export function getTypes(
  data: Record<string, Record<string, CommentInfoItem>> | CommentInfoItem[]
): CommentInfoItem[]

/**
 * writeFileSync
 * @param outputFileName `string`
 * @param outputLines `string[]`
 */
export function writeFileSync(
  outputFileName: string,
  outputLines: string[] | NodeJS.ArrayBufferView | string
): void
