import { describe, test, expect } from 'vitest'
import { outputFile } from '../src'

describe('outputFile', () => {
  const outputLines = [
    '## Property',
    '',
    '### el',
    '',
    'Use `el` to get the HTML element of the current class',
    'property 3333',
    'last line text',
    '',
    '```ts',
    'x.el',
    '```',
    '',
  ]

  const inputItem = {
    codes: ['```ts', 'x.el', '```'],
    desc: [
      'Use `el` to get the HTML element of the current class',
      'property 3333',
      'last line text',
    ],
    fullName: 'el',
    name: 'el',
    params: [],
    path: 'file-path',
    private: false,
    returns: [],
    sort: 0,
    type: 'property',
  }

  test('property', () => {
    const { lines } = outputFile({
      'file-path': {
        property_el: inputItem,
      },
    })
    expect(lines).toStrictEqual(outputLines)

    const { lines: lines2 } = outputFile([inputItem])
    expect(lines2).toStrictEqual(outputLines)
  })
})
