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

/** @see Number.prototype.second */
extend(Number.prototype, 'second', createMsFunction(second));

/** @see Number.prototype.seconds */
extend(Number.prototype, 'seconds', Number.prototype.second);

/** @see Number.prototype.minute */
extend(Number.prototype, 'minute', createMsFunction(minute));

/** @see Number.prototype.minutes */
extend(Number.prototype, 'minutes', Number.prototype.minute);

/** @see Number.prototype.hour */
extend(Number.prototype, 'hour', createMsFunction(hour));

/** @see Number.prototype.hours */
extend(Number.prototype, 'hours', Number.prototype.hour);

/** @see Number.prototype.day */
extend(Number.prototype, 'day', createMsFunction(day));

/** @see Number.prototype.days */
extend(Number.prototype, 'days', Number.prototype.day);

/** @see Number.prototype.week */
extend(Number.prototype, 'week', createMsFunction(week));

/** @see Number.prototype.weeks */
extend(Number.prototype, 'weeks', Number.prototype.week);

/** @see Number.prototype.em */
extend(Number.prototype, 'em', createPostfixGetter('em'));

/** @see Number.prototype.ex */
extend(Number.prototype, 'ex', createPostfixGetter('ex'));

/** @see Number.prototype.rem */
extend(Number.prototype, 'rem', createPostfixGetter('rem'));

/** @see Number.prototype.px */
extend(Number.prototype, 'px', createPostfixGetter('px'));

/** @see Number.prototype.per */
extend(Number.prototype, 'per', createPostfixGetter('per'));

/** @see Number.prototype.vh */
extend(Number.prototype, 'vh', createPostfixGetter('vh'));

/** @see Number.prototype.vw */
extend(Number.prototype, 'vw', createPostfixGetter('vw'));

/** @see Number.prototype.vmin */
extend(Number.prototype, 'vmin', createPostfixGetter('vmin'));

/** @see Number.prototype.vmax */
extend(Number.prototype, 'vmax', createPostfixGetter('vmax'));

/** @see Number.prototype.isInteger */
extend(Number.prototype, 'isInteger', function (): boolean {
	return this % 1 === 0;
});

/** @see NumberConstructor.isInteger */
extend(Number, 'isInteger', (obj) => Object.isNumber(obj) && obj.isInteger());

/** @see Number.prototype.isFloat */
extend(Number.prototype, 'isFloat', function (): boolean {
	return this % 1 !== 0 && Number.isFinite(this);
});

/** @see NumberConstructor.isFloat */
extend(Number, 'isFloat', (obj) => Object.isNumber(obj) && obj.isFloat());

/** @see Number.prototype.isEven */
extend(Number.prototype, 'isEven', function (): boolean {
	return this % 2 === 0;
});

/** @see NumberConstructor.isEven */
extend(Number, 'isEven', (obj) => Object.isNumber(obj) && obj.isEven());

/** @see Number.prototype.isOdd */
extend(Number.prototype, 'isOdd', function (): boolean {
	return this % 2 !== 0 && Number.isFinite(this);
});

/** @see NumberConstructor.isOdd */
extend(Number, 'isOdd', (obj) => Object.isNumber(obj) && obj.isOdd());

/** @see Number.prototype.isNatural */
extend(Number.prototype, 'isNatural', function (): boolean {
	return this > 0 && this % 1 === 0;
});

/** @see NumberConstructor.isNatural */
extend(Number, 'isNatural', (obj) => Object.isNumber(obj) && obj.isNatural());

/** @see Number.prototype.isPositive */
extend(Number.prototype, 'isPositive', function (): boolean {
	return this > 0;
});

/** @see NumberConstructor.isPositive */
extend(Number, 'isPositive', (obj) => Object.isNumber(obj) && obj.isPositive());

/** @see Number.prototype.isNegative */
extend(Number.prototype, 'isNegative', function (): boolean {
	return this < 0;
});

/** @see NumberConstructor.isNegative */
extend(Number, 'isNegative', (obj) => Object.isNumber(obj) && obj.isNegative());

/** @see Number.prototype.isNonNegative */
extend(Number.prototype, 'isNonNegative', function (): boolean {
	return this >= 0;
});

/** @see NumberConstructor.isNonNegative */
extend(Number, 'isNonNegative', (obj) => Object.isNumber(obj) && obj.isNonNegative());

/** @see Number.prototype.isBetweenZeroAndOne */
extend(Number.prototype, 'isBetweenZeroAndOne', function (): boolean {
	return this >= 0 && this <= 1;
});

/** @see NumberConstructor.isBetweenZeroAndOne */
extend(Number, 'isBetweenZeroAndOne', (obj) => Object.isNumber(obj) && obj.isBetweenZeroAndOne());

/** @see Number.prototype.isPositiveBetweenZeroAndOne */
extend(Number.prototype, 'isPositiveBetweenZeroAndOne', function (): boolean {
	return this > 0 && this <= 1;
});

/** @see NumberConstructor.isPositiveBetweenZeroAndOne */
extend(Number, 'isPositiveBetweenZeroAndOne', (obj) => Object.isNumber(obj) && obj.isPositiveBetweenZeroAndOne());

const
	decPartRgxp = /\.\d+/;

/** @see NumberConstructor.pad */
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

/** @see Number.prototype.floor */
extend(Number.prototype, 'floor', createRoundingFunction(Math.floor));

/** @see Number.prototype.round */
extend(Number.prototype, 'round', createRoundingFunction(Math.round));

/** @see Number.prototype.ceil */
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

/** @see NumberConstructor.getOption */
extend(Number, 'getOption', (key: string) => globalOpts[key]);

/** @see NumberConstructor.setOption */
extend(Number, 'setOption', (key: string, value: string) => globalOpts[key] = value);

/** @see Number.prototype.format */
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
