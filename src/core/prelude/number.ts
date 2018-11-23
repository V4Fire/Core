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
extend(Number.prototype, 'floor', function (this: Number, precision?: number): number {
	const
		v = Number(this);

	if (precision) {
		if (precision > 0) {
			return Number(v.toFixed(precision));
		}

		const
			s = v.toFixed().replace(new RegExp(`\\d{0,${Math.abs(precision)}}$`), collapse);

		if (s[0] === '0') {
			return 0;
		}

		return Number(s);
	}

	return Math.floor(v);
});

function collapse(str: string): string {
	let
		res = '';

	for (let i = 0; i < str.length; i++) {
		res += '0';
	}

	return res;
}
