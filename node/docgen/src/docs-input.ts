/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 13:13:33 (GMT+0900)
 */
import fs from 'node:fs'
import { EOL } from 'node:os'
import path from 'node:path'
import { isObject } from '@zx-libs/utils'
import { DOC_TYPES } from './const'
import {
  isValidArray,
  handleProps,
  getTypeName,
  handleReturn,
  handleParam,
  mergeIntoArray,
  handleSort,
  splitFullNameRaw,
  getGenericsFromLine,
} from './helpers'
import type { GetCommentsDataOptions, CommentInfoItem } from './types.d'

/**
 * handle file
 * get `method|type|class|document` annotations in file.
 * @param filePath `string` absolute file path.
 * @param data `object`
 * @param options `GetCommentsDataOptions`
 * @returns `Record<string, CommentInfoItem>`
 */
export function handleFile(
  filePath: string,
  data: Record<string, CommentInfoItem>,
  options: GetCommentsDataOptions = {}
) {
  // target types
  const targetTypes = Object.keys(DOC_TYPES)
  if (isValidArray(options.expendTypes)) {
    options.expendTypes.forEach((t) => {
      if (t && !targetTypes.includes(t)) {
        targetTypes.push(t)
      }
    })
  }

  const typesRegExp = new RegExp(`^\\*\\s*@(${targetTypes.join('|')})\\s*(.+)`)

  // types of source code
  const codeTypes = [DOC_TYPES.type, DOC_TYPES.constant]
  if (isValidArray(options.codeTypes)) {
    options.codeTypes.forEach((t) => {
      codeTypes.push(t)
    })
  }

  let isTargetComment = false
  let isCode = false
  let type = ''
  let typeName = ''
  // dataKey = type_typeName
  // Avoid the problem of type naming the same being overwritten
  let dataKey = ''
  let tempStr = ''
  fs.readFileSync(filePath, 'utf8')
    .toString()
    .split(EOL)
    .forEach((line) => {
      const originalLine = line
      line = line.trim()
      // Start with method|type|document annotations
      const found = line.match(typesRegExp)
      if (found) {
        isTargetComment = true

        type = found[1]

        // setContents(box, newContents)
        // InterfaceName<Type1, Type2>
        // classInstance.someMethod(param)
        const { fullName, generics } = splitFullNameRaw(found[2].trim())
        // setContents
        // InterfaceName
        // classInstance.someMethod
        typeName = getTypeName(fullName)

        // Avoid duplicate names being overwritten
        dataKey = `${type}_${typeName}`

        // data
        data[dataKey] = {
          type,
          sort: 0,
          name: typeName,
          fullName,
          desc: [],
          params: [],
          returns: [],
          codes: [],
          private: false,
          path: filePath,
          generics,
        }
        return
      } else if (line === '*/' && isTargetComment) {
        isTargetComment = false
        // typeName = null;
        return
      }
      if (line === '/**') {
        typeName = ''
      }
      if (!isTargetComment || !typeName) {
        // type codes
        if (typeName && codeTypes.includes(type) && line) {
          data[dataKey].codes.push(
            originalLine.replace(/^export(\s+default)?\s*/, '')
          )
        }
        return
      }

      // custom handler
      if (typeof options.expendTypesHandlers?.[type] === 'function') {
        options.expendTypesHandlers[type](data[dataKey], line)
      } else {
        // default handler
        if (/^\*\s*(```\w+|@code)/.test(line)) {
          isCode = true
        }

        if (/^\*(.*)/.test(line)) {
          tempStr = RegExp.$1

          const temp = tempStr.trim()
          if (temp.startsWith('@param')) {
            data[dataKey].params.push(handleParam(temp))
          } else if (temp.startsWith('@return')) {
            data[dataKey].returns.push(handleReturn(temp))
          } else if (temp.startsWith('@private')) {
            data[dataKey].private = true
          } else if (temp.startsWith('@sort')) {
            data[dataKey].sort = handleSort(temp)
          } else if (temp.startsWith('@generic')) {
            data[dataKey].generics.push(getGenericsFromLine(temp))
          } else if (isCode) {
            if (temp.startsWith('@code')) {
              // push a blank line.
              if (options.isExtractCodeFromComments) {
                data[dataKey].codes.push('')
              }
              tempStr = tempStr.replace(/@code\w*/, '').trim()
            }

            const codeStr = tempStr
              // Remove first null character of `tempStr`
              .replace(/^\s/, '')
              // Restore escaped strings in comments
              .replace('*\\/', '*/')

            // push `codeStr` to `codes`
            //  是否将注释中的代码提出，并单独处理
            if (options.isExtractCodeFromComments) {
              data[dataKey].codes.push(codeStr)
            } else {
              data[dataKey].desc.push(codeStr)
            }
          } else {
            data[dataKey].desc.push(temp.replace('@description', '').trim())
          }
        }

        if (isCode && /^\*\s*```$/.test(line)) {
          isCode = false
        }
      }
    })
  return data
}

/**
 * @method getCommentsData(input, needArray, options)
 * Get comments from the `input` file or directory. Supported keywords are `type`, `document`, `method`, `code` and more.
 *
 * #### For example
 *
 * A source file `./src/index.js`, or a directory `./src`.
 *
 * ```js
 * /**
 *  * @method someMethod(param)
 *  * someMethod description 1 ...
 *  * someMethod description 2 ...
 *  * @param param `any` param's description
 *  * @returns `object` return's description
 *  * @sort 192
 *  *\/
 * function someMethod(param) {
 *   // do something ...
 *   return {...};
 * }
 *```
 *
 * Get comments info form `./src` or `./src/index.js`
 *
 * nodejs file `./scripts/create-docs.js`.
 *
 *```js
 * const path = require('path')
 * const { getCommentsData } = require('@zx-libs/docgen')
 *
 * const result = getCommentsData(path.resolve(__dirname, './src'));
 * console.log(result);
 * ```
 *
 * result
 *
 * ```js
 * {
 *   '/usr/.../src/index.js': {
 *     method_someMethod: {
 *       type: 'method',
 *       sort: 192,
 *       name: 'someMethod',
 *       fullName: 'someMethod(param)',
 *       desc: [
 *         'someMethod description 1 ...',
 *         'someMethod description 2 ...',
 *       ],
 *       params: [
 *         {
 *           name: 'param',
 *           required: true,
 *           desc: ['param\'s description'],
 *           types: ['any'],
 *           raw: 'param `any` param\'s description',
 *         },
 *       ],
 *       returns: [
 *         {
 *           types: ['object'],
 *           desc: ['return\'s description'],
 *           raw: '`object` return\'s description',
 *         },
 *       ],
 *       codes: [],
 *       private: false,
 *       path: '/usr/.../src/index.js',
 *     },
 *     method_someMethod2: { ... },
 *     document_someDocument: { ... },
 *     type_someTypeName: { ... },
 *     ...
 *   }
 * }
 * ```
 *
 * Parameter `needArray` is `true`, or `const { data } = outputFile(path.resolve(__dirname, './src'))`, result/data:
 *
 * ```js
 * [
 *   {
 *     type: 'method',
 *     sort: 192,
 *     name: 'someMethod',
 *     fullName: 'someMethod(param)',
 *     desc: [
 *       'someMethod description 1 ...',
 *       'someMethod description 2 ...',
 *     ],
 *     params: [
 *       {
 *         name: 'param',
 *         required: true,
 *         desc: ['param\'s description'],
 *         types: ['any'],
 *         raw: 'param `any` param\'s description',
 *       },
 *     ],
 *     returns: [
 *       {
 *         types: ['object'],
 *         desc: ['return\'s description'],
 *         raw: '`object` return\'s description',
 *       },
 *     ],
 *     codes: [],
 *     private: false,
 *     path: '/usr/.../src/index.js',
 *   },
 *   ...
 * ]
 * ```
 * @param input `string | string[]` The target file or directory.
 * @param needArray? `boolean` It's true will be returned an array. default `false`.
 * @param options? `GetCommentsDataOptions` [GetCommentsDataOptions](#GetCommentsDataOptions), default `{}`
 * @returns `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]` It's an array if `needArray` is true. What's [CommentInfoItem](#commentinfoitem).
 */
export function getCommentsData(
  input: string | string[],
  needArray: boolean | GetCommentsDataOptions,
  options: GetCommentsDataOptions = {}
) {
  const data: Record<string, Record<string, CommentInfoItem>> = {}
  if (isObject(needArray)) {
    options = needArray
    needArray = false
  }

  _getCommentsData(input, data, options)

  handleTypes(data, options)
  return needArray ? mergeIntoArray(data, options) : data
}

/**
 * _getCommentsData
 * @param input
 * @param data
 * @param options
 */
function _getCommentsData(
  input: string | string[],
  data: Record<string, Record<string, CommentInfoItem>>,
  options: GetCommentsDataOptions
) {
  const { fileType = /\.(ts|js)$/ } = options

  if (Array.isArray(input)) {
    input.forEach((str) => {
      _getCommentsData(str, data, options)
    })
  } else {
    const stat = fs.statSync(input)
    if (stat.isDirectory()) {
      fs.readdirSync(input).forEach((file) => {
        _getCommentsData(path.join(input, file), data, options)
      })
    } else if (stat.isFile() && fileType.test(input)) {
      data[input] = {}
      handleFile(input, data[input], options)
    }
  }
}

/**
 * @method getTypes(data)
 * Get types from getCommentsData's returned data.
 * @param data `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]` The data obtained using the [getCommentsData](#getcommentsdatainput-needarray-options) method
 * @returns `CommentInfoItem[]` Returned is only `type` [CommentInfoItem](#CommentInfoItem).
 */
export function getTypes(
  data: Record<string, Record<string, CommentInfoItem>> | CommentInfoItem[]
) {
  // CommentInfoItem[]
  if (Array.isArray(data)) {
    return data.filter((item) => item.type === DOC_TYPES.type)
  }

  // Record<filePath, Record<commentTypeName, CommentInfoItem>>
  const types: CommentInfoItem[] = []
  // get types from `data`
  let item
  Object.keys(data).forEach((filePath) => {
    Object.keys(data[filePath]).forEach((typeName) => {
      item = data[filePath][typeName]

      if (item.type === DOC_TYPES.type) {
        types.push(item)
      }
    })
  })
  return types
}

/**
 * handleTypes
 * @param data `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]`
 * @param options `GetCommentsDataOptions`
 */
function handleTypes(
  data: Record<string, Record<string, CommentInfoItem>> | CommentInfoItem[],
  options: GetCommentsDataOptions
) {
  const types = getTypes(data)

  // `options.types` obtained from other files or directories
  if (isValidArray(options.types)) {
    types.push(...options.types)
  }

  types.forEach((item) => {
    item.props = handleProps(item, types)
  })
}
