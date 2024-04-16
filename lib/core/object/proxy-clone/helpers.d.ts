/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Store, ResolvedTarget } from '../../../core/object/proxy-clone/interface';
/**
 * Class to create a custom property descriptor
 */
export declare class Descriptor {
    /**
     * Original property descriptor
     */
    descriptor: PropertyDescriptor;
    constructor(value: PropertyDescriptor);
    /**
     * Returns a value from the descriptor
     * @param receiver - receiver for a get method
     */
    getValue<T = unknown>(receiver: object): T;
    /**
     * Sets a new value to the descriptor
     *
     * @param value
     * @param receiver - receiver for a set method
     */
    setValue(value: unknown, receiver: object): boolean;
}
/**
 * Returns a raw value by a key from the specified store
 *
 * @param key
 * @param valStore
 */
export declare function getRawValueFromStore(key: PropertyKey, valStore: CanUndef<Map<unknown, unknown>>): unknown;
/**
 * Resolves the specified target by a value from the store and returns it
 *
 * @param store
 * @param target
 */
export declare function resolveTarget<T>(target: T, store: Store): ResolvedTarget<T>;
