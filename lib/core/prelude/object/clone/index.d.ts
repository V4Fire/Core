/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { ValMap } from '../../../../core/prelude/object/clone/interface';
/**
 * Returns a function to serialize object values into strings
 *
 * @param base - base object
 * @param valMap - map to store non-clone values
 * @param replacer - additional replacer
 */
export declare function createSerializer(base: unknown, valMap: ValMap, replacer?: JSONCb): JSONCb;
/**
 * Returns a function to parse object values from strings
 *
 * @param base - base object
 * @param valMap - map that stores non-clone values
 * @param reviver - additional reviewer
 */
export declare function createParser(base: unknown, valMap: ValMap, reviver?: JSONCb | false): JSONCb;
