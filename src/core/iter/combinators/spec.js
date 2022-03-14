/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { intoIter } from 'core/iter';
import { sequence } from 'core/iter/combinators';
import { from, pick, andPick, assemble, streamArray } from 'core/json/stream';

describe('core/iter/combinators', () => {
	describe('sequence', () => {
		it('sequence of sync iterators', () => {
			const seq = sequence([1, 2], new Set([3, 4]), [5, 6].values());
			expect([...seq]).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it('sequence of async iterators', async () => {
			const tokens = intoIter(from(JSON.stringify({
				total: 3,
				data: [
					{user: 'Bob', age: 21},
					{user: 'Ben', age: 24},
					{user: 'Rob', age: 28}
				]
			})));

			const seq = sequence(
				assemble(pick(tokens, 'total')),
				streamArray(andPick(tokens, 'data'))
			);

			for await (const val of seq) {
				console.log(val);
			}
		});
	});
});
