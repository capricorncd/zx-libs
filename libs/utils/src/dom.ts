/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 10:44:51 (GMT+0900)
 */
import { isObject, isElement } from './check'
import { slice, formatKeys, toNumber, toCamelCase, toSnakeCase } from './format'
import type { GetStyleValueReturnType, ScrollDirection } from './types.d'

/**
 * @method $(selector, doc)
 * Get the DOM element that matches selector
 * @param selector `string | HTMLElement`
 * @param doc? `Document | HTMLElement` default `document`
 * @returns `HTMLElement | null`
 */
export function $<T extends HTMLElement>(
  selector: string | T,
  doc: Document | HTMLElement = document
): T | null {
  if (!selector) return null
  if (selector instanceof HTMLElement) return selector
  return doc.querySelector(selector)
}

/**
 * @method $$(selector, doc)
 * Get the DOM elements that matches selector
 * @param selector `string`
 * @param doc? `Document | HTMLElement` default `document`
 * @returns `HTMLElement[]`
 */
export function $$<T extends HTMLElement>(
  selector: string,
  doc: Document | HTMLElement = document
): T[] {
  return slice(doc.querySelectorAll(selector))
}

/**
 * @method createElement(tag, attrs, children)
 * create an element
 * @param tag `string`
 * @param attrs? `Record<string, any>` HTMLElement's attributes.
 * @param children? `string | HTMLElement | Node | string[] | HTMLElement[] | Node[]`
 * @returns `HTMLElement`
 */
export function createElement<T extends HTMLElement>(
  tag: string,
  attrs: Record<string, unknown> = {},
  children?: string | HTMLElement | Node | (string | HTMLElement | Node)[]
): T {
  const el = document.createElement(tag) as T
  for (const [key, val] of Object.entries(attrs)) {
    el.setAttribute(
      toSnakeCase(key),
      key === 'style' && isObject(val)
        ? toStrStyles(val as Record<string, unknown>)
        : String(val)
    )
  }
  if (children) {
    if (!Array.isArray(children)) {
      children = [children]
    }
    children.forEach((child) => {
      if (typeof child === 'string') {
        const temp = createElement('div')
        temp.innerHTML = child
        el.append(...temp.childNodes)
      } else {
        el.append(child)
      }
    })
  }
  return el
}

/**
 * @method toStrStyles(...styles)
 * Convert styles object to string.
 * When the properties are the same, the previous object properties will be overwritten
 * @param styles `object[] | CSSStyleDeclaration[]`
 * @returns `string`
 * ```js
 * toStrStyles({'line-height': 1.5, width: '50%'})
 * // `line-height:1.5;width:'50%'`
 * toStrStyles({lineHeight: 1.5, width: '50%'})
 * // `line-height:1.5;width:50%`
 * toStrStyles({ lineHeight: 1.5, width: '50%' }, { 'line-height': '24px' })
 * // line-height:24px;width:50%
 * ```
 */
export function toStrStyles(...args: Record<string, unknown>[]): string {
  const styles: Record<string, unknown> = args.reduce((prev, obj) => {
    return { ...prev, ...formatKeys(obj) }
  }, {})
  const arr: string[] = []
  for (const [key, value] of Object.entries(styles)) {
    if (value === '' || typeof value === 'undefined' || value === null) continue
    arr.push(`${key}:${value}`)
  }
  return arr.join(';')
}

/**
 * @method getMaxZIndex(defaultZIndex)
 * Get the max zIndex value in the document
 * @param defaultZIndex? `number` Return value when none of the DOM elements have `zIndex` set, default `100`
 * @returns `number`
 */
export function getMaxZIndex(defaultZIndex = 100): number {
  const elements = document.getElementsByTagName('*')
  let el: Element, css: CSSStyleDeclaration, zIndex: number
  const arr: number[] = []
  for (let i = 0; i < elements.length; i++) {
    el = elements[i]
    if (el.nodeType !== 1) continue
    css = window.getComputedStyle(el, null)
    if (css.position !== 'static') {
      zIndex = +css.zIndex
      if (zIndex > 0) arr.push(zIndex)
    }
  }
  return arr.length ? Math.max.apply(null, arr) : defaultZIndex
}

/**
 * @method getStyleValue(el, attr, needNumber)
 * Get the value of `CSSStyleDeclaration` or `CSSStyleDeclaration[attr]`
 * @param el `Node`
 * @param attr? `string` Arbitrary property key for CSSStyleDeclaration
 * @param needNumber? `boolean` whether to cast the returned property value to a numeric type
 * @returns `string | number | CSSStyleDeclaration | CSSRule | ((index: number) => string) | ((property: string, value: string/null, priority?: string) => void) | null`
 */
export function getStyleValue<
  T extends string | undefined,
  N extends boolean | undefined,
>(el: Node, attr?: T, needNumber?: N): GetStyleValueReturnType<T, N> | null {
  if (!isElement(el)) return null
  const css: CSSStyleDeclaration = window.getComputedStyle(
    el as HTMLElement,
    null
  )
  if (attr) {
    try {
      const value = css[
        toCamelCase(attr) as keyof CSSStyleDeclaration
      ] as string
      return (needNumber ? toNumber(value) : value) as GetStyleValueReturnType<
        T,
        N
      >
    } catch (e) {
      return null
    }
  }
  return css as GetStyleValueReturnType<T, N>
}

const CSS_OVERFLOW_ATTRS = ['overflow', 'overflowX', 'overflowY']
const CSS_SCROLLABLE_VALUES = ['auto', 'scroll']

/**
 * @method getScrollableParents(el, scrollDirection)
 * Get scrollable parent elements
 * @param el `HTMLElement`
 * @param scrollDirection? `ScrollDirection` optional values `x,y`
 * @returns `HTMLElement[]`
 */
export function getScrollParents(
  el: HTMLElement,
  scrollDirection?: ScrollDirection
): HTMLElement[] {
  const overflowAttrs = !scrollDirection
    ? CSS_OVERFLOW_ATTRS
    : CSS_OVERFLOW_ATTRS.filter((key) =>
        new RegExp(`(${scrollDirection}|w)$`, 'i').test(key)
      )

  const arr: HTMLElement[] = []
  let parent: HTMLElement | null = el.parentElement
  let css: CSSStyleDeclaration
  while (parent) {
    css =
      getStyleValue<undefined, undefined>(parent) || ({} as CSSStyleDeclaration)
    overflowAttrs.forEach((key) => {
      const value = css[key as keyof CSSStyleDeclaration]
      if (typeof value === 'string' && CSS_SCROLLABLE_VALUES.includes(value)) {
        arr.push(parent as HTMLElement)
      }
    })
    parent = parent.parentElement
  }
  return arr
}
