/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

describe('core/prelude/function/lazy', () => {
	it('`debounce`', (done) => {
		let i = 0;

		const foo = (() => {
			i++;
		}).debounce(10);

		foo();
		foo();
		foo();
		foo();
		foo();

		setTimeout(() => {
			expect(i).toBe(1);
			done();
		}, 20);
	});

	it('`Function.debounce`', (done) => {
		let i = 0;

		const foo = Function.debounce(() => {
			i++;
		}, 10);

		foo();
		foo();
		foo();
		foo();
		foo();

		setTimeout(() => {
			expect(i).toBe(1);
			done();
		}, 20);
	});

	it('`Function.debounce` overload', (done) => {
		let i = 0;

		const foo = Function.debounce(10)(() => {
			i++;
		});

		foo();
		foo();
		foo();
		foo();
		foo();

		setTimeout(() => {
			expect(i).toBe(1);
			done();
		}, 20);
	});

	it('`throttle`', (done) => {
		let i = 0;

		const foo = (() => {
			i++;
		}).throttle(10);

		foo();
		foo();
		foo();
		foo();
		foo();

		expect(i).toBe(1);

		setTimeout(() => {
			expect(i).toBe(2);
			done();
		}, 20);
	});

	it('`throttle` with skipping the rest calls', (done) => {
		let i = 0;

		const foo = (() => {
			i++;
		}).throttle({delay: 10, single: true});

		foo();
		foo();
		foo();
		foo();
		foo();

		expect(i).toBe(1);

		setTimeout(() => {
			expect(i).toBe(1);
			done();
		}, 20);
	});

	it('`Function.throttle`', (done) => {
		let i = 0;

		const foo = Function.throttle(() => {
			i++;
		}, 10);

		foo();
		foo();
		foo();
		foo();
		foo();

		expect(i).toBe(1);

		setTimeout(() => {
			expect(i).toBe(2);
			done();
		}, 20);
	});

	it('`Function.throttle` overload #1', (done) => {
		let i = 0;

		const foo = Function.throttle(10)(() => {
			i++;
		});

		foo();
		foo();
		foo();
		foo();
		foo();

		expect(i).toBe(1);

		setTimeout(() => {
			expect(i).toBe(2);
			done();
		}, 20);
	});

	it('`Function.throttle` overload #2', (done) => {
		let i = 0;

		const foo = Function.throttle({delay: 10, single: true})(() => {
			i++;
		});

		foo();
		foo();
		foo();
		foo();
		foo();

		expect(i).toBe(1);

		setTimeout(() => {
			expect(i).toBe(1);
			done();
		}, 20);
	});
});
