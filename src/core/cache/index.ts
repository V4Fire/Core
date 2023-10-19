/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/cache/README.md]]
 */

export * from 'core/cache/interface';

export { default as AbstractCache } from 'core/cache/interface';
export { default as Cache } from 'core/cache/simple';
export { default as RestrictedCache } from 'core/cache/restricted';
export { default as NeverCache } from 'core/cache/never';
