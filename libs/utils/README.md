# @zx-libs/utils

<p>
  <a href="https://npmcharts.com/compare/@zx-libs/utils?minimal=true"><img src="https://img.shields.io/npm/dm/@zx-libs/utils.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@zx-libs/utils"><img src="https://img.shields.io/npm/v/@zx-libs/utils.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@zx-libs/utils"><img src="https://img.shields.io/npm/l/@zx-libs/utils.svg?sanitize=true" alt="License"></a>
</p>

`@zx-libs/utils` is some static method library, which contains [toSnakeCase](#tosnakecaseinput-connectsymbol), [splitValue](#splitvalueinput), [getLocalStorage](#getlocalstoragekey-def), [formatDate](#formatdatedate-format-langpackage), [createElement](#createelementtag-attrs-children), [classNames](#classnamesargs) and [other methods](#methods).


## Install

### NPM Install

```shell
npm i @zx-libs/utils
```

### Yarn add

```shell
yarn add @zx-libs/utils
```

### pnpm install

```shell
pnpm i @zx-libs/utils
```

## Usage

```typescript
import { formatDate } from '@zx-libs/utils'

formatDate('2020-12-04', 'yyyy/MM/dd W')
// 2020/12/04 Fri
```

<!--METHOD_START-->
## Methods

### $$(selector, doc)

Get the DOM elements that matches selector

Param|Types|Required|Description
:--|:--|:--:|:--
selector|`string`|yes|-
doc|`Document`/`HTMLElement`|no|default `document`

- @returns `HTMLElement[]`

### $(selector, doc)

Get the DOM element that matches selector

Param|Types|Required|Description
:--|:--|:--:|:--
selector|`string`/`HTMLElement`|yes|-
doc|`Document`/`HTMLElement`|no|default `document`

- @returns `HTMLElement | null`

### base64ToBlob(base64, type)

base64 to blob data

Param|Types|Required|Description
:--|:--|:--:|:--
base64|`string`|yes|-
type|`string`|no|the target blob mimeType, Example `image/jpeg`

- @returns `Blob`

### classNames(...args)

Merge css class names.
NOTE: Duplicate names will not be removed.
```js
classNames({ active: true, zero: 0 }, ['text-center'], 'flex', 0)
// 'active text-center flex 0'
```

Param|Types|Required|Description
:--|:--|:--:|:--
args|`string`/`any[]`/`{ bool: true, number: 1, str: 'x', obj: {}, arr: [], other: ? }`|yes|-

- @returns `string`

### clearLocalStorage()

Removing all the `localStorage` items.

- @returns `void`

### clearSessionStorage()

Removing all the `sessionStorage` items.

- @returns `void`

### createBlobURL(blob)

creates a string containing a URL representing the object given in the parameter.

Param|Types|Required|Description
:--|:--|:--:|:--
blob|`Blob`/`File`|yes|-

- @returns `string`

### createElement(tag, attrs, children)

create an element

Param|Types|Required|Description
:--|:--|:--:|:--
tag|`string`|yes|-
attrs|`Record<string, any>`|no|HTMLElement's attributes.
children|`string`/`HTMLElement`/`Node`/`string[]`/`HTMLElement[]`/`Node[]`|no|-

- @returns `HTMLElement`

### createUrlForGetRequest(url, params)

Create full URL for GET request
```js
createUrlForGetRequest('api/user', { age: 18 })
// 'api/user?age=18'
createUrlForGetRequest('api/user?class=a', { age: 18 })
// 'api/user?class=a&age=18'
```

Param|Types|Required|Description
:--|:--|:--:|:--
url|`string`|yes|-
params|`Record<string, unknown>`|yes|-

- @returns `string`

### fileToBase64(file)

read file to base64 string

Param|Types|Required|Description
:--|:--|:--:|:--
file|`File`/`Blob`|yes|-

- @returns `Promise<string>`

### formatBytes(bytes, useDecimal, decimalPlaces)

Digital Information Sizes Calculator

Param|Types|Required|Description
:--|:--|:--:|:--
bytes|`number`|yes|bytes
useDecimal|`boolean`|no|whether to use decimal for calculations. default `false`
decimalPlaces|`number`|no|How many decimal places to keep. default `2`

- @returns `object` `{unit: string, text: string, value: number, bytes: number}`

### formatDate(date, format, langPackage)

Date format,
see [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details
```js
// timestamp
formatDate( 20210101 , 'yyyy-MM-dd hh:mm:ss') // 1970-01-01 14:36:50
// yyyyMMdd
formatDate('20210101', 'yyyy-MM-dd hh:mm:ss') // 2021-01-01 00:00:00
```

Param|Types|Required|Description
:--|:--|:--:|:--
date|`any`|yes|any type of object
format|`string`|yes|like this `yyyy-MM-dd hh:mm:ss W`
langPackage|`ILangPackage`|no|-

- @returns `string`

### formatKeys(obj, isCamelCase)

Format the key of the object, using the `toSnakeCase` or `toCamelCase` method.
```js
formatObjKeys({lineHeight: 1.5}) // {'line-height': 1.5}
formatObjKeys({lineHeight: 1.5, childObj: {maxWidth: 100}})
// {'line-height': 1.5, 'child-obj': {'max-width': 100}}
formatObjKeys({'line-height': 1.5}, true) // {lineHeight: 1.5}
formatObjKeys({'line-height': 1.5, 'child-obj': {'max-width': 100}}, true)
// {lineHeight: 1.5, childObj: {maxWidth: 100}}
```

Param|Types|Required|Description
:--|:--|:--:|:--
obj|`object`|yes|-
isCamelCase|`boolean`|no|Whether the key of the object uses camel-case or snake-case, default `false`

- @returns `object`

### getLocalStorage(key, def)

Reading the `localStorage` item.

Param|Types|Required|Description
:--|:--|:--:|:--
key|`string`|yes|A string containing the name of the `key` you want to retrieve the value of.
def|`any`|yes|If the `key` does not exist, `def` is returned.

- @returns `any` Any object the value of the `key`. If the `key` does not exist, `def` is returned.

### getMaxZIndex(defaultZIndex)

Get the max zIndex value in the document

Param|Types|Required|Description
:--|:--|:--:|:--
defaultZIndex|`number`|no|Return value when none of the DOM elements have `zIndex` set, default `100`

- @returns `number`

### getScrollableParents(el, scrollDirection)

Get scrollable parent elements

Param|Types|Required|Description
:--|:--|:--:|:--
el|`HTMLElement`|yes|-
scrollDirection|`ScrollDirection`|no|optional values `x,y`

- @returns `HTMLElement[]`

### getSessionStorage(key, def)

Reading the `sessionStorage` item.

Param|Types|Required|Description
:--|:--|:--:|:--
key|`string`|yes|A string containing the name of the `key` you want to retrieve the value of.
def|`any`|yes|If the `key` does not exist, `def` is returned.

- @returns `any` Any object the value of the `key`. If the `key` does not exist, `def` is returned.

### getStyleValue(el, attr, needNumber)

Get the value of `CSSStyleDeclaration` or `CSSStyleDeclaration[attr]`

Param|Types|Required|Description
:--|:--|:--:|:--
el|`Node`|yes|-
attr|`string`|no|Arbitrary property key for CSSStyleDeclaration
needNumber|`boolean`|no|whether to cast the returned property value to a numeric type

- @returns `string | number | CSSStyleDeclaration | CSSRule | ((index: number) => string) | ((property: string, value: string/null, priority?: string) => void) | null`

### isArray(input)

determines whether the passed value is an Array

Param|Types|Required|Description
:--|:--|:--:|:--
input|`any`|yes|any type of object

- @returns `boolean`

### isElement(el)

determines whether the el is an Element

Param|Types|Required|Description
:--|:--|:--:|:--
el|`Node`|yes|DOM Node

- @returns `boolean`

### isNumber(input)

Determine whether it is a valid number.

```js
isNumber(10) // true
isNumber(-10.02) // true

isNumber(NaN) // false
isNumber(null) // false
isNumber(undefined) // false
```

Param|Types|Required|Description
:--|:--|:--:|:--
input|`any`|yes|any type of object.

- @returns `boolean`

### isNumberLike(input)

Determine if `input` is a string number

Param|Types|Required|Description
:--|:--|:--:|:--
input|`any`|yes|any type of object

- @returns `boolean`

### isObject(input)

determines whether the passed value is an object

Param|Types|Required|Description
:--|:--|:--:|:--
input|`any`|yes|any type of object

- @returns `boolean`

### joinUrl(...args)

format url,
```js
joinUrl('https://a.com/', '/news', 'detail/100001/?x=9')
// https://a.com/news/detail/100001?x=9
```

Param|Types|Required|Description
:--|:--|:--:|:--
args|`string[]`|yes|-

- @returns `string`

### randomId(prefix, suffix)

Generate a random string id.

Param|Types|Required|Description
:--|:--|:--:|:--
prefix|`string`|no|A prefix of the id
suffix|`string`|no|A suffix of the id

- @returns `string` Like this `prefix-xxxxx-xxxxx-xxxxxxxxxx-suffix`

### randomStr(length)

Generate a random string with a maximum length of 1000.

Param|Types|Required|Description
:--|:--|:--:|:--
length|`number`|no|The length of the random string, which has a maximum value of 1000.

- @returns `string`

### removeLocalStorage(key)

Removing the `localStorage` item.

Param|Types|Required|Description
:--|:--|:--:|:--
key|`string`|yes|A string containing the name of the key you want to remove.

- @returns `void`

### removeSessionStorage(key)

Removing the `sessionStorage` item.

Param|Types|Required|Description
:--|:--|:--:|:--
key|`string`|yes|A string containing the name of the key you want to remove.

- @returns `void`

### setLocalStorage(key, value)

It's accesses the current domain's `localStorage` object and adds a `value` to it using `localStorage.setItem()`.

Param|Types|Required|Description
:--|:--|:--:|:--
key|`string`|yes|A `string` containing the name of the key you want to create/update.
value|`any`|yes|Any `object` the value you want to give the `key` you are creating/updating.

- @returns `void`

### setSessionStorage(key, value)

It's accesses the current domain's `sessionStorage` object and adds a `value` to it using `sessionStorage.setItem()`.

Param|Types|Required|Description
:--|:--|:--:|:--
key|`string`|yes|A `string` containing the name of the key you want to create/update.
value|`any`|yes|Any `object` the value you want to give the `key` you are creating/updating.

- @returns `void`

### slice(arrayLike, offset)

Convert pseudo-array to array
```js
slice({ length: 2, 0: 100, 1: 100 }) // [100, 100]
```

Param|Types|Required|Description
:--|:--|:--:|:--
arrayLike|`pseudo-array`|yes|-
offset|`number`|no|default `0`

- @returns `array T[]`

### splitBase64(base64)

split base64 data

Param|Types|Required|Description
:--|:--|:--:|:--
base64|`string`|yes|base64(image) data.

- @returns `{ type: string; data: string }`

### splitValue(input)

Split an attribute value into number and suffix unit.
Returns `[0, '']` if the string does not start with a `number` or `-number`.
```js
splitValue('100px') // [100, 'px']
splitValue(100) // [100, '']
splitValue('2.5rem') // [2.5, 'rem']
splitValue('-2.5rem') // [-2.5, 'rem']
splitValue('50%') // [50, '%']
splitValue('1,600円') // [1600, '円']
splitValue(',1,600円') // [0, '']
splitValue('0000,600円') // [0, ',600円']
```

Param|Types|Required|Description
:--|:--|:--:|:--
input|`string`/`number`|yes|-

- @returns `[number, string]`

### toCamelCase(input, isFirstCapitalLetter)

Format string as camel case
```js
toCamelCase('hello_world') // helloWorld
toCamelCase('hello-world') // helloWorld
toCamelCase('hello world') // helloWorld
toCamelCase('hello-world', true) // HelloWorld
```

Param|Types|Required|Description
:--|:--|:--:|:--
input|`string`|yes|-
isFirstCapitalLetter|`boolean`|no|whether to capitalize the first letter, default `false`

- @returns `string`

### toCssValue(value, unit)

```js
toCssValue('10 20') // 10px 20px
toCssValue('10') // 10px
toCssValue(' 25em 10px 0 8') // 25em 10px 0px 8px
```

Param|Types|Required|Description
:--|:--|:--:|:--
value|`any`|yes|css properties value
unit|`string`|yes|px, em...

- @returns `string`

### toDate(input)

Convert input to Date,
please click [date-utils-2020](https://github.com/capricorncd/date-utils-2020) for details

Param|Types|Required|Description
:--|:--|:--:|:--
input|`any`|yes|any type of object

- @returns `Date | null`

### toNumber(input, isStrictMode, defaultValue?: number)

Convert any type to number.
```js
toNumber('1.3rem') // 1.3
toNumber('1.3rem', true) // 0
toNumber('-12px') // -12
toNumber('-12px', true) // 0
toNumber('1,000,999Yan') // 1000999
toNumber('1,000,999', true) // 0
```

Param|Types|Required|Description
:--|:--|:--:|:--
input|`any`|yes|-
isStrictMode|`boolean`/`number`|no|Whether it is strict mode, default `false`
defaultValue|`number`|no|The return value when formatting fails, default is 0

- @returns `number`

### toSnakeCase(input, connectSymbol)

Format string as snake case
```js
toSnakeCase('helloWorld') // hello-world
toSnakeCase('HelloWorld') // hello-world
toSnakeCase('helloWorld', '_') // hello_world
toSnakeCase('helloWorld', ' ') // hello world
```

Param|Types|Required|Description
:--|:--|:--:|:--
input|`string`|yes|any string
connectSymbol|`string`|no|word connect symbol, default `-`

- @returns `string`

### toStrStyles(...styles)

Convert styles object to string.
When the properties are the same, the previous object properties will be overwritten
```js
toStrStyles({'line-height': 1.5, width: '50%'})
// `line-height:1.5;width:'50%'`
toStrStyles({lineHeight: 1.5, width: '50%'})
// `line-height:1.5;width:50%`
toStrStyles({ lineHeight: 1.5, width: '50%' }, { 'line-height': '24px' })
// line-height:24px;width:50%
```

Param|Types|Required|Description
:--|:--|:--:|:--
styles|`object[]`/`CSSStyleDeclaration[]`|yes|-

- @returns `string`

## Types

### FormatDateLangPackage

The function `formatDate(date, format, langPackage)` args langPackage's interface. [ILangPackage](#ILangPackage)

<details>
<summary>Source Code</summary>

```ts
type FormatDateLangPackage = ILangPackage
```

</details>

### GetStyleValueReturnType<T, N>

type of getStyleValue return

<details>
<summary>Source Code</summary>

```ts
type GetStyleValueReturnType<T, N> = T extends undefined
  ? CSSStyleDeclaration
  : N extends true
  ? number
  : string
```

</details>

### ScrollDirection

type of scroll direction, x-axis/y-axis

<details>
<summary>Source Code</summary>

```ts
type ScrollDirection = 'x' | 'y'
```

</details>

<!--METHOD_END-->

### ILangPackage

The function `formatDate(date, format, langPackage)` args langPackage's interface.

<details>
<summary>Source Code</summary>

```ts
interface ILangPackage {
  // Starting on sunday. For example ['周日', '周一', ..., '周六']
  weeks: string[],
  [key: string]: any
}
```

</details>

## License

[MIT](./LICENSE) License © 2022-Present [Capricorncd](https://github.com/capricorncd).
