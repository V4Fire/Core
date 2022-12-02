/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:lang/README.md]]
 * @packageDocumentation
 */

import type { LangsDict } from 'lang/interface';

export * from 'lang/interface';

/**
 * Format:
 * {
 *   [lang]: {
 *     [keysetName]: {
 *       [key]: value
 *     }
 *   }
 * }
 */
const langDict: LangsDict = {};

export default langDict;
