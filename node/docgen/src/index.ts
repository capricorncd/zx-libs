/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/07/10 16:01:17 (GMT+0900)
 *
 * @document @zx-libs/docgen
 *
 * <p>
 * <a href="https://npmcharts.com/compare/@zx-libs/docgen?minimal=true"><img src="https://img.shields.io/npm/dm/@zx-libs/docgen.svg?sanitize=true" alt="Downloads"></a>
 * <a href="https://www.npmjs.com/package/@zx-libs/docgen"><img src="https://img.shields.io/npm/v/@zx-libs/docgen.svg?sanitize=true" alt="Version"></a>
 * <a href="https://www.npmjs.com/package/@zx-libs/docgen"><img src="https://img.shields.io/npm/l/@zx-libs/docgen.svg?sanitize=true" alt="License"></a>
 * </p>
 *
 * A document generator that read the comments in the code and automatically generate MarkDown documents.
 *
 * ```bash
 * npm i -D @zx-libs/docgen
 * ```
 *
 * ```js
 * const { outputFile } = require('@zx-libs/docgen')
 * // import { outputFile } from '@zx-libs/docgen'
 *
 * outputFile('./src', './outputDir/README.md', {})
 * ```
 *
 * see [DEMO](https://github.com/capricorncd/zx-libs/blob/main/node/docgen/scripts/docs.mjs) https://github.com/capricorncd/zx-libs/blob/main/node/docgen/scripts/docs.mjs
 */
export * from './const'
export { getCommentsData, getTypes } from './docs-input'
export { outputFile, writeFileSync } from './docs-output'
export * from './helpers'
export * from './log'
