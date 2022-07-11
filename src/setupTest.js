/* eslint-disable */

expect.extend({
	toEqual(received, expected) {
		const matcherName = 'toEqual';
		const options = {
			comment: 'deep equality',
			isNot: this.isNot,
			promise: this.promise,
		};
		const pass = this.equals(received, expected);

		const message = pass
			? () =>
				this.utils.matcherHint(matcherName, undefined, undefined, options) +
				'\n\n' +
				`Expected: not ${this.utils.printExpected(expected)}\n` +
				(this.utils.stringify(expected) !== this.utils.stringify(received)
					? `Received:     ${this.utils.printReceived(received)}`
					: '')
			: () =>
				this.utils.matcherHint(matcherName, undefined, undefined, options) +
				'\n\n' +
				this.utils.printDiffOrStringify(
					expected,
					received,
					'Expected',
					'Received',
					this.expand,
				);

		return {actual: received, expected, message, name: matcherName, pass};
	}
});

const oldExpect = expect
global.expect = function(...args) {
	let visited = new Set();

	const fn = (obj)=>{
		if(obj == null || typeof obj !== 'object' || obj instanceof Error || visited.has(obj))return
		visited.add(obj)
		Object.getOwnPropertySymbols(obj).map((symbol) => Object.isExtensible(obj) && Object.defineProperty(obj,symbol,{enumerable: false}));
		(obj.forEach? obj: Object.values(obj)).forEach((el) => fn(el))
	}

	args.forEach((el) => {
		if (el && el.mock != null) {
			fn(el.mock.calls)
		}else{
			fn(el)
		}
	})

	return oldExpect(...args)
}
