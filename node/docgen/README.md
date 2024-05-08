# @zx-libs/docgen

<p>
<a href="https://npmcharts.com/compare/@zx-libs/docgen?minimal=true"><img src="https://img.shields.io/npm/dm/@zx-libs/docgen.svg?sanitize=true" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/@zx-libs/docgen"><img src="https://img.shields.io/npm/v/@zx-libs/docgen.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@zx-libs/docgen"><img src="https://img.shields.io/npm/l/@zx-libs/docgen.svg?sanitize=true" alt="License"></a>
</p>

A document generator that read the comments in the code and automatically generate MarkDown documents.

```bash
npm i -D @zx-libs/docgen
```

```js
const { outputFile } = require('@zx-libs/docgen')
// import { outputFile } from '@zx-libs/docgen'

outputFile('./src', './outputDir/README.md', {})
```

see [DEMO](https://github.com/capricorncd/zx-libs/blob/main/node/docgen/scripts/docs.mjs) https://github.com/capricorncd/zx-libs/blob/main/node/docgen/scripts/docs.mjs

## Methods

### error(...args)

Output 😡 red color log in console

Param|Types|Required|Description
:--|:--|:--:|:--
args|`Array<string>`|yes|-

- @returns `void`

### getCommentsData(input, needArray, options)

Get comments from the `input` file or directory. Supported keywords are `type`, `document`, `method`, `code` and more.

#### For example

A source file `./src/index.js`, or a directory `./src`.

```js
/**
 * @method someMethod(param)
 * someMethod description 1 ...
 * someMethod description 2 ...
 * @param param `any` param's description
 * @returns `object` return's description
 * @sort 192
 */
function someMethod(param) {
  // do something ...
  return {...};
}
```

Get comments info form `./src` or `./src/index.js`

nodejs file `./scripts/create-docs.js`.

```js
const path = require('path')
const { getCommentsData } = require('@zx-libs/docgen')

const result = getCommentsData(path.resolve(__dirname, './src'));
console.log(result);
```

result

```js
{
  '/usr/.../src/index.js': {
    method_someMethod: {
      type: 'method',
      sort: 192,
      name: 'someMethod',
      fullName: 'someMethod(param)',
      desc: [
        'someMethod description 1 ...',
        'someMethod description 2 ...',
      ],
      params: [
        {
          name: 'param',
          required: true,
          desc: ['param\'s description'],
          types: ['any'],
          raw: 'param `any` param\'s description',
        },
      ],
      returns: [
        {
          types: ['object'],
          desc: ['return\'s description'],
          raw: '`object` return\'s description',
        },
      ],
      codes: [],
      private: false,
      path: '/usr/.../src/index.js',
    },
    method_someMethod2: { ... },
    document_someDocument: { ... },
    type_someTypeName: { ... },
    ...
  }
}
```

Parameter `needArray` is `true`, or `const { data } = outputFile(path.resolve(__dirname, './src'))`, result/data:

```js
[
  {
    type: 'method',
    sort: 192,
    name: 'someMethod',
    fullName: 'someMethod(param)',
    desc: [
      'someMethod description 1 ...',
      'someMethod description 2 ...',
    ],
    params: [
      {
        name: 'param',
        required: true,
        desc: ['param\'s description'],
        types: ['any'],
        raw: 'param `any` param\'s description',
      },
    ],
    returns: [
      {
        types: ['object'],
        desc: ['return\'s description'],
        raw: '`object` return\'s description',
      },
    ],
    codes: [],
    private: false,
    path: '/usr/.../src/index.js',
  },
  ...
]
```

Param|Types|Required|Description
:--|:--|:--:|:--
input|`string`/`string[]`|yes|The target file or directory.
needArray|`boolean`|no|It's true will be returned an array. default `false`.
options|`GetCommentsDataOptions`|no|[GetCommentsDataOptions](#GetCommentsDataOptions), default `{}`

- @returns `Record<filePath, Record<commentTypeName, CommentInfoItem>> | CommentInfoItem[]` It's an array if `needArray` is true. What's [CommentInfoItem](#commentinfoitem).

### getTypes(data)

Get types from getCommentsData's returned data.

Param|Types|Required|Description
:--|:--|:--:|:--
data|`Record<filePath, Record<commentTypeName, CommentInfoItem>>`/`CommentInfoItem[]`|yes|The data obtained using the [getCommentsData](#getcommentsdatainput-needarray-options) method

- @returns `CommentInfoItem[]` Returned is only `type` [CommentInfoItem](#CommentInfoItem).

### isFileLike(filePath)

is file like, `*.ext`.

Param|Types|Required|Description
:--|:--|:--:|:--
filePath|`string`|yes|-

- @returns `boolean`

### isValidArray(arr)

Determine whether `arr` is an array and it has some elements.

Param|Types|Required|Description
:--|:--|:--:|:--
arr|`T[]`|no|-

- @generic `T`

- @returns `boolean`

### log(...args)

Output 😎 green color log in console

Param|Types|Required|Description
:--|:--|:--:|:--
args|`Array<string>`|yes|-

- @returns `void`

### mkdirSync(dir)

make a directory synchronously

Param|Types|Required|Description
:--|:--|:--:|:--
dir|`string`|yes|directory path

- @returns `void`

### outputFile(input, outputDirOrFile, options)

Output the obtained annotation content as a document.

Param|Types|Required|Description
:--|:--|:--:|:--
input|`{[filePath]: {[key]: CommentInfoItem}}`/`CommentInfoItem[]`/`string`|yes|Comment obtained from the source. When `string` it's a file path, and the [getCommentsData](#getcommentsdatainput-needarray-options) will be called. What's [CommentInfoItem](#commentinfoitem).
outputDirOrFile|`string`|no|Optional parameter. The file or directory where the output will be written. When `outputDirOrFile` is `undefined`, no file will be output.
options|`OutputFileOptions`|no|[OutputFileOptions](#OutputFileOptions)

- @returns `OutputFileReturns | OutputFileReturns[]` What's [OutputFileReturns](#outputfilereturns)

### toTableLines(data)

Convert `data` to a table in Markdown format.

Param|Types|Required|Description
:--|:--|:--:|:--
data|`ToTableLinesParamData`|yes|see type [ToTableLinesParamData](#ToTableLinesParamData).

- @returns `string[]`

### warn(...args)

Output 😕 yellow color log in console

Param|Types|Required|Description
:--|:--|:--:|:--
args|`Array<string>`|yes|-

- @returns `void`

### writeFileSync(outputFileName, outputLines)

Synchronized file write function.

Param|Types|Required|Description
:--|:--|:--:|:--
outputFileName|`string`|yes|Output filename, absolute path.
outputLines|`string[]`/`NodeJS.ArrayBufferView`/`string`|yes|The output file content, an array of strings.

- @returns `void`

## Types

### CommentInfoItem

CommentInfoItem is the comment information read with the [getCommentsData](#getcommentsdatainput-needarray-options) function.

Prop|Types|Required|Description
:--|:--|:--:|:--
type|`string`|yes|method/type/class/document
name|`string`|yes|@method name(...args)'s `name`
fullName|`string`|yes|@method name(...args)'s `name(...args)`
desc|`string[]`|yes|description
params|`CommentInfoItemParam[]`|yes|method's params
returns|`CommentInfoItemReturn[]`|yes|method's returns
codes|`string[]`|yes|for example codes
private|`boolean`|yes|Whether the member method of the class is private
path|`string`|yes|file path
props|`CommentInfoItemProp[]`|no|[CommentInfoItemProp](#CommentInfoItemProp)
sort|`number`|yes|sort in the output file
generics|`string[]`|yes|generic

<details>
<summary>Source Code</summary>

```ts
interface CommentInfoItem {
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
```

</details>

### CommentInfoItemParam

[CommentInfoItem](#CommentInfoItem)'s `params`.

Prop|Types|Required|Description
:--|:--|:--:|:--
raw|`string`|yes|unprocessed raw string
name|`string`|yes|parameter name or property name
required|`boolean`|yes|Whether the parameter is required, or the field must exist in the returned data.
desc|`string[]`|yes|parameter or property's descriptions
types|`string[]`|yes|parameter or property's types

<details>
<summary>Source Code</summary>

```ts
interface CommentInfoItemParam {
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
```

</details>

### CommentInfoItemProp

The properties of [CommentInfoItem](#CommentInfoItem), only exists when the type is `type` or `interface`.

Prop|Types|Required|Description
:--|:--|:--:|:--
name|`string`|yes|parameter name or property name
required|`boolean`|yes|Whether the parameter is required, or the field must exist in the returned data.
desc|`string[]`|yes|parameter or property's descriptions
types|`string[]`|yes|parameter or property's types
raw|`string`|yes|raw annotation string

<details>
<summary>Source Code</summary>

```ts
interface CommentInfoItemProp extends CommentInfoItemParam {
  raw: string // raw annotation string
}
```

</details>

### CommentInfoItemReturn

[CommentInfoItem](#CommentInfoItem)'s `return`.

Prop|Types|Required|Description
:--|:--|:--:|:--
desc|`string[]`|yes|returned's descriptions.
types|`string[]`|yes|returned's types
raw|`string`|yes|raw annotation string

<details>
<summary>Source Code</summary>

```ts
interface CommentInfoItemReturn {
  // returned's descriptions.
  desc: string[]
  // returned's types
  types: string[]
  // raw annotation string
  raw: string
}
```

</details>

### DocTypes

```ts
type DocTypes = 'document' | 'method' | 'type' | 'constant'
```

### ExpendTypesHandler

expend types handler of [GetCommentsDataOptions](#GetCommentsDataOptions)

```ts
type ExpendTypesHandler = (data: CommentInfoItem, line: string) => void
```

### GetCommentsDataOptions

Parameter `options` of function [getCommentsData](#getcommentsdatainput-needarray-options)

Prop|Types|Required|Description
:--|:--|:--:|:--
fileType|`RegExp`|no|Regular expression for the type of file to be read, defaults to `/\.[mc]?[tj]sx?$/`.
disableKeySorting|`boolean`|no|Disables key sorting, defaults to `false`, and sorts alphabetically.
types|`CommentInfoItem[]`|no|This `types` array is obtained from other files or directories for `extends` related processing.
expendTypes|`string[]`|no|expend types of getCommentsData function.
expendTypesHandlers|`Record<string, ExpendTypesHandler>`|no|handler of the expend types.
codeTypes|`string[]`|no|Need to get source code of the type, default `['type', 'constant']`.
isExtractCodeFromComments|`boolean`|no|If true, the code in the comment will be added to the end of the @document or @method.

<details>
<summary>Source Code</summary>

```ts
interface GetCommentsDataOptions {
  // Regular expression for the type of file to be read, defaults to `/\.[mc]?[tj]sx?$/`.
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
```

</details>

### OutputFileInput

A parameter `input` of function [outputFile](#outputfileinput-outputdirorfile-options).

```ts
type OutputFileInput =
  | string
  | string[]
  | Record<string, Record<string, CommentInfoItem>>
  | CommentInfoItem[]
```

### OutputFileOptionAlias

Prop|Types|Required|Description
:--|:--|:--:|:--
tableHead|`Record<string, string>`|no|Alias of table head th inner text.
sourceCodeSummary|`string`|no|Summary of details, `<details><summary>Source Code</summary></details>`'s summary, default `Source Code`.
requiredValues|`OutputFileOptionAliasRequiredValues`|no|Required values
types|`Record<string, string>`|no|Alias of the DocTypes name. `types: { method: '方法/函数' }`

<details>
<summary>Source Code</summary>

```ts
interface OutputFileOptionAlias {
  // Alias of table head th inner text.
  tableHead?: Record<string, string>
  // Summary of details, `<details><summary>Source Code</summary></details>`'s summary, default `Source Code`.
  sourceCodeSummary?: string
  // Required values
  requiredValues?: OutputFileOptionAliasRequiredValues
  // Alias of the DocTypes name. `types: { method: '方法/函数' }`
  types?: Record<string, string>
}
```

</details>

### OutputFileOptionAliasRequiredValues

Required values of [OutputFileOptionAlias](#OutputFileOptionAlias). For example `{requiredValues: {0: 'no', 1: 'yes'}}` or `{requiredValues: {method: {0: 'no', 1: 'yes'}}}`. And `{requiredValues: ['no', 'yes']}` or `{requiredValues: {method: ['no', 'yes']}}`

```ts
type OutputFileOptionAliasRequiredValues =
  | Record<string, string>
  | Record<string, Record<string, string>>
```

### OutputFileOptionHandler

Custom type output handler.

Prop|Types|Required|Description
:--|:--|:--:|:--
arr|`CommentInfoItem[],`|yes|-
options|`OutputFileOptions,`|yes|-
lines|`string[]`|yes|-

<details>
<summary>Source Code</summary>

```ts
type OutputFileOptionHandler = (
  arr: CommentInfoItem[],
  options: OutputFileOptions,
  lines: string[]
) => void
```

</details>

### OutputFileOptionLines

Prop|Types|Required|Description
:--|:--|:--:|:--
start|`string`/`string[]`|no|The `start` that need to be added at the start.
end|`string`/`string[]`|no|The 'end' that need to be added at the end, such as adding some license information. `['## License', 'BLANK_LINE', 'MIT License © 2018-Present [Capricorncd](https://github.com/capricorncd).']`.
afterType|`Record<string, string \| string[]>`|no|It's will be appended to the `[type]`, before the `## [other type]`
afterTitle|`Record<string, string \| string[]>`|no|It's will be insert after `type` title line. For example, `{method: ['some type description content']}`, It's will to insert after `method` line, like this's `['## Methods', 'some type description content', '...']`

<details>
<summary>Source Code</summary>

```ts
interface OutputFileOptionLines {
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
```

</details>

### OutputFileOptions

Options of the function [outputFile](#outputfileinput-outputdirorfile-options), extends [GetCommentsDataOptions](#GetCommentsDataOptions)

Prop|Types|Required|Description
:--|:--|:--:|:--
fileType|`RegExp`|no|Regular expression for the type of file to be read, defaults to `/\.[mc]?[tj]sx?$/`.
disableKeySorting|`boolean`|no|Disables key sorting, defaults to `false`, and sorts alphabetically.
types|`CommentInfoItem[]`|no|This `types` array is obtained from other files or directories for `extends` related processing.
expendTypes|`string[]`|no|expend types of getCommentsData function.
expendTypesHandlers|`Record<string, ExpendTypesHandler>`|no|handler of the expend types.
codeTypes|`string[]`|no|Need to get source code of the type, default `['type', 'constant']`.
isExtractCodeFromComments|`boolean`|no|If true, the code in the comment will be added to the end of the @document or @method.
methodWithRaw|`boolean`|no|Display `methods` using raw string, not table. default `false`
typeWithTable|`boolean`|no|Display `types` using only table, not Source Code. default `false`
typeWithSourceCode|`boolean`|no|Display `types` using only Source Code, not table. default `false`
typeWithAuto|`boolean`|no|By default, `table` and `<details><summary>Source Code</summary></details>` are displayed, but sometimes `table`'s data may not exist, only `Source Code` can be displayed and `<details>` not using.
lines|`OutputFileOptionLines`|no|lines. [OutputFileOptionLines](#OutputFileOptionLines)
alias|`OutputFileOptionAlias`|no|alias. [OutputFileOptionAlias](#OutputFileOptionAlias)
outputDocTypesAndOrder|`string[]`|no|Output types and their order, default `['document', 'method', 'type', 'constant']`
handlers|`Record<string, OutputFileOptionHandler>`|no|Custom type output handler. Note that the default handler function will not be executed when this parameter is set. For example `{method: (arr, options, lines) => do something}`.
tableAlign|`Record<string, 'left' \| 'center' \| 'right'>`|no|Alignment of table columns, {Required: 'center'}. Default `{[key]: 'left'}`

<details>
<summary>Source Code</summary>

```ts
interface OutputFileOptions extends GetCommentsDataOptions {
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
```

</details>

### OutputFileReturns

Returned data of function [outputFile](#outputfileinput-outputdirorfile-options).

Prop|Types|Required|Description
:--|:--|:--:|:--
outputFileName|`string`/`null`|yes|outputted filename
lines|`string[]`|yes|line array in the output file
data|`CommentInfoItem[]`|yes|comments data read from code

<details>
<summary>Source Code</summary>

```ts
interface OutputFileReturns {
  // outputted filename
  outputFileName: string | null
  // line array in the output file
  lines: string[]
  // comments data read from code
  data: CommentInfoItem[]
}
```

</details>

### TableHeadInnerText

Table head th inner text of the output file.

```ts
type TableHeadInnerText =
  | 'Name'
  | 'Param'
  | 'Prop'
  | 'Types'
  | 'Required'
  | 'Description'
```

### ToTableLinesParamData

The options type of function [toTableLines](#totablelinesdata).

Prop|Types|Required|Description
:--|:--|:--:|:--
align|`string[]`|yes|Alignment of the table content, `left`, `center` or `right`, the default is `left`.
thead|`string[]`|no|The table header displays a one-dimensional array of content. `{thead: ['Name', 'Description']}`.
tbody|`string[][]`|no|The table body displays a two-dimensional array of contents. `{tbody: [['someName1', 'someDescription1'],['someName2', 'someDescription2']]}`.

<details>
<summary>Source Code</summary>

```ts
interface ToTableLinesParamData {
  // Alignment of the table content, `left`, `center` or `right`, the default is `left`.
  align: string[]
  // The table header displays a one-dimensional array of content.
  // `{thead: ['Name', 'Description']}`.
  thead?: string[]
  // The table body displays a two-dimensional array of contents.
  // `{tbody: [['someName1', 'someDescription1'],['someName2', 'someDescription2']]}`.
  tbody?: string[][]
}
```

</details>

## Constants

### BLANK_LINE

blank line.

```ts
const BLANK_LINE = ''
```

### DOC_TYPES

Supported annotation types.

```ts
const DOC_TYPES = {
  method: 'method',
  type: 'type',
  document: 'document',
  constant: 'constant',
  property: 'property',
}
```

## License

MIT License © 2022-Present [Capricorncd](https://github.com/capricorncd).
