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

/** @see Sugar.Number.second */
extend(Number.prototype, 'second', createMsFunction(second));

/** @see Sugar.Number.seconds */
extend(Number.prototype, 'seconds', Number.prototype.second);

/** @see Sugar.Number.minute */
extend(Number.prototype, 'minute', createMsFunction(minute));

/** @see Sugar.Number.minutes */
extend(Number.prototype, 'minutes', Number.prototype.minute);

/** @see Sugar.Number.hour */
extend(Number.prototype, 'hour', createMsFunction(hour));

/** @see Sugar.Number.hours */
extend(Number.prototype, 'hours', Number.prototype.hour);

/** @see Sugar.Number.day */
extend(Number.prototype, 'day', createMsFunction(day));

/** @see Sugar.Number.days */
extend(Number.prototype, 'days', Number.prototype.day);

/** @see Sugar.Number.week */
extend(Number.prototype, 'week', createMsFunction(week));

/** @see Sugar.Number.weeks */
extend(Number.prototype, 'weeks', Number.prototype.week);

/**
 * Returns string: number + 'em'
 */
extend(Number.prototype, 'em', createPostfixGetter('em'));

/**
 * Returns string: number + 'ex'
 */
extend(Number.prototype, 'ex', createPostfixGetter('ex'));

/**
 * Returns string: number + 'rem'
 */
extend(Number.prototype, 'rem', createPostfixGetter('rem'));

/**
 * Returns string: number + 'px'
 */
extend(Number.prototype, 'px', createPostfixGetter('px'));

/**
 * Returns string: number + 'per'
 */
extend(Number.prototype, 'per', createPostfixGetter('per'));

/**
 * Returns string: number + 'vh'
 */
extend(Number.prototype, 'vh', createPostfixGetter('vh'));

/**
 * Returns string: number + 'vw'
 */
extend(Number.prototype, 'vw', createPostfixGetter('vw'));

/**
 * Returns string: number + 'vmin'
 */
extend(Number.prototype, 'vmin', createPostfixGetter('vmin'));

/**
 * Returns string: number + 'vmax'
 */
extend(Number.prototype, 'vmax', createPostfixGetter('vmax'));

/** @see Sugar.Number.isInteger */
extend(Number.prototype, 'isInteger', function (): boolean {
	return this % 1 === 0;
});

/**
 * Returns true if the specified number is float
 */
extend(Number.prototype, 'isFloat', function (): boolean {
	return this % 1 !== 0 && Number.isFinite(this);
});

/** @see Sugar.Number.isEven */
extend(Number.prototype, 'isEven', function (): boolean {
	return this % 2 === 0;
});

/** @see Sugar.Number.isEven */
extend(Number.prototype, 'isOdd', function (): boolean {
	return this % 2 !== 0 && Number.isFinite(this);
});

/**
 * Returns true if the specified number is natural
 */
extend(Number.prototype, 'isNatural', function (): boolean {
	return this > 0 && this % 1 === 0;
});

/**
 * Returns true if the specified number is positive
 */
extend(Number.prototype, 'isPositive', function (): boolean {
	return this > 0;
});

/**
 * Returns true if the specified number is negative
 */
extend(Number.prototype, 'isNegative', function (): boolean {
	return this < 0;
});

/**
 * Returns true if the specified number is non-negative
 */
extend(Number.prototype, 'isNonNegative', function (): boolean {
	return this >= 0;
});

/**
 * Returns true if the specified number is more or equal than 0 and less or equal than 1
 */
extend(Number.prototype, 'isBetweenZeroAndOne', function (): boolean {
	return this >= 0 && this <= 1;
});

/**
 * Returns true if the specified number is more than 0 and less or equal than 1
 */
extend(Number.prototype, 'isPositiveBetweenZeroAndOne', function (): boolean {
	return this > 0 && this <= 1;
});

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

//#if runtime has prelude/number/rounding

/** @see Sugar.Number.floor */
extend(Number.prototype, 'floor', createRoundingFunction(Math.floor));

/** @see Sugar.Number.round */
extend(Number.prototype, 'round', createRoundingFunction(Math.round));

/** @see Sugar.Number.ceil */
extend(Number.prototype, 'ceil', createRoundingFunction(Math.ceil));

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

//#endif
//#if runtime has prelude/number/format

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

//#endif

function createPostfixGetter(nm: string): PropertyDescriptor {
	return {
		get(): string {
			return Number(this) + nm;
		}
	};
}

function createMsFunction(offset: number): Function {
	const fn = function (this: Number): number {
		return Number(this) * offset;
	};

	fn.valueOf = fn;
	return fn;
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
