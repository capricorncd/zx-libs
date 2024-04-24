/**!
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:58:54 (GMT+0900)
 */
import { isNumberLike } from './check'

const REG_TARGET_CSS_VALUE = /^((-?\d+(\.\d+)?)?([a-z]+|%)?\s*)+$/i
const REG_NUMBER_AND_SPACE = /(\d+\s|\s\d+$)/

/**
 * @method toCssValue(value, unit)
 * ```js
 * toCssValue('10 20') // 10px 20px
 * toCssValue('10') // 10px
 * toCssValue(' 25em 10px 0 8') // 25em 10px 0px 8px
 * ```
 * @param value `any` css properties value
 * @param unit `string` px, em...
 * @returns `string`
 */
export function toCssValue(value: unknown, unit = 'px'): string {
  if (isNumberLike(value)) return `${value}${unit}`
  if (value && typeof value === 'string') {
    // Remove extra spaces, ` 8   8  ` => `8 8`
    const str = value.trim().replace(/\s{2,}/g, ' ')
    return REG_TARGET_CSS_VALUE.test(str) && REG_NUMBER_AND_SPACE.test(str)
      ? str
          .trim()
          .split(' ')
          .map((s) => toCssValue(s, unit))
          .join(' ')
      : str
  }
  return ''
}
