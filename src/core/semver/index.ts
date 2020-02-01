/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/semver/README.md]]
 * @packageDocumentation
 */

import { operations, compareRgxp, inequalityRgxp } from 'core/semver/const';
import { Operation } from 'core/semver/interface';

export * from 'core/semver/const';
export * from 'core/semver/interface';

/**
 * Compares two strings with number versions using the semver strategy
 *
 * @param a
 * @param b
 * @param operation - operation type
 */
export default function (a: string, b: string, operation: Operation): boolean {
	if (!operations[operation]) {
		throw new TypeError(`Unknown comparator: ${operation}. Only ${Object.keys(operations).join(', ')} available`);
	}

	const
		aArr = a.split('.'),
		bArr = b.split('.');

	let
		target = bArr.map((el) => el),
		candidate = aArr.map((el) => el),
		strategy = 'default';

	const
		match = operation.match(compareRgxp);

	if (match) {
		if (match.index === 1) {
			strategy = 'eq';

		} else if (match[0] === operation) {
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

		if (inequalityRgxp.test(operation)) {
			cNum = c === '*' ? 0 : cNum;
			tNum = t === '*' ? 0 : tNum;
		}

		res = operations[operation](
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
