/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * Generates a UUIDv4 buffer and returns it
 */
export declare function generate(): Uint8Array;
/**
 * Converts the specified binary UUID to a string and returns it
 * @param uuid
 */
export declare function serialize(uuid: Uint8Array): string;
/**
 * Converts the specified UUID string to a binary sequence and returns it
 * @param uuid
 */
export declare function parse(uuid: string): Uint8Array;
