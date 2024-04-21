/**
 * @method randomStr(length)
 * Generate a random string with a maximum length of 1000.
 * @param length? `number` The length of the random string, which has a maximum value of 1000.
 * @returns `string`
 */
export function randomStr(n?: number): string {
  const str = Math.random().toString(36).slice(2)
  return typeof n === 'number'
    ? n > str.length
      ? str.padEnd(Math.min(n, 1000), str)
      : str.substring(0, n)
    : str
}

/**
 * @method randomId(prefix, suffix)
 * Generate a random string id.
 * @param prefix? `string` A prefix of the id
 * @param suffix? `string` A suffix of the id
 * @returns `string` Like this `prefix-xxxxx-xxxxx-xxxxxxxxxx-suffix`
 */
export function randomId(prefix?: string, suffix?: string): string {
  return [prefix, randomStr(5), randomStr(5), randomStr(), suffix]
    .filter(Boolean)
    .join('-')
}
