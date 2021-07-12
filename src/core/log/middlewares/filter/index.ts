/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export { FilterMiddleware } from 'core/log/middlewares/filter/filter';

export { default as DuplicatesFilter } from 'core/log/middlewares/filter/modules/duplicates-filter';
export { default as ContextFilter } from 'core/log/middlewares/filter/modules/context-filter';

export * from 'core/log/middlewares/filter/interface';
