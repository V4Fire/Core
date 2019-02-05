/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');

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

/**
 * Compares versioning strings via a comparator
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
	const compares: Record<Operations, (a: number, b: number) => boolean> = {
		'>': (a, b) => a > b,
		'>=': (a, b) => a >= b,
		'<': (a, b) => a < b,
		'<=': (a, b) => a <= b,
		'==': (a, b) => a === b,
		'^=': (a, b) => a === b
	};

	if (!compares[comparator]) {
		throw new Error(`Unknown comparator: ${comparator}. Only ${Object.keys(compares).join(', ')} available`);
	}

	const
		aArr = a.split('.'),
		bArr = b.split('.');

	let
		target = $C(bArr).map((el) => el),
		candidate = $C(aArr).map((el) => el),
		strategy = 'default';

	const match = comparator.match(/((^|\^|)=)/);

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
		lengthDiff = Math.abs(aArr.length - bArr.length);

	if (candidate.length > target.length) {
		target = target.concat(Array(lengthDiff).fill('*'));

	} else {
		candidate = candidate.concat(Array(lengthDiff).fill('*'));
	}

	let
		res = false;

	$C(target).some((t, i) => {
		const
			c = candidate[i];

		let
			cNum = parseInt(c, 10),
			tNum = parseInt(t,  10);

		res = compares[comparator](cNum, tNum);

		switch (strategy) {
			case 'fromEq':
				if (!res) {
					cNum = c === '*' ? 0 : cNum;
					tNum = t === '*' ? 0 : tNum;

					res = i > 0 && cNum < tNum;
					return true;
				}

				break;

			case 'fullEq':
				if (!res) {
					if (c === '*' || t === '*') {
						res = true;
					}

					return true;
				}

				break;

			case 'eq':
				if (cNum !== tNum || i === target.length - 1) {
					if (c === '*' || t === '*') {
						res = true;
					}

					return true;
				}

				break;

			case 'default':
				if (res || cNum !== tNum) {
					return true;
				}
		}
	});

	return res;
}
