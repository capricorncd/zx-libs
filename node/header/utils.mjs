/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 */
import { toCamelCase } from '@zx-libs/utils'

export function parseArgs(args) {
  let arr
  return args.reduce((obj, arg) => {
    // --dir=dist,src
    arr = arg.match(/--([\w-]+)=(.+)/)
    if (arr) {
      obj[toCamelCase(arr[1])] = arr[2]
    }
    return obj
  }, {})
}
