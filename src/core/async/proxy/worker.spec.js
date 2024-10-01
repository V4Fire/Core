/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';
import symbolGenerator from 'core/symbol';

const
	$$ = symbolGenerator();

describe('core/async/modules/proxy `worker`', () => {
	it('simple worker', () => {
		let
			i = 0;

		const
			$a = new Async();

		const worker = {
			terminate() {
				i++;
			}
		};

		expect($a.worker(worker)).toBe(worker);
		expect($a.worker(worker)).toBe(worker);

		$a.terminateWorker(worker);

		expect(i).toBe(1);

		$a.terminateWorker(worker);

		expect(i).toBe(1);
	});

	it('function worker', () => {
		let
			i = 0;

		const
			$a = new Async();

		const worker = () => i++;

		expect($a.worker(worker)).toBe(worker);
		expect($a.worker(worker)).toBe(worker);

		$a.terminateWorker(worker);

		expect(i).toBe(1);

		$a.terminateWorker(worker);

		expect(i).toBe(1);
	});

	it('shared worker', () => {
		let
			i = 0;

		const
			$a1 = new Async(),
			$a2 = new Async();

		const worker = {
			terminate() {
				i++;
			}
		};

		expect($a1.worker(worker)).toBe(worker);
		expect($a2.worker(worker)).toBe(worker);

		$a1.terminateWorker();

		expect(i).toBe(0);

		$a2.terminateWorker();

		expect(i).toBe(1);
	});

	it('workers with labels', () => {
		const onResolve = (res, label) => (v = label) => {
			res.push(v);
			return v;
		};

		const
			onReject = (spy) => (err) => spy(Object.select(err, ['type', 'reason'])),
			onMerge = (spy, label) => () => spy(label);

		{
			const
				$a = new Async(),
				spy = jest.fn(),
				res = [];

			$a.worker(onResolve(res, 'first'), {label: $$.foo, onClear: onReject(spy)});
			$a.worker(onResolve(res, 'second'), {label: $$.foo, onClear: onReject(spy)});

			expect(res).toEqual(['first']);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'collision'});
		}

		{
			const
				$a = new Async(),
				spy = jest.fn(),
				res = [];

			$a.worker(onResolve(res, 'first'), {label: $$.foo, join: true, onMerge: onMerge(spy, 'first')});
			$a.worker(onResolve(res, 'second'), {label: $$.foo, join: true, onMerge: onMerge(spy, 'second')});

			expect(res).toEqual(['second']);
			expect(spy).toHaveBeenCalledWith('second');
		}

		{
			const
				$a = new Async(),
				spy = jest.fn(),
				res = [];

			$a.worker(onResolve(res, 'first'), {label: $$.foo, join: 'replace', onClear: onReject(spy)});
			$a.worker(onResolve(res, 'second'), {label: $$.foo, join: 'replace', onClear: onReject(spy)});

			expect(res).toEqual(['first']);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'collision'});
		}
	});
});
