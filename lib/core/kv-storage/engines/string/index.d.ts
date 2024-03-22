/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import StringEngine from '../../../../core/kv-storage/engines/string/engine';
export { StringEngine as default };
export * from '../../../../core/kv-storage/engines/string/interface';
export declare const syncSessionStorage: StringEngine, asyncSessionStorage: StringEngine;
