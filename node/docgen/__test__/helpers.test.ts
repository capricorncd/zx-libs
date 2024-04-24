import { test, describe, expect } from 'vitest'
import { handleProps, handleParam, getExtendsTypes } from '../src/helpers'

describe('helpers', () => {
  test.skip('handleProps', () => {
    expect(
      handleProps(
        {
          name: '',
          fullName: '',
          type: '',
          desc: [],
          params: [],
          returns: [],
          private: false,
          path: '',
          sort: 0,
          generics: [],
          codes: [
            'export interface ITest<T extends Parent>{',
            '// userId',
            `'data-user-id': string`,
            `'data-user-id2'?: string // userId2`,
            'disabled?: boolean',
            'parent: T // see Parent',
            '}',
          ],
        },
        [
          {
            name: 'Parent',
            fullName: 'Parent',
            type: 'interface',
            desc: [],
            params: [],
            returns: [],
            private: false,
            path: '',
            sort: 0,
            generics: [],
            codes: [
              'export interface Parent {',
              '// parentId',
              `'pid': string`,
              '}',
            ],
          },
        ]
      )
    ).toStrictEqual([
      {
        desc: ['userId'],
        name: 'data-user-id',
        raw: "'data-user-id': string",
        required: true,
        types: ['string'],
      },
      {
        desc: ['userId2'],
        name: 'data-user-id2',
        raw: "'data-user-id2'?: string // userId2",
        required: false,
        types: ['string'],
      },
      {
        desc: [],
        name: 'disabled',
        raw: 'disabled?: boolean',
        required: false,
        types: ['boolean'],
      },
      {
        desc: ['see Parent'],
        name: 'parent',
        raw: 'parent: T // see Parent',
        required: true,
        types: ['T'],
      },
    ])
  })

  test('handleParam', () => {
    expect(handleParam('paramName? `type` param description')).toStrictEqual({
      raw: 'paramName? `type` param description',
      name: 'paramName',
      required: false,
      types: ['type'],
      desc: ['param description'],
    })

    expect(
      handleParam('paramName `type1 | type2` param description2')
    ).toStrictEqual({
      raw: 'paramName `type1 | type2` param description2',
      name: 'paramName',
      required: true,
      types: ['type1', 'type2'],
      desc: ['param description2'],
    })
  })

  test('getExtendsTypes', () => {
    expect(
      getExtendsTypes(`export interface T extends A, B<P extends O> {`)
    ).toStrictEqual(['A', 'B'])

    expect(
      getExtendsTypes(`export interface BaseProps<T extends Obj> {`)
    ).toBeNull()

    expect(
      getExtendsTypes(`export type PropMappings<T extends BaseProps> = {`)
    ).toBeNull()
  })
})
