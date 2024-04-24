import path from 'node:path'
import { describe, test, expect } from 'vitest'
import { handleFile } from '../src/docs-input'

const filePath = path.resolve(__dirname, '../__test__/docs-input.comment')

const RESULT = {
  document_X: {
    type: 'document',
    sort: 0,
    name: 'X',
    fullName: 'X',
    desc: [
      '',
      'XXXX',
      '',
      'description 1111',
      '',
      'Usage',
      '',
      '```bash',
      '  const x = new X();',
      '```',
      'description 2222',
    ],
    params: [],
    returns: [],
    generics: [],
    codes: [],
    private: false,
    path: filePath,
  },
  property_el: {
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
    path: filePath,
    private: false,
    returns: [],
    generics: [],
    sort: 0,
    type: 'property',
  },
  method_fun: {
    codes: [],
    desc: ['generic method'],
    fullName: 'fun(props)',
    generics: ['T extends Object'],
    name: 'fun',
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
    path: filePath,
    type: 'method',
  },
  method_fun2: {
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
    path: filePath,
    type: 'method',
  },
}

describe('docs-input', () => {
  test('handleFile', () => {
    expect(handleFile(filePath, {})).toMatchObject(RESULT)

    expect(
      handleFile(filePath, {}, { isExtractCodeFromComments: true })
    ).toStrictEqual({
      document_X: {
        ...RESULT.document_X,
        codes: ['', 'Usage', '', '```bash', '  const x = new X();', '```'],
        desc: ['', 'XXXX', '', 'description 1111', '', 'description 2222'],
      },
      property_el: {
        ...RESULT.property_el,
        codes: ['```ts', 'x.el', '```'],
        desc: [
          'Use `el` to get the HTML element of the current class',
          'property 3333',
          'last line text',
        ],
      },
      method_fun: {
        ...RESULT.method_fun,
        codes: [],
      },
      method_fun2: {
        ...RESULT.method_fun2,
        codes: [],
      },
    })
  })
})
