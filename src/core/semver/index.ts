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

import { operations, compareRgxp, operandLengthErrorText } from 'core/semver/const';
import { Operation, Strategy, ComparisonOptions } from 'core/semver/interface';

export * from 'core/semver/const';
export * from 'core/semver/interface';

/**
 * Compares two strings with number versions (a <op> b)
 * by using the semver strategy
 *
 * @param a
 * @param b
 * @param op - operation type
 * @param [opts] - additional options for the specified operation
 */
export default function (a: string, b: string, op: Operation, opts: ComparisonOptions = {x: '*'}): boolean {
	if (!a.trim() || !b.trim()) {
		throw new Error(operandLengthErrorText);
	}

	if (!operations[op]) {
		throw new TypeError(`Unknown comparator "${op}". Only "${Object.keys(operations).join(', ')}" available.`);
	}

	const
		left = a.split('.'),
		right = b.split('.'),
		{x} = opts;

	const
		strategyMatch = op.match(compareRgxp);

	let
		strategy: Strategy = 'ord';

	if (strategyMatch?.[0] === op) {
		// Using for the caret range ^=
		strategy = 'caret';

	} else if (strategyMatch?.index === 0) {
		// Using for the equal ==
		strategy = 'eq';
	}

	const
		max = Math.max(left.length, right.length);

	let
		preRes,
		res = false;

	for (let i = 0; i < max; i++) {
		const
			l = left[i] || x,
			r = right[i] || x;

		const
			rVal = parseInt(r, 10),
			lVal = parseInt(l, 10);

		if (i) {
			preRes = res;
		}

		res = operations[op](
			lVal,
			rVal
		);

		switch (strategy) {
			case 'caret':
				if (!res) {
					return (i > 0 && right[i - 1] !== '0' && rVal < lVal) || l === x || r === x;
				}

				break;

			case 'eq':
				if (!res) {
					return l === x || r === x;
				}

				break;

			case 'ord':
				if (!res && (r === x || l === x)) {
					// 1.3.0 <= >= 1.2.*
					if (op.length === 2 && !preRes) {
						return false;
					}

					// 1.2.4 >< 1.*
					// 1.2.4 >< 1.2.*
					// 1.* >< 1.2.4
					// 1.2.* >< 1.2.4
					return op.length !== 1;
				}

				// 1.1.2 > 1.1.1
				// 1.3.0 > 1.2.*
				if (res && op.length === 1) {
					return res;
				}
		}
	}

	return res;
}
