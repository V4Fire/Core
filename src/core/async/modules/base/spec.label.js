/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';
import symbolGenerator from 'core/symbol';

import { EventEmitter2 as EventEmitter } from 'eventemitter2';

const
	$$ = symbolGenerator();

describe('core/async/modules/base/label', () => {
	it('label collision', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10, {label: $$.foo});

		$a.setTimeout(() => {
			i++;
		}, 10, {label: $$.foo});

		setTimeout(() => {
			expect(i).toBe(1);
			done();
		}, 15);
	});

	it('label collision with promises', (done) => {
		const
			$a = new Async();

		let
			i = 0;



		$a.setTimeout(() => {
			i++;
		}, 10, {label: $$.foo});

		$a.setTimeout(() => {
			i++;
		}, 10, {label: $$.foo});

		setTimeout(() => {
			expect(i).toBe(1);
			done();
		}, 15);
	});
});
