/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:58:54 (GMT+0900)
 */
import { isObject, isNumber } from './check'

/**
 * @method createUrlForGetRequest(url, params)
 * @description Create full URL for GET request
 * @param url `string`
 * @param params `Record<string, unknown>`
 * @returns `string`
 * ```js
 * createUrlForGetRequest('api/user', { age: 18 })
 * // 'api/user?age=18'
 * createUrlForGetRequest('api/user?class=a', { age: 18 })
 * // 'api/user?class=a&age=18'
 * ```
 */
export function createUrlForGetRequest(
  url: string,
  params: Record<string, unknown> = {}
): string {
  const [prefixUrl, search] = url.split('?')
  const queryParams: string[] = []
  if (search) queryParams.push(search)
  for (const [key, val] of Object.entries(params)) {
    queryParams.push(`${key}=${isObject(val) ? JSON.stringify(val) : val}`)
  }
  return prefixUrl + (queryParams.length ? `?${queryParams.join('&')}` : '')
}

/**
 * @method toSnakeCase(input, connectSymbol)
 * Format string as snake case
 * ```js
 * toSnakeCase('helloWorld') // hello-world
 * toSnakeCase('HelloWorld') // hello-world
 * toSnakeCase('helloWorld', '_') // hello_world
 * toSnakeCase('helloWorld', ' ') // hello world
 * ```
 * @param input `string` any string
 * @param connectSymbol? `string` word connect symbol, default `-`
 * @returns `string`
 */
export function toSnakeCase(input = '', connectSymbol = '-'): string {
  return input.replace(
    /[A-Z]/g,
    (s, offset) => `${offset > 0 ? connectSymbol : ''}${s.toLowerCase()}`
  )
}

/**
 * @method toCamelCase(input, isFirstCapitalLetter)
 * Format string as camel case
 * ```js
 * toCamelCase('hello_world') // helloWorld
 * toCamelCase('hello-world') // helloWorld
 * toCamelCase('hello world') // helloWorld
 * toCamelCase('hello-world', true) // HelloWorld
 * ```
 * @param input `string`
 * @param isFirstCapitalLetter? `boolean` whether to capitalize the first letter, default `false`
 * @returns `string`
 */
export function toCamelCase(input = '', isFirstCapitalLetter = false): string {
  const result = input.replace(/[-_\s](\w)/g, (_, s) => s.toUpperCase())
  return isFirstCapitalLetter
    ? result.replace(/^\w/, (s) => s.toUpperCase())
    : result
}

function restoreUSLocalString(input: string): string {
  return input.replace(/^-?[1-9]\d{0,2}(,\d{3})+/, (match) =>
    match.replace(/,/g, '')
  )
}

/**
 * @method toNumber(input, isStrictMode, defaultValue?: number)
 * @description Convert any type to number.
 * ```js
 * toNumber('1.3rem') // 1.3
 * toNumber('1.3rem', true) // 0
 * toNumber('-12px') // -12
 * toNumber('-12px', true) // 0
 * toNumber('1,000,999Yan') // 1000999
 * toNumber('1,000,999', true) // 0
 * ```
 * @param input `any`
 * @param isStrictMode? `boolean | number` Whether it is strict mode, default `false`
 * @param defaultValue? `number` The return value when formatting fails, default is 0
 * @returns `number`
 */
export function toNumber(
  input: unknown,
  isStrictMode: boolean | number = false,
  defaultValue?: number
): number {
  if (typeof isStrictMode === 'number') {
    defaultValue = isStrictMode
    isStrictMode = false
  }
  if (typeof defaultValue !== 'number') {
    defaultValue = 0
  }
  if (isNumber(input)) return input
  if (typeof input === 'string') {
    if (
      !isStrictMode &&
      /^(-?\d+(?:\.\d+)?)\D*/.test(restoreUSLocalString(input))
    ) {
      return toNumber(RegExp.$1, true)
    }
    const n = Number(input)
    return isNaN(n) ? defaultValue : n
  }
  return defaultValue
}

/**
 * @method splitValue(input)
 * Split an attribute value into number and suffix unit.
 * Returns `[0, '']` if the string does not start with a `number` or `-number`.
 * ```js
 * splitValue('100px') // [100, 'px']
 * splitValue(100) // [100, '']
 * splitValue('2.5rem') // [2.5, 'rem']
 * splitValue('-2.5rem') // [-2.5, 'rem']
 * splitValue('50%') // [50, '%']
 * splitValue('1,600円') // [1600, '円']
 * splitValue(',1,600円') // [0, '']
 * splitValue('0000,600円') // [0, ',600円']
 * ```
 * @param input `string | number`
 * @returns `[number, string]`
 */
