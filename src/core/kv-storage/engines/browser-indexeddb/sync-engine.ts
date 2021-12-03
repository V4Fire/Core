/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { unimplement } from 'core/functools/implementation';

export default [
	'get',
	'set',
	'remove',
	'keys'
].reduce((engine, method) => {
	engine[method] = unimplement({name: method}, () => undefined);
	return engine;
}, {});
