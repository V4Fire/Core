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

/**
 * Returns a value of milliseconds from the seconds
 */
extend(Number.prototype, 'second', createMsFunction(second));

/**
 * Returns a value of milliseconds from the seconds
 */
extend(Number.prototype, 'seconds', Number.prototype.second);

/**
 * Returns a value of milliseconds from the minutes
 */
extend(Number.prototype, 'minute', createMsFunction(minute));

/**
 * Returns a value of milliseconds from the minutes
 */
extend(Number.prototype, 'minutes', Number.prototype.minute);

/**
 * Returns a value of milliseconds from the hours
 */
extend(Number.prototype, 'hour', createMsFunction(hour));

/**
 * Returns a value of milliseconds from the hours
 */
extend(Number.prototype, 'hours', Number.prototype.hour);

/**
 * Returns a value of milliseconds from the days
 */
extend(Number.prototype, 'day', createMsFunction(day));

/**
 * Returns a value of milliseconds from the days
 */
extend(Number.prototype, 'days', Number.prototype.day);

/**
 * Returns a value of milliseconds from the weeks
 */
extend(Number.prototype, 'week', createMsFunction(week));

/**
 * Returns a value of milliseconds from the weeks
 */
extend(Number.prototype, 'weeks', Number.prototype.week);

/**
 * Returns a string: the value + 'em'
 */
extend(Number.prototype, 'em', createPostfixGetter('em'));

/**
 * Returns a string: the value + 'ex'
 */
extend(Number.prototype, 'ex', createPostfixGetter('ex'));

/**
 * Returns a string: the value + 'rem'
 */
extend(Number.prototype, 'rem', createPostfixGetter('rem'));

/**
 * Returns a string: the value + 'px'
 */
extend(Number.prototype, 'px', createPostfixGetter('px'));

/**
 * Returns a string: the value + 'per'
 */
extend(Number.prototype, 'per', createPostfixGetter('per'));

/**
 * Returns a string: the value + 'vh'
 */
extend(Number.prototype, 'vh', createPostfixGetter('vh'));

/**
 * Returns a string: the value + 'vw'
 */
extend(Number.prototype, 'vw', createPostfixGetter('vw'));

/**
 * Returns a string: the value + 'vmin'
 */
extend(Number.prototype, 'vmin', createPostfixGetter('vmin'));

/**
 * Returns a string: the value + 'vmax'
 */
extend(Number.prototype, 'vmax', createPostfixGetter('vmax'));

/**
 * Returns true if the number is integer
 */
extend(Number.prototype, 'isInteger', function (): boolean {
	return this % 1 === 0;
});

/**
 * Returns true if the specified value is a integer number
 * @param obj
 */
extend(Number, 'isInteger', (obj) => Object.isNumber(obj) && obj.isInteger());

/**
 * Returns true if the number is float
 */
extend(Number.prototype, 'isFloat', function (): boolean {
	return this % 1 !== 0 && Number.isFinite(this);
});

/**
 * Returns true if the specified value is a float number
 * @param obj
 */
extend(Number, 'isFloat', (obj) => Object.isNumber(obj) && obj.isFloat());

/**
 * Returns true if the number is even
 */
extend(Number.prototype, 'isEven', function (): boolean {
	return this % 2 === 0;
});

/**
 * Returns true if the specified value is a even number
 * @param obj
 */
extend(Number, 'isEven', (obj) => Object.isNumber(obj) && obj.isEven());

/**
 * Returns true if the number is odd
 */
extend(Number.prototype, 'isOdd', function (): boolean {
	return this % 2 !== 0 && Number.isFinite(this);
});

/**
 * Returns true if the specified value is a odd number
 * @param obj
 */
extend(Number, 'isOdd', (obj) => Object.isNumber(obj) && obj.isOdd());

/**
 * Returns true if the number is natural
 */
extend(Number.prototype, 'isNatural', function (): boolean {
	return this > 0 && this % 1 === 0;
});

/**
 * Returns true if the specified value is a natural number
 * @param obj
 */
extend(Number, 'isNatural', (obj) => Object.isNumber(obj) && obj.isNatural());

/**
 * Returns true if the number is positive
 */
extend(Number.prototype, 'isPositive', function (): boolean {
	return this > 0;
});

