/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import * as langDict from 'lang';
import { locale } from 'core/prelude/i18n/const';

const
	ws = /[\r\n]+/g;

// Normalize translates
Object.forEach(langDict, (el) => {
	if (typeof el !== 'object') {
		return el;
	}

	const
		map = Object.createDict();

	Object.forEach(el, (el, key) => {
		map[String(key).replace(ws, ' ')] = String(el).replace(ws, ' ');
		return map;
	});
});

/** @see [[i18n]] */
extend(globalThis, 'i18n', globalI18n);

/** @see [[t]] */
extend(globalThis, 't', globalI18n);

/** @see [[l]] */
extend(globalThis, 'l', (strings: unknown | string[], ...exprs: unknown[]): string => {
	if (strings == null) {
		return '';
	}

	if (Object.isArray(strings)) {
		if (strings.length === 1) {
			return String(strings[0]);
		}

		let
			str = '';

		for (let i = 0; i < strings.length; i++) {
			str += String(strings[i]) + (i in exprs ? String(exprs[i]) : '');
		}

		return str;
	}

	return String(strings);
});

function globalI18n(strings: unknown | string[], ...exprs: unknown[]): string {
	if (strings == null) {
		return '';
	}

	if (!Object.isArray(strings)) {
		return localI18n(strings);
	}

	let str = '';
	if (exprs.length === 0) {
		for (let i = 0; i < strings.length; i++) {
			str += localI18n(strings[i]);
		}

	} else {
		for (let i = 0; i < strings.length; i++) {
			str += localI18n(strings[i]) + (i in exprs ? String(exprs[i]) : '');
		}
	}

	return str;
}

function localI18n(val: unknown, customLocale?: string): string {
	const
		str = String(val),
		localeName = customLocale == null ? locale.value : customLocale;

	if (Object.isTruly(localeName)) {
		const w = langDict[localeName]?.[str];
		return w != null ? String(w) : str;
	}

	return str;
}
