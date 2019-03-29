/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type Operations =
	'>' |
	'>=' |
	'<' |
	'<=' |
	'==' |
	'^=';

export type Strategies =
	'eq' |
	'fullEq' |
	'fromEq' |
	'default';

const compares: Record<Operations, (a: number, b: number) => boolean> = {
	'>': (a, b) => a > b,
	'>=': (a, b) => a >= b,
	'<': (a, b) => a < b,
	'<=': (a, b) => a <= b,
	'==': (a, b) => a === b,
	'^=': (a, b) => a === b
};

const
	compareRgxp = /((^|\^|)=)/;

/**
 * Compares version strings via a comparator
 *
 * @param a
 * @param b
 * @param comparator
 *
 * @example
 * console.log(check('1.4.1', '1.5.2', '>'))  // false
 * console.log(check('1', '1.5.2', '=='))     // true
 * console.log(check('2.4.1', '2.4', '<='))   // true
 * console.log(check('2.4', '2.4.2', '^='))   // true
 */
export default function (a: string, b: string, comparator: Operations): boolean {
	if (!compares[comparator]) {
		throw new TypeError(`Unknown comparator: ${comparator}. Only ${Object.keys(compares).join(', ')} available`);
	}

	const
		aArr = a.split('.'),
		bArr = b.split('.');

	let
		target = bArr.map((el) => el),
		candidate = aArr.map((el) => el),
		strategy = 'default';

	const
		match = comparator.match(compareRgxp);

	if (match) {
		if (match.index === 1) {
			strategy = 'eq';

		} else if (match[0] === comparator) {
			strategy = 'fromEq';

		} else if (match.index === 0) {
			strategy = 'fullEq';
		}
	}

	const
		lengthDiff = Math.abs(aArr.length - bArr.length),
		filledDiff = Array(lengthDiff).fill('*');

	if (lengthDiff) {
		if (candidate.length > target.length) {
			target = target.concat(filledDiff);

		} else {
			candidate = candidate.concat(filledDiff);
		}
	}

	let
		res = false;

	for (let i = 0; i < target.length; i++) {
		const
			t = target[i],
			c = candidate[i];

		let
			cNum = parseInt(c, 10),
			tNum = parseInt(t, 10);

		if (/[><]/.test(comparator)) {
			cNum = c === '*' ? 0 : cNum;
			tNum = t === '*' ? 0 : tNum;
		}

		res = compares[comparator](
			cNum,
			tNum
		);

		switch (strategy) {
			case 'fromEq':
				if (!res) {
					return i > 0 && cNum < tNum;
				}

				break;

			case 'fullEq':
				if (!res) {
					return c === '*' || t === '*';
				}

				break;

			case 'eq':
				if (cNum !== tNum || i === target.length - 1) {
					return c === '*' || t === '*' || res;
				}

				break;

			case 'default':
				if (res) {
					return res;
				}
		}
	}

	return res;
}
