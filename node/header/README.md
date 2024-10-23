# header

<p>
  <a href="https://npmcharts.com/compare/@zx-libs/header?minimal=true"><img src="https://img.shields.io/npm/dm/@zx-libs/header.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@zx-libs/header"><img src="https://img.shields.io/npm/v/@zx-libs/header.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@zx-libs/header"><img src="https://img.shields.io/npm/l/@zx-libs/header.svg?sanitize=true" alt="License"></a>
</p>

Add specified information to the file header, such as version, copyright, etc.

## Used in JS files

```mjs
import { header } from '@zx-libs/header'

header('./dist', {
  name: 'libs-name',
  version: '1.0.0',
  author: 'capricorncd<capricorncd@qq.com>',
  homepage: 'https://github.com/capricorncd/zx-libs#readme',
})

// or
header('./dist', [
  '/*!',
  ' * libs-name version 1.0.0',
  ' * Author: capricorncd<capricorncd@qq.com>',
  ' * Homepage: https://github.com/capricorncd/zx-libs#readme',
  ' * Released on: 2024-04-21 17:31:24 (GMT+0900)',
  ' */',
])
```

## Use in command line

```bash
# all files in the dist folder
node node_modules/@zx-libs/header --dir=dist
# one file prepend-file.txt
node node_modules/@zx-libs/header --dir=dist --prepend-file=prepend-file.txt
```

prepend-file.txt

```txt
/*!
 * libs-name version 1.0.0'
 * Author: capricorncd<capricorncd@qq.com>'
 * Homepage: https://github.com/capricorncd/zx-libs#readme'
 * Released on: 2024-04-21 17:31:24 (GMT+0900)'
 */
```
