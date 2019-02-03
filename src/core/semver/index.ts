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
 * console.log(check('1.4.1', '1.5.2', '>'))  //false
 */
export default function (a: string, b: string, comparator: Operations = '>'): boolean {
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
		bArr = b.split('.'),
		lengthDiff = Math.abs(aArr.length - bArr.length);

	let
		target = $C(bArr).map((el) => parseInt(el, 10) || 0),
		candidate = $C(aArr).map((el) => parseInt(el, 10) || 0),
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

	if (candidate.length > target.length) {
		target = target.concat(Array(lengthDiff).fill(0));

	} else {
		candidate = candidate.concat(Array(lengthDiff).fill(0));
	}

	let
		res = false;

	$C(target).some((t, i) => {
		const
			cNum = candidate[i] || 0;

		res = compares[comparator](cNum, t);

		switch (strategy) {
			case 'fromEq':
				if (!res) {
					res = aArr.length > bArr.length ? false : i > 0 && cNum < t;
					return true;
				}

				break;

			case 'fullEq':
				if (!res) {
					return true;
				}

				break;

			case 'eq':
				if (cNum !== t || i === target.length - 1) {
					return true;
				}

				break;

			case 'default':
				if (res || cNum !== t) {
					return true;
				}
		}
	});

	return res;
}
