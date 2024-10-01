/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';

describe('core/async/modules/base `clearAll`', () => {
	it('simple usage', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5);

		const
			spy = jest.fn();

		$a.promise(Promise.resolve()).then(() => i++, (err) => spy(Object.select(err, ['type', 'reason'])));
		$a.clearAll();

		setTimeout(() => {
			expect(i).toBe(0);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'all'});
			done();
		}, 15);
	});

	it('by a group', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5, {group: 'foo'});

		const
			spy = jest.fn();

		$a.promise(Promise.resolve(), {group: 'foo'})
			.then(() => i++, (err) => spy(Object.select(err, ['type', 'reason'])));

		$a.clearAll({group: 'foo'});

		setTimeout(() => {
			expect(i).toBe(1);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'group'});
			$a.clearAll();
			done();
		}, 15);
	});

	it('by a regexp group', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5, {group: 'foo1'});

		const
			spy = jest.fn();

		$a.promise(Promise.resolve(), {group: 'foo2'})
			.then(() => i++, (err) => spy(Object.select(err, ['type', 'reason'])));

		$a.clearAll({group: /foo/});

		setTimeout(() => {
			expect(i).toBe(1);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'rgxp'});
			$a.clearAll();
			done();
		}, 15);
	});

	it('by a label', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5, {label: 'foo'});

		const
			spy = jest.fn();

		$a.promise(Promise.resolve(), {label: 'foo'})
			.then(() => i++, (err) => spy(Object.select(err, ['type', 'reason'])));

		$a.clearAll({label: 'foo'});

		setTimeout(() => {
			expect(i).toBe(1);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'label'});
			$a.clearAll();
			done();
		}, 15);
	});

	it('by a group and label', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5, {group: 'foo', label: 'foo'});

		const
			spy = jest.fn();

		$a.promise(Promise.resolve(), {group: 'foo'})
			.then(() => i++, (err) => spy(Object.select(err, ['type', 'reason'])));

		$a.clearAll({group: 'foo'});

		setTimeout(() => {
			expect(i).toBe(1);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'group'});
			$a.clearAll();
			done();
		}, 15);
	});

	it('by a label and group', (done) => {
		const
			$a = new Async();

		let
			i = 0;

		$a.setTimeout(() => {
			i++;
		}, 10);

		$a.setInterval(() => {
			i++;
		}, 5, {group: 'foo', label: 'foo'});

		const
			spy = jest.fn();

		$a.promise(Promise.resolve(), {group: 'foo', label: 'foo'})
			.then(() => i++, (err) => spy(Object.select(err, ['type', 'reason'])));

		$a.clearAll({group: 'foo', label: 'foo'});

		setTimeout(() => {
			expect(i).toBe(1);
			expect(spy).toHaveBeenCalledWith({type: 'clearAsync', reason: 'group'});
			$a.clearAll();
			done();
		}, 15);
	});
});
