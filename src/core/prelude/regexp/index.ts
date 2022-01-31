/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import { isGlobal, escapeRgxp, testCache } from 'core/prelude/regexp/const';
import { createFlagsModifier } from 'core/prelude/regexp/helpers';

/** @see [[RegExpConstructor.escape]] */
extend(RegExp, 'escape', (value: unknown) => String(value).replace(escapeRgxp, '\\$1'));

/** @see [[RegExpConstructor.test]] */
extend(RegExp, 'test', (rgxp: RegExp | string, str?: string) => {
	if (Object.isString(rgxp)) {
		str = rgxp;
		return (rgxp) => RegExp.test(rgxp, <string>str);
	}

	if (str == null) {
		return (str) => RegExp.test(rgxp, str);
	}

	if (isGlobal.test(rgxp.flags)) {
		const testRgxp = testCache[rgxp.source] ?? rgxp.removeFlags('g');
		testCache[rgxp.source] = testRgxp;
		return testRgxp.test(str);
	}

	return rgxp.test(str);
});

/** @see [[RegExp.addFlags]] */
extend(RegExp.prototype, 'addFlags', function addFlags(this: RegExp, ...flags: RegExpFlag[]) {
	const set = new Set([...flags, ...this.flags].flatMap((str) => str.split('')));
	return new RegExp(this.source, [...set].join(''));
});

/** @see [[RegExpConstructor.addFlags]] */
extend(RegExp, 'addFlags', createFlagsModifier('addFlags'));

/** @see [[RegExp.removeFlags]] */
extend(RegExp.prototype, 'removeFlags', function addFlags(this: RegExp, ...flags: RegExpFlag[]) {
	const set = new Set(flags.flatMap((str) => str.split('')));
	return new RegExp(this.source, this.flags.split('').filter((flag) => !set.has(flag)).join(''));
});

/** @see [[RegExpConstructor.removeFlags]] */
extend(RegExp, 'removeFlags', createFlagsModifier('removeFlags'));

/** @see [[RegExp.setFlags]] */
extend(RegExp.prototype, 'setFlags', function addFlags(this: RegExp, ...flags: RegExpFlag[]) {
	const set = new Set(flags.flatMap((str) => str.split('')));
	return new RegExp(this.source, [...set].join(''));
});

/** @see [[RegExpConstructor.setFlags]] */
extend(RegExp, 'setFlags', createFlagsModifier('setFlags'));