/**
 * Returns true if the specified value is a positive number
 * @param obj
 */
extend(Number, 'isPositive', (obj) => Object.isNumber(obj) && obj.isPositive());

/**
 * Returns true if the number is negative
 */
extend(Number.prototype, 'isNegative', function (): boolean {
	return this < 0;
});

/**
 * Returns true if the specified value is a negative number
 * @param obj
 */
extend(Number, 'isNegative', (obj) => Object.isNumber(obj) && obj.isNegative());

/**
 * Returns true if the number is non-negative
 */
extend(Number.prototype, 'isNonNegative', function (): boolean {
	return this >= 0;
});

/**
 * Returns true if the specified value is a non-negative number
 * @param obj
 */
extend(Number, 'isNonNegative', (obj) => Object.isNumber(obj) && obj.isNonNegative());

/**
 * Returns true if the number is more or equal than 0 and less or equal than 1
 */
extend(Number.prototype, 'isBetweenZeroAndOne', function (): boolean {
	return this >= 0 && this <= 1;
});

/**
 * Returns true if the specified value is a number and is more or equal than 0 and less or equal than 1
 * @param obj
 */
extend(Number, 'isBetweenZeroAndOne', (obj) => Object.isNumber(obj) && obj.isBetweenZeroAndOne());

/**
 * Returns true if the number is more than 0 and less or equal than 1
 */
extend(Number.prototype, 'isPositiveBetweenZeroAndOne', function (): boolean {
	return this > 0 && this <= 1;
});

/**
 * Returns true if the specified value is a number and is more than 0 and less or equal than 1
 * @param obj
 */
extend(Number, 'isPositiveBetweenZeroAndOne', (obj) => Object.isNumber(obj) && obj.isPositiveBetweenZeroAndOne());

const
	decPartRgxp = /\.\d+/;

/**
 * Returns a string from the number with adding extra zeros to the start, if necessary
 *
 * @param targetLength - length of the resulting string once the current string has been padded
 * @param [sign] - if true, the sign of the number is written anyway
 * @param [base=10] - value of the base to convert in a string
 */
extend(Number.prototype, 'pad', function (
	this: Number,
	targetLength: number = 0,
	opts?: NumberPadOptions
): string {
	const
		val = Number(this);

	let str = Math.abs(val).toString(opts?.base || 10);
	str = repeatString('0', targetLength - str.replace(decPartRgxp, '').length) + str;

	if (opts?.sign || val < 0) {
		str = (val < 0 ? '-' : '+') + str;
	}

	return str;
});

//#if runtime has prelude/number/rounding

/**
 * Shortcut for the Math.floor method that also allows a precision
 * @param [precision]
 */
extend(Number.prototype, 'floor', createRoundingFunction(Math.floor));

/**
 * Shortcut for the Math.round method that also allows a precision
 * @param [precision]
 */
extend(Number.prototype, 'round', createRoundingFunction(Math.round));

/**
 * Shortcut for the Math.ceil method that also allows a precision
 * @param [precision]
 */
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

const globalOpts = Object.createDict({
	decimal: '.',
	thousands: ','
});

/**
 * Returns an option value by the specified key
 * @param key
 */
extend(Number, 'getOption', (key: string) => globalOpts[key]);

/**
 * Sets a new option value by the specified key
 *
 * @param key
 * @param value
 */
extend(Number, 'setOption', (key: string, value: string) => globalOpts[key] = value);

/**
 * Returns a string version of the number with adding some extra formatting
 *
 * @param [optsOrLength] - length of the decimal part or additional options:
 *   *) [decimalLength] - length of the decimal part
 *   *) [decimal] - separator for the decimal part
 *   *) [thousands] - separator for the "thousand" chunks
 */
extend(Number.prototype, 'format', function (
	this: Number,
	optsOrLength?: number | NumberFormatOptions
): string {
	const
		opts = <NumberFormatOptions>{...globalOpts};

	let
		decimalLength;

	if (Object.isObject(optsOrLength)) {
		Object.assign(opts, optsOrLength);
		decimalLength = opts.decimalLength;

	} else {
		decimalLength = optsOrLength;
	}

	const
		val = Number(this),
		str = decimalLength !== undefined ? val.toFixed(decimalLength) : val.toString(),
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

	if (dec?.length) {
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
