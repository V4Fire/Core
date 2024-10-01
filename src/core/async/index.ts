/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/async/README.md]]
 * @packageDocumentation
 */

import Wrappers from 'core/async/wrappers';

export * from 'core/async/const';
export * from 'core/async/interface';
export * from 'core/async/wrappers';
export * from 'core/async/helpers';

export default class Async<CTX extends object = Async<any>> extends Wrappers<CTX> {}
