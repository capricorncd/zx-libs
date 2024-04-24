/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import { toCssValue } from './css'

describe('css', () => {
  it('toCssValue', () => {
    expect(toCssValue(25)).toBe('25px')
    expect(toCssValue('25')).toBe('25px')
    expect(toCssValue(25, 'em')).toBe('25em')
    expect(toCssValue(25, '%')).toBe('25%')
    expect(toCssValue('25')).toBe('25px')
    expect(toCssValue('10 20')).toBe('10px 20px')
    expect(toCssValue('1 auto 2', 'fr')).toBe('1fr auto 2fr')
    expect(toCssValue('10 -20')).toBe('10px -20px')
    expect(toCssValue('10.5 -20 0.8 -1')).toBe('10.5px -20px 0.8px -1px')
    expect(toCssValue(' 25 10 0 8')).toBe('25px 10px 0px 8px')
    expect(toCssValue(' 25 10    0 8')).toBe('25px 10px 0px 8px')
    expect(toCssValue(' 25px 10px 0 8')).toBe('25px 10px 0px 8px')
    expect(toCssValue('25em  10px 0 8', 'rem')).toBe('25em 10px 0rem 8rem')
    expect(toCssValue('25 10 0 8px')).toBe('25px 10px 0px 8px')
    expect(toCssValue('25 10% 0 8px')).toBe('25px 10% 0px 8px')
    expect(toCssValue('25px   10px 0px 8px')).toBe('25px 10px 0px 8px')
    expect(toCssValue('0 10 8px ')).toBe('0px 10px 8px')
    expect(toCssValue('0 10 8PX ')).toBe('0px 10px 8PX')
    expect(toCssValue('     0 8  ')).toBe('0px 8px')
    expect(toCssValue('rgb(100, 100, 100)')).toBe('rgb(100, 100, 100)')
    expect(toCssValue('rgb(100 100 100)')).toBe('rgb(100 100 100)')
    expect(toCssValue('#339022')).toBe('#339022')
    expect(toCssValue('test2')).toBe('test2')
    expect(toCssValue('test 2')).toBe('test 2px')
    expect(toCssValue('center')).toBe('center')
    expect(toCssValue('100%')).toBe('100%')
    expect(toCssValue('100%100')).toBe('100%100')

    expect(toCssValue('     ')).toBe('')
    expect(toCssValue('')).toBe('')
    expect(toCssValue(' x ')).toBe('x')
    expect(toCssValue('a x ')).toBe('a x')
    expect(toCssValue(undefined)).toBe('')
    expect(toCssValue(null)).toBe('')
    expect(toCssValue([])).toBe('')
    expect(toCssValue({})).toBe('')
    expect(toCssValue(() => 1)).toBe('')
    expect(toCssValue(new Map())).toBe('')
  })
})
