/**
 * Created by Xing Zhong.
 * https://github.com/capricorncd
 * Date: 2022/09/03 13:47:40 (GMT+0900)
 */

/**
 * @method setLocalStorage(key, value)
 * It's accesses the current domain's `localStorage` object and adds a `value` to it using `localStorage.setItem()`.
 * @param key `string` A `string` containing the name of the key you want to create/update.
 * @param value `any` Any `object` the value you want to give the `key` you are creating/updating.
 * @returns `void`
 */
export function setLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * @method getLocalStorage(key, def)
 * Reading the `localStorage` item.
 * @param key `string` A string containing the name of the `key` you want to retrieve the value of.
 * @param def `any` If the `key` does not exist, `def` is returned.
 * @returns `any` Any object the value of the `key`. If the `key` does not exist, `def` is returned.
 */
export function getLocalStorage<T>(key: string, def: T): T {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : def
  } catch (err) {
    return def
  }
}

/**
 * @method removeLocalStorage(key)
 * Removing the `localStorage` item.
 * @param key `string` A string containing the name of the key you want to remove.
 * @returns `void`
 */
export function removeLocalStorage(key: string): void {
  localStorage.removeItem(key)
}

/**
 * @method clearLocalStorage()
 * Removing all the `localStorage` items.
 * @returns `void`
 */
export function clearLocalStorage(): void {
  localStorage.clear()
}

/**
 * @method setSessionStorage(key, value)
 * It's accesses the current domain's `sessionStorage` object and adds a `value` to it using `sessionStorage.setItem()`.
 * @param key `string` A `string` containing the name of the key you want to create/update.
 * @param value `any` Any `object` the value you want to give the `key` you are creating/updating.
 * @returns `void`
 */
export function setSessionStorage<T>(key: string, value: T): void {
  sessionStorage.setItem(key, JSON.stringify(value))
}

/**
 * @method getSessionStorage(key, def)
 * Reading the `sessionStorage` item.
 * @param key `string` A string containing the name of the `key` you want to retrieve the value of.
 * @param def `any` If the `key` does not exist, `def` is returned.
 * @returns `any` Any object the value of the `key`. If the `key` does not exist, `def` is returned.
 */
export function getSessionStorage<T>(key: string, def: T): T {
  try {
    const data = sessionStorage.getItem(key)
    return data ? JSON.parse(data) : def
  } catch (err) {
    return def
  }
}

/**
 * @method removeSessionStorage(key)
 * Removing the `sessionStorage` item.
 * @param key `string` A string containing the name of the key you want to remove.
 * @returns `void`
 */
export function removeSessionStorage(key: string): void {
  sessionStorage.removeItem(key)
}

/**
 * @method clearSessionStorage()
 * Removing all the `sessionStorage` items.
 * @returns `void`
 */
export function clearSessionStorage(): void {
  sessionStorage.clear()
}
