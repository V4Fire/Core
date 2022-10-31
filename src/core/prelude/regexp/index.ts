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

import { isString } from 'core/prelude/types';

/** @see [[RegExpConstructor.escape]] */
export const escape = extend<typeof RegExp.escape>(RegExp, 'escape', (value: unknown) => String(value).replace(escapeRgxp, '\\$1'));

/** @see [[RegExp.addFlags]] */
export const addFlags = extend<typeof RegExp.addFlags>(RegExp.prototype, 'addFlags', function addFlags(this: RegExp, ...flags: RegExpFlag[]) {
	const set = new Set([...flags, ...this.flags].flatMap((str) => str.split('')));
	return new RegExp(this.source, [...set].join(''));
});

/** @see [[RegExp.removeFlags]] */
export const removeFlags = extend<typeof RegExp.removeFlags>(RegExp.prototype, 'removeFlags', function addFlags(this: RegExp, ...flags: RegExpFlag[]) {
	const set = new Set(flags.flatMap((str) => str.split('')));
	return new RegExp(this.source, this.flags.split('').filter((flag) => !set.has(flag)).join(''));
});

/** @see [[RegExpConstructor.test]] */
export const test = extend<typeof RegExp.test>(RegExp, 'test', (rgxp: RegExp | string, str?: string) => {
	if (isString(rgxp)) {
		str = rgxp;
		return (rgxp) => RegExp.test(rgxp, <string>str);
	}

	if (str == null) {
		return (str) => RegExp.test(rgxp, str);
	}

	if (isGlobal.test(rgxp.flags)) {
		const testRgxp = testCache[rgxp.source] ?? removeFlags(rgxp, 'g');
		testCache[rgxp.source] = testRgxp;
		return testRgxp.test(str);
	}

	return rgxp.test(str);
});

/** @see [[RegExp.setFlags]] */
export const setFlags = extend<typeof RegExp.setFlags>(RegExp.prototype, 'setFlags', function addFlags(this: RegExp, ...flags: RegExpFlag[]) {
	const set = new Set(flags.flatMap((str) => str.split('')));
	return new RegExp(this.source, [...set].join(''));
});

//#if standalone/prelude
/** @see [[RegExpConstructor.addFlags]] */
extend(RegExp, 'addFlags', createFlagsModifier('addFlags'));

/** @see [[RegExpConstructor.removeFlags]] */
extend(RegExp, 'removeFlags', createFlagsModifier('removeFlags'));

/** @see [[RegExpConstructor.setFlags]] */
extend(RegExp, 'setFlags', createFlagsModifier('setFlags'));
//#endif
