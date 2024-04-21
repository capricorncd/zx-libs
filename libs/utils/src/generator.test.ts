/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import { randomStr, randomId } from './generator'

describe('generator', () => {
  it('randomStr', () => {
    expect(randomStr(1).length).toBe(1)
    expect(randomStr(2).length).toBe(2)
    expect(randomStr(20).length).toBe(20)
    expect(randomStr().length).toBeGreaterThan(0)
  })

  it('randomId', () => {
    expect(/^\w{5}-\w{5}-\w+$/.test(randomId())).toBeTruthy()
    expect(/^prefix-\w{5}-\w{5}-\w+$/.test(randomId('prefix'))).toBeTruthy()
    expect(
      /^prefix-\w{5}-\w{5}-\w+-suffix$/.test(randomId('prefix', 'suffix'))
    ).toBeTruthy()
  })
})
