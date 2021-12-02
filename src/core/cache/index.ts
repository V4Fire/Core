/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/README.md]]
 * @packageDocumentation
 */

export * from '@src/core/cache/interface';

export { default as AbstractCache } from '@src/core/cache/interface';
export { default as Cache } from '@src/core/cache/simple';
export { default as RestrictedCache } from '@src/core/cache/restricted';
export { default as NeverCache } from '@src/core/cache/never';
