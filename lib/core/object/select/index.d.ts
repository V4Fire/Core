/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/object/select/README.md]]
 * @packageDocumentation
 */
import type { SelectParams } from '../../../core/object/select/interface';
export * from '../../../core/object/select/interface';
/**
 * Finds an element from an object by the specified parameters
 *
 * @param obj - object to search
 * @param [params] - search parameters
 */
export default function select<T = unknown>(obj: unknown, params?: SelectParams): CanUndef<T>;
