/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Marks the passed value that it can be wrapped with a promise
 */
type CanPromise<T> = T | Promise<T>;

/**
 * Marks the passed value that it can be wrapped with a promise-like structure
 */
type CanPromiseLike<T> = T | PromiseLike<T>;

/**
 * Marks the passed value that it can be placed with an array
 */
type CanArray<T> = T | T[];

/**
 * Marks the passed value that it can be undefined
 */
type CanUndef<T> = T | undefined;

/**
 * Marks the passed value that it can be null or undefined
 */
type Nullable<T> = T | null | undefined;

/**
 * Marks the passed value that it can be void
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type CanVoid<T> = T | void;
