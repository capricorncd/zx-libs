/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/07/13 22:28:32 (GMT+0900)
 */
/**
 * @method fileToBase64(file)
 * read file to base64 string
 * @param file `File | Blob`
 * @returns `Promise<string>`
 */
export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result
      if (result) {
        resolve(result as string)
      } else {
        reject(new Error(`FileReader's result is null, ${e.target}`))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * @method createBlobURL(blob)
 * creates a string containing a URL representing the object given in the parameter.
 * @param blob `Blob | File`
 * @returns `string`
 */
export function createBlobURL(blob: Blob | File): string {
  const windowURL = window.URL || window.webkitURL
  return windowURL.createObjectURL(blob)
}

/**
 * @method splitBase64(base64)
 * split base64 data
 * @param base64 `string` base64(image) data.
 * @returns `{ type: string; data: string }`
 */
export function splitBase64(base64: string): { type: string; data: string } {
  // base64 format:
  // "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAkGB+wgHBgkIBwgKCgkLDRYPDQw//9k="
  const arr = base64.split(',')
  let type = ''
  if (/data:(\w+\/\w+);base64/.test(arr[0])) {
    type = RegExp.$1
  }
  return {
    type: type,
    data: arr[1],
  }
}

/**
 * @method base64ToBlob(base64, type)
 * base64 to blob data
 * @param base64 `string`
 * @param type? `string` the target blob mimeType, Example `image/jpeg`
 * @returns `Blob`
 */
export function base64ToBlob(base64: string, type?: string): Blob {
  const dataInfo = splitBase64(base64)
  const data = window.atob(dataInfo.data)
  type = type || dataInfo.type

  const ia = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    ia[i] = data.charCodeAt(i)
  }
  return new Blob([ia], { type: type })
}
