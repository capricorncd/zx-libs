/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 10:02:14 (GMT+0900)
 */
import type { ILangPackage } from 'date-utils-2020'

/**
 * @type FormatDateLangPackage
 *
 * The function `formatDate(date, format, langPackage)` args langPackage's interface. [ILangPackage](#ILangPackage)
 */
export type FormatDateLangPackage = ILangPackage

/**
 * @type GetStyleValueReturnType<T, N>
 * type of getStyleValue return
 */
export type GetStyleValueReturnType<T, N> = T extends undefined
  ? CSSStyleDeclaration
  : N extends true
    ? number
    : string

/**
 * @type ScrollDirection
 * type of scroll direction, x-axis/y-axis
 */
export type ScrollDirection = 'x' | 'y'
