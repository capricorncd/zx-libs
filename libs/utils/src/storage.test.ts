/**
 * Created by Xing Zhong.
 * https://github.com/capricorncd
 * Date: 2022/09/09 21:08:27 (GMT+0900)
 */
import { describe, it, expect } from 'vitest'
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearSessionStorage,
} from './storage'

const key1 = 'key1'
const key2 = 'key2'

describe('storage', () => {
  it('localStorage', () => {
    setLocalStorage(key1, [])
    expect(getLocalStorage(key1, [2])).toEqual([])

    expect(getLocalStorage(key2, 'hello')).toBe('hello')

    setLocalStorage(key1, [{ a: 1, b: 2 }])
    expect(getLocalStorage(key1, [])).toEqual([{ a: 1, b: 2 }])

    removeLocalStorage(key1)
    expect(getLocalStorage(key1, null)).toBeNull()

    setLocalStorage(key1, 1000)
    setLocalStorage(key2, '1000')

    expect(getLocalStorage(key1, 0)).toBe(1000)
    expect(getLocalStorage(key2, '')).toBe('1000')

    clearLocalStorage()
    expect(getLocalStorage(key1, void 0)).toBeUndefined()
    expect(getLocalStorage(key2, void 0)).toBeUndefined()
  })

  it('sessionStorage', () => {
    setSessionStorage(key1, [])
    expect(getSessionStorage(key1, [2])).toEqual([])

    expect(getSessionStorage(key2, 'hello')).toBe('hello')

    setSessionStorage(key1, { a: 1, b: [{ c: 1, d: 1 }] })
    expect(getSessionStorage(key1, null)).toEqual({ a: 1, b: [{ c: 1, d: 1 }] })

    removeSessionStorage(key1)
    expect(getSessionStorage(key1, null)).toBeNull()

    setSessionStorage(key1, 1000)
    setSessionStorage(key2, '1000')

    expect(getSessionStorage(key1, 0)).toBe(1000)
    expect(getSessionStorage(key2, '')).toBe('1000')

    clearSessionStorage()
    expect(getSessionStorage(key1, void 0)).toBeUndefined()
    expect(getSessionStorage(key2, void 0)).toBeUndefined()
  })
})
