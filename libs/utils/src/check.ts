/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:58:54 (GMT+0900)
 */

/**
 * @method isArray(input)
 * @description determines whether the passed value is an Array
 * @param input `any` any type of object
 * @returns `boolean`
 */
export function isArray<T>(input: unknown): input is Array<T> {
  return Array.isArray(input)
}

/**
 * @method isObject(input)
 * @description determines whether the passed value is an object
 * @param input `any` any type of object
 * @returns `boolean`
 */
export function isObject(input: unknown): input is object {
  return typeof input === 'object' && input !== null && !isArray(input)
}

/**
 * @method isElement(el)
 * determines whether the el is an Element
 * @param el `Node` DOM Node
 * @returns `boolean`
 */
export function isElement<T extends Node>(el: T): boolean {
  return el && el.nodeType === 1
}

/**
 * @method isNumberLike(input)
 * Determine if `input` is a string number
 * @param input `any` any type of object
 * @returns `boolean`
 */
export function isNumberLike(input: unknown): boolean {
  if (typeof input === 'string') return /^-?\d+(\.\d+)?$/.test(input)
  return isNumber(input)
}

/**
 * @method isNumber(input)
 * Determine whether it is a valid number.
 *
 * ```js
 * isNumber(10) // true
 * isNumber(-10.02) // true
 *
 * isNumber(NaN) // false
 * isNumber(null) // false
 * isNumber(undefined) // false
 * ```
 * @param input `any` any type of object.
 * @returns `boolean`
 */
export function isNumber(input: unknown): input is number {
  return Number.isFinite(input)
}

/**
 * null or undefined
 * @param input `any` any type of object.
 * @returns `boolean`
 */
export function isNullOrUndefined(input?: unknown): input is null {
  return typeof input === 'undefined' || input === null
}