export function splitValue(input: string | number): [number, string] {
  if (typeof input === 'number') {
    return [input, '']
  }
  const result = restoreUSLocalString(input).match(/^(-?\d+(?:\.\d+)?)(.*)$/)
  return result ? [toNumber(result[1], true), result[2]] : [0, '']
}

/**
 * to string that className
 * @param input `any`
 * @returns `string`
 */
function toString(input: unknown): string {
  if (isNumber(input)) return input.toString()
  if (typeof input === 'string') return input.trim().replace(/\s{2,}/g, ' ')
  if (Array.isArray(input)) return input.map(toString).filter(Boolean).join(' ')
  if (input && typeof input === 'object') {
    // { bool1: true, bool2: false, spaceString: ' ', zero: 0, number: 10 } => 'bool1 number'
    return Object.keys(input)
      .filter((key) => {
        const val = input[key as keyof typeof input]
        // @ts-ignore
        return typeof val === 'string' ? !!val.trim() : !!val
      })
      .join(' ')
  }
  return ''
}

/**
 * @method classNames(...args)
 * Merge css class names.
 * NOTE: Duplicate names will not be removed.
 * @param args `string | any[] | { bool: true, number: 1, str: 'x', obj: {}, arr: [], other: ? }`
 * @returns `string`
 * ```js
 * classNames({ active: true, zero: 0 }, ['text-center'], 'flex', 0)
 * // 'active text-center flex 0'
 * ```
 */
export function classNames(...args: unknown[]): string {
  return args.map(toString).filter(Boolean).join(' ')
}

/**
 * @method joinUrl(...args)
 * format url,
 * ```js
 * joinUrl('https://a.com/', '/news', 'detail/100001/?x=9')
 * // https://a.com/news/detail/100001?x=9
 * ```
 * @param args `string[]`
 * @returns `string`
 */
export function joinUrl(...args: string[]): string {
  return (
    args
      .join('/')
      .replace(/(\w(?!:))(\/+)/g, '$1/')
      // http://a.com/?x=1 => http://a.com?x=1
      .replace(/\/([?#])|\/$/g, '$1')
  )
}

/**
 * @method slice(arrayLike, offset)
 * Convert pseudo-array to array
 * @param arrayLike `pseudo-array`
 * @param offset? `number` default `0`
 * @returns `array T[]`
 * ```js
 * slice({ length: 2, 0: 100, 1: 100 }) // [100, 100]
 * ```
 */
export function slice<T, P>(arrayLike: P, offset = 0): T[] {
  return Array.prototype.slice.call(arrayLike, offset)
}

/**
 * @method formatKeys(obj, isCamelCase)
 * Format the key of the object, using the `toSnakeCase` or `toCamelCase` method.
 * @param obj `object`
 * @param isCamelCase? `boolean` Whether the key of the object uses camel-case or snake-case, default `false`
 * @returns `object`
 * ```js
 * formatObjKeys({lineHeight: 1.5}) // {'line-height': 1.5}
 * formatObjKeys({lineHeight: 1.5, childObj: {maxWidth: 100}})
 * // {'line-height': 1.5, 'child-obj': {'max-width': 100}}
 * formatObjKeys({'line-height': 1.5}, true) // {lineHeight: 1.5}
 * formatObjKeys({'line-height': 1.5, 'child-obj': {'max-width': 100}}, true)
 * // {lineHeight: 1.5, childObj: {maxWidth: 100}}
 * ```
 */
export function formatKeys(
  obj: Record<string, unknown> = {},
  isCamelCase = false
): Record<string, unknown> {
  const formatter = isCamelCase ? toCamelCase : toSnakeCase
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[formatter(key)] = isObject(value)
      ? formatKeys(value as Record<string, unknown>, isCamelCase)
      : value
  }
  return result
}

/**
 * @method formatBytes(bytes, useDecimal, decimalPlaces)
 * Digital Information Sizes Calculator
 * @param bytes `number` bytes
 * @param useDecimal? `boolean` whether to use decimal for calculations. default `false`
 * @param decimalPlaces? `number` How many decimal places to keep. default `2`
 * @returns `object` `{unit: string, text: string, value: number, bytes: number}`
 */
export function formatBytes(
  bytes: number,
  useDecimal = false,
  decimalPlaces = 2
) {
  const aMultiples = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  const denominator = useDecimal ? 1000 : 1024
  let value = String(bytes)
  let unit = 'Byte'
  for (
    let nMultiple = 0, nApprox = bytes / denominator;
    nApprox > 1;
    nApprox /= denominator, nMultiple++
  ) {
    value = nApprox.toFixed(decimalPlaces)
    unit = aMultiples[nMultiple]
  }
  if (useDecimal) unit = unit.replace('i', '')
  return {
    text: value.replace(/\.0+$/, '') + unit,
    value: +value,
    unit,
    bytes,
  }
}
