/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// tslint:disable:binary-expression-operand-order
// tslint:disable:no-bitwise

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

const
	decPartRgxp = /\.\d+/;

extend(Number.prototype, 'pad', function (
	this: Number,
	place: number = 0,
	sign?: boolean,
	base: number = 10
): string {
	const
		val = Number(this);

	let str = Math.abs(val).toString(base || 10);
	str = repeatString('0', place - str.replace(decPartRgxp, '').length) + str;

	if (sign || val < 0) {
		str = (val < 0 ? '-' : '+') + str;
	}

	return str;
});

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

function repeatString(str: string, num: number): string {
	str = String(str);

	let
		res = '';

	while (num > 0) {
		if (num & 1) {
			res += str;
		}

		num >>= 1;

		if (num) {
			str += str;
		}
	}

	return res;
}
