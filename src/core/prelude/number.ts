/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// tslint:disable:binary-expression-operand-order

import extend from 'core/prelude/extend';

const
	second = 1e3,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	week = 7 * day;

const msMethods = <Array<[string, number]>>[
	['second', second],
	['minute', minute],
	['hour', hour],
	['day', day],
	['week', week]
];

for (let i = 0; i < msMethods.length; i++) {
	const
		[nm, offset] = msMethods[i];

	extend(Number.prototype, nm, function (this: Number): number {
		return Number(this) * offset;
	});
}

const cssMethods = <string[]>[
	'em',
	'ex',
	'rem',
	'px',
	'per',
	'vh',
	'vw',
	'vmin',
	'vmax'
];

for (let i = 0; i < cssMethods.length; i++) {
	const
		nm = cssMethods[i];

	extend(Number.prototype, nm, function (this: Number): string {
		return this + nm;
	});
}

/** @see Sugar.Number.floor */
extend(Number.prototype, 'floor', createRoundingFunction(Math.floor));

/** @see Sugar.Number.round */
extend(Number.prototype, 'round', createRoundingFunction(Math.round));

/** @see Sugar.Number.ceil */
extend(Number.prototype, 'ceil', createRoundingFunction(Math.ceil));

const opts = Object.createDict({
	decimal: '.',
	thousands: ','
});

/** @see Sugar.Number.setOption */
extend(Number, 'getOption', (key: string) => opts[key]);
extend(Number, 'setOption', (key: string, val: string) => opts[key] = val);

/** @see Sugar.Number.floor */
extend(Number.prototype, 'format', function (this: Number, place?: number): string {
	const
		val = Number(this),
		str = place !== undefined ? val.toFixed(place) : val.toString(),
		[int, dec] = str.split('.');

	let
		res = '';

	for (let j = 0, i = int.length; i--;) {
		if (j === 3) {
			j = 0;
			res = opts.thousands + res;
		}

		j++;
		res = int[i] + res;
	}

	if (dec && dec.length) {
		return res + opts.decimal + dec;
	}

	return res;
});

function createRoundingFunction(method: Function): Function {
	return function (this: Number, precision?: number): number {
		const
			val = Number(this);

		if (precision) {
			let
				multiplier = Math.pow(10, Math.abs(precision));

			if (precision < 0) {
				multiplier = 1 / multiplier;
			}

			return method(val * multiplier) / multiplier;
		}

		return method(val);
	};
}
