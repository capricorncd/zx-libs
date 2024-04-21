/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 11:40:27 (GMT+0900)
 */
import { JSDOM } from 'jsdom'
import { describe, it, expect, vi } from 'vitest'
import {
  createElement,
  $,
  $$,
  toStrStyles,
  getMaxZIndex,
  getStyleValue,
  getScrollParents,
} from './dom'

describe('dom', () => {
  it('$', () => {
    const el = createElement(
      'div',
      { id: 'test', dataName: 20 },
      '<p>1</p><span>2</span>'
    )
    expect($('p', el)?.textContent).toBe('1')
    expect($('span', el)?.textContent).toBe('2')
    expect(el.getAttribute('data-name')).toBe('20')
    expect(el.getAttribute('dataName')).toBeNull()
  })

  it('$$', () => {
    const el = createElement('div', {}, '<p>1</p><span>2</span><p>3</p>')
    expect($$('p', el).length).toBe(2)
    expect($$('div', el).length).toBe(0)
    expect($$('span', el).length).toBe(1)
  })

  it('createElement', () => {
    const el1 = createElement('div', {}, '<p>1</p><span>2</span><p>3</p>')
    const el2 = createElement('div', {}, [
      '<p>1</p>',
      createElement('span', {}, '2'),
      createElement('p', undefined, ['3']),
    ])
    expect(el1.isEqualNode(el2)).toBeTruthy()
  })

  it('toStrStyles', () => {
    expect(toStrStyles({ 'line-height': 1.5, width: '50%' })).toBe(
      `line-height:1.5;width:50%`
    )
    expect(toStrStyles({ lineHeight: 1.5, width: '50%' })).toBe(
      `line-height:1.5;width:50%`
    )
    expect(
      toStrStyles({ lineHeight: 1.5, width: '50%' }, { 'line-height': '24px' })
    ).toBe(`line-height:24px;width:50%`)
  })

  it('getMaxZIndex', () => {
    const { window } = new JSDOM(
      '<!doctype html><html><body><div style="position: absolute;z-index: 3"><p style="position: absolute;z-index: 10">1</p><span>2</span></div></body></html>'
    )
    vi.stubGlobal('document', window.document)
    expect(getMaxZIndex()).toBe(10)
  })

  it('getStyleValue', () => {
    const { window } = new JSDOM(
      '<!doctype html><html><body><div style="position: absolute;z-index: 3;height:200px;"><p style="position: absolute;z-index: 10">1</p><span>2</span></div></body></html>'
    )
    vi.stubGlobal('document', window.document)
    const el = $('div')
    expect(getStyleValue(el!, 'z-index')).toBe('3')
    expect(getStyleValue(el!, 'zIndex')).toBe('3')
    expect(getStyleValue(el!, 'z-index', true)).toBe(3)
    expect(getStyleValue(el!, 'height')).toBe('200px')
    expect(getStyleValue($('p')!, 'z-index', true)).toBe(10)
  })

  it('getScrollParents', () => {
    const { window } = new JSDOM(
      [
        '<!doctype html>',
        '<html><body>',
        '<section id="s1" style="width: 100px;height: 50px;overflow: auto">',
        '  <section id="s2" style="width: 100px;height: 50px;overflow-x: auto">',
        '    <section id="s3" style="width: 100px;height: 50px;overflow-y: auto">',
        '      <section id="s4" style="width: 100px;height: 50px;overflow: scroll">',
        '        <section id="s5" style="width: 100px;height: 50px;overflow-x: scroll">',
        '          <section id="s6" style="width: 100px;height: 50px;overflow-y: scroll">',
        '            <p id="p1" style="height: 5000px">text</p>',
        '          </section>',
        '        </section>',
        '      </section>',
        '    </section>',
        '  </section>',
        '</section>',
        '<section style="width: 100px;height: 50px;overflow-y: scroll">',
        '  <p id="p2" style="height: 500px">text</p>',
        '</section>',
        '</body></html>',
      ].join('')
    )
    vi.stubGlobal('document', window.document)

    const s1 = $('#s1')
    const s2 = $('#s2')
    const s3 = $('#s3')
    const s4 = $('#s4')
    const s5 = $('#s5')
    const s6 = $('#s6')
    const p1 = $('#p1')
    const p2 = $('#p2')
    expect(getScrollParents(s1!).length).toBe(0)
    expect(getScrollParents(s2!).length).toBe(1)
    expect(getScrollParents(s3!).length).toBe(2)
    expect(getScrollParents(s4!).length).toBe(3)
    expect(getScrollParents(s5!).length).toBe(4)
    expect(getScrollParents(s6!).length).toBe(5)
    expect(getScrollParents(p1!).length).toBe(6)
    expect(getScrollParents(p2!).length).toBe(1)

    expect(getScrollParents(s1!, 'x').length).toBe(0)
    expect(getScrollParents(s2!, 'x').length).toBe(1)
    expect(getScrollParents(s3!, 'x').length).toBe(2)
    expect(getScrollParents(s4!, 'x').length).toBe(2)
    expect(getScrollParents(s5!, 'x').length).toBe(3)
    expect(getScrollParents(s6!, 'x').length).toBe(4)
    expect(getScrollParents(p1!, 'x').length).toBe(4)
    expect(getScrollParents(p2!, 'x').length).toBe(0)

    expect(getScrollParents(s1!, 'y').length).toBe(0)
    expect(getScrollParents(s2!, 'y').length).toBe(1)
    expect(getScrollParents(s3!, 'y').length).toBe(1)
    expect(getScrollParents(s4!, 'y').length).toBe(2)
    expect(getScrollParents(s5!, 'y').length).toBe(3)
    expect(getScrollParents(s6!, 'y').length).toBe(3)
    expect(getScrollParents(p1!, 'y').length).toBe(4)
    expect(getScrollParents(p2!, 'y').length).toBe(1)
  })
})
