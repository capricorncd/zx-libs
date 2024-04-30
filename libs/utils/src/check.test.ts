/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import {
  isArray,
  isObject,
  isNumberLike,
  isNumber,
  isNullOrUndefined,
} from './check'

describe('check', () => {
  it('isArray', () => {
    expect(isArray('')).toBeFalsy()
    expect(isArray(isObject)).toBeFalsy()
    expect(isArray(null)).toBeFalsy()
    expect(isArray(new Map())).toBeFalsy()
    expect(isArray(new Set())).toBeFalsy()
    expect(isArray({ length: 0 })).toBeFalsy()

    expect(isArray([])).toBeTruthy()
    expect(isArray([1, 2])).toBeTruthy()
    expect(isArray(['str', 2])).toBeTruthy()
  })

  it('isObject', () => {
    expect(isObject([])).toBeFalsy()
    expect(isObject(isArray)).toBeFalsy()
    expect(isObject(null)).toBeFalsy()
    expect(isObject(undefined)).toBeFalsy()
    expect(isObject('undefined')).toBeFalsy()
    expect(isObject(Symbol('undefined'))).toBeFalsy()

    expect(isObject({})).toBeTruthy()
    expect(isObject(new Map())).toBeTruthy()
    expect(isObject(new Set())).toBeTruthy()
    expect(isObject(new Date())).toBeTruthy()
  })

  it('isNumberLike', () => {
    expect(isNumberLike('-123.000')).toBeTruthy()
    expect(isNumberLike('12.01')).toBeTruthy()
    expect(isNumberLike('12px')).toBeFalsy()
    expect(isNumberLike(NaN)).toBeFalsy()
  })

  it('isNumber', () => {
    expect(isNumber(12.01)).toBeTruthy()
    expect(isNumber(0)).toBeTruthy()
    expect(isNumber(-12.01)).toBeTruthy()

    expect(isNumber('-123.000')).toBeFalsy()
    expect(isNumber('12px')).toBeFalsy()
    expect(isNumber(NaN)).toBeFalsy()
    expect(isNumber(void 0)).toBeFalsy()
    expect(isNumber(null)).toBeFalsy()

    expect(isNumber(Number.NEGATIVE_INFINITY)).toBeFalsy()
  })

  it('isNullOrUndefined', () => {
    expect(isNullOrUndefined(void 0)).toBeTruthy()
    expect(isNullOrUndefined(null)).toBeTruthy()

    expect(isNullOrUndefined(!void 0)).toBeFalsy()
    expect(isNullOrUndefined(!null)).toBeFalsy()
    expect(isNullOrUndefined(2)).toBeFalsy()
    expect(isNullOrUndefined('')).toBeFalsy()
  })
})
