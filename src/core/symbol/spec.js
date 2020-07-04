/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import symbolGenerator from 'core/symbol';

describe('core/symbol', () => {
	it('simple case', () => {
		const g = symbolGenerator();
		expect(typeof g.foo).toBe('symbol');
		expect(g.foo).toBe(g.foo);
		expect(symbolGenerator().foo).not.toBe(g.foo);
	});
});
