/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { notImplement } from 'core/functools/not-implemented';

export default [
	'get',
	'set',
	'remove',
	'keys'
].reduce((engine, method) => {
	// eslint-disable-next-line no-new-func
	engine[method] = notImplement({name: method}, () => undefined);

	return engine;
}, {});
