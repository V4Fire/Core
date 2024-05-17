/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { GetTypeType } from '../../../core/prelude/object/interface';
/**
 * Returns true if the specified value is a container structure
 * @param value
 */
export declare function isContainer(value: unknown): boolean;
/**
 * Returns true if the specified value has a prototype that can be extended
 * @param value
 */
export declare function canExtendProto(value: unknown): boolean;
/**
 * Returns a type of the specified value
 * @param value
 */
export declare function getType(value: unknown): GetTypeType;
/**
 * Returns a new instance of the specified value or null
 * @param value
 */
export declare function getSameAs<T>(value: T): Nullable<T>;
