/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { describe, it, expect, vi } from 'vitest'
import { fileToBase64, createBlobURL, splitBase64 } from './file'

describe('file', () => {
  it('fileToBase64', async () => {
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    })
    expect(await fileToBase64(file)).toBe('data:text/plain;base64,Zm9v')
  })

  it('createBlobURL', () => {
    // fix: windowURL.createObjectURL is not a function
    global.URL.createObjectURL = vi.fn((b: Blob) => `blob:${b.size}`)

    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    })
    expect(createBlobURL(file)).toMatch(/^blob:/)

    const bytes = new Uint8Array(59)
    for (let i = 0; i < 59; i++) {
      bytes[i] = 32 + i
    }
    const blob2 = new Blob([bytes.buffer], { type: 'text/plain' })
    expect(createBlobURL(blob2)).toMatch(/^blob:/)
  })

  it('splitBase64', () => {
    const base64 =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAkGB+wgHBgkIBwgKCgkLDRYPDQw//9k='
    expect(splitBase64(base64)).toStrictEqual({
      type: 'image/jpeg',
      data: '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAkGB+wgHBgkIBwgKCgkLDRYPDQw//9k=',
    })
  })
})
