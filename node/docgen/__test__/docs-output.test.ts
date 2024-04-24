import { describe, test, expect } from 'vitest'
import { handlePropertyLines, handleMethodLines } from '../src/docs-output'

const DEF_LINE = {
  codes: [],
  desc: [
    'Use `el` to get the HTML element of the current class',
    'property 3333',
    '```ts',
    'x.el',
    '```',
    'last line text',
  ],
  fullName: 'el',
  name: 'el',
  params: [],
  path: 'filePath',
  private: false,
  returns: [{ raw: '`string` rrrrrrr', desc: ['rrrrrrr'], types: ['string'] }],
  sort: 0,
  type: 'property',
  generics: [],
}

describe('docs-output', () => {
  test('handlePropertyLines', () => {
    const inputItems = [DEF_LINE]

    const lines: string[] = []

    handlePropertyLines(inputItems, {}, lines)
    expect(lines).toStrictEqual([
      '## Property',
      '',
      '### el',
      '',
      'Use `el` to get the HTML element of the current class',
      'property 3333',
      '```ts',
      'x.el',
      '```',
      'last line text',
      '',
      '- @returns `string` rrrrrrr',
      '',
    ])

    const lines2: string[] = []

    handlePropertyLines(
      [
        {
          codes: ['```ts', 'x.el', '```'],
          desc: [
            'Use `el` to get the HTML element of the current class',
            'property 3333',
            'last line text',
          ],
          fullName: 'el',
          name: 'el',
          params: [],
          path: 'filePath',
          private: false,
          returns: [
            { raw: '`string` rrrrrrr', desc: ['rrrrrrr'], types: ['string'] },
          ],
          sort: 0,
          type: 'property',
          generics: [],
        },
      ],
      {},
      lines2
    )
    expect(lines2).toStrictEqual([
      '## Property',
      '',
      '### el',
      '',
      'Use `el` to get the HTML element of the current class',
      'property 3333',
      'last line text',
      '',
      '- @returns `string` rrrrrrr',
      '',
      '```ts',
      'x.el',
      '```',
      '',
    ])
  })

  test('handleMethodLines', () => {
    const lines: string[] = []
    handleMethodLines(
      [
        {
          codes: [],
          desc: ['generic method2'],
          fullName: 'fun2(props)',
          generics: ['T extends Object'],
          name: 'fun2',
          params: [
            {
              desc: ['properties'],
              name: 'props',
              raw: 'props `T` properties',
              required: true,
              types: ['T'],
            },
          ],
          returns: [],
          sort: 0,
          private: false,
          path: 'filePath',
          type: 'method',
        },
      ],
      {},
      lines
    )
    expect(lines).toStrictEqual([
      '## Methods',
      '',
      '### fun2(props)',
      '',
      'generic method2',
      '',
      'Param|Types|Required|Description',
      ':--|:--|:--|:--',
      'props|`T`|yes|properties',
      '',
      '',
      '- @generic `T extends Object`',
      '',
      '- @returns `void`',
      '',
    ])
  })
})
