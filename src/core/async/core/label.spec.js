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

describe('core/async/modules/base `label`', () => {
	const onResolve = (res, label) => (v = label) => {
		res.push(v);
		return label;
	};

	const
		onReject = (spy) => (err) => spy(Object.select(err, ['type', 'reason'])),
		onMerge = (spy, label) => () => spy(label);

	it('label collision', (done) => {
		const
			$a = new Async(),
			spy = jest.fn(),
			res = [];

		$a.setTimeout(onResolve(res, 'first'), 10, {label: $$.foo, onClear: onReject(spy)});
		$a.setTimeout(onResolve(res, 'second'), 10, {label: $$.foo, onClear: onReject(spy)});

		setTimeout(() => {
			expect(res).toEqual(['second']);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'collision'});
			done();
		}, 15);
	});

	it('label collision with promises', (done) => {
		const
			$a = new Async(),
			spy = jest.fn(),
			res = [];

		$a.promise(Promise.resolve('first'), {label: $$.foo}).then(onResolve(res), onReject(spy));
		$a.promise(Promise.resolve('second'), {label: $$.foo}).then(onResolve(res), onReject(spy));

		setTimeout(() => {
			expect(res).toEqual(['second']);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'collision'});
			done();
		}, 15);
	});

	it('label collision with joining', (done) => {
		const
			$a = new Async(),
			spy = jest.fn(),
			res = [];

		$a.setTimeout(onResolve(res, 'first'), 10, {label: $$.foo, join: true, onMerge: onMerge(spy, 'first')});
		$a.setTimeout(onResolve(res, 'second'), 10, {label: $$.foo, join: true, onMerge: onMerge(spy, 'second')});

		setTimeout(() => {
			expect(res).toEqual(['first']);
			expect(spy).toHaveBeenCalledWith('second');
			done();
		}, 15);
	});

	it('label collision with promises and joining', (done) => {
		const
			$a = new Async(),
			res = [];

		$a.promise(Promise.resolve('first'), {label: $$.foo, join: true})
			.then(onResolve(res));

		$a.promise(Promise.resolve('second'), {label: $$.foo, join: true})
			.then(onResolve(res));

		setTimeout(() => {
			expect(res).toEqual(['first', 'first']);
			done();
		}, 15);
	});

	it('label collision with replacing', (done) => {
		const
			$a = new Async(),
			spy = jest.fn(),
			res = [];

		$a.setTimeout(onResolve(res, 'first'), 10, {label: $$.foo, join: 'replace', onClear: onReject(spy)});
		$a.setTimeout(onResolve(res, 'second'), 10, {label: $$.foo, join: 'replace', onClear: onReject(spy)});

		setTimeout(() => {
			expect(res).toEqual(['second']);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'collision'});
			done();
		}, 15);
	});

	it('label collision with promises and replacing', (done) => {
		const
			$a = new Async(),
			spy = jest.fn(),
			res = [];

		$a.promise(Promise.resolve('first'), {label: $$.foo, join: 'replace'}).then(onResolve(res), onReject(spy));
		$a.promise(Promise.resolve('second'), {label: $$.foo, join: 'replace'}).then(onResolve(res), onReject(spy));

		setTimeout(() => {
			expect(res).toEqual(['second', 'second']);
			done();
		}, 15);
	});

	it('label collision with iterables and replacing', async () => {
		const $a = new Async();

		const result = [];

		await Promise.all([
			(async () => {
				for await (const item of $a.iterable([1, 2], {
					label: 'foo',
					join: 'replace'
				})) {
					result.push(item);
				}
			})(),

			(async () => {
				for await (const item of $a.iterable([10, 20], {
					label: 'foo',
					join: 'replace'
				})) {
					result.push(item);
				}
			})()
		]);

		expect(result).toEqual([10, 10, 20, 20]);
	});

	it('label collision with iterables and join', async () => {
		const $a = new Async();

		const result = [];

		await Promise.all([
			(async () => {
				for await (const item of $a.iterable([1, 2], {
					label: 'foo',
					join: true
				})) {
					result.push(item);
				}
			})(),

			(async () => {
				for await (const item of $a.iterable([10, 20], {
					label: 'foo',
					join: true
				})) {
					result.push(item);
				}
			})()
		]);

		expect(result).toEqual([1, 1, 2, 2]);
	});
});
