/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';
import * as dict from 'lang';

import { asyncLocal } from 'core/kv-storage';
import { GLOBAL, IS_NODE } from 'core/const/links';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

export const
	event = new EventEmitter({maxListeners: 100});

const
	langs = [],
	storage = asyncLocal.namespace('[[I18N]]'),
	ws = /[\r\n]+/g;

// Normalize translates
Object.forEach(dict, (el) => {
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

/**
 * System language
 */
export let
	lang: string,
	isLangDef: boolean,
	isInitialized: Promise<void> = Promise.resolve();

if (IS_NODE) {
	setLang(config.lang);

} else {
	isInitialized = (async () => {
		try {
			const
				l = await storage.get<string>('lang');

			if (l) {
				setLang(l, await storage.get<boolean>('isLangDef'));
				return;
			}

			throw new Error('Default language');

		} catch {
			setLang(config.lang, true);
		}
	})();
}

/**
 * Sets a new system language
 *
 * @param [value]
 * @param [def] - if true, then the language is system default
 * @emits setLang(value: string, oldValue?: string)
 */
export function setLang(value: string, def?: boolean): string {
	const
		oldLang = lang;

	lang = value;
	isLangDef = Boolean(def);

	if (!IS_NODE) {
		storage.set('lang', value).catch(stderr);
		storage.set('isLangDef', isLangDef).catch(stderr);
	}

	event.emit('setLang', lang, oldLang);
	return lang;
}

/**
 * Global i18n function (string tag)
 */
GLOBAL.i18n = GLOBAL.t = function t(strings: unknown | string[], ...exprs: unknown[]): string {
	if (strings == null) {
		return '';
	}

	if (!Object.isArray(strings)) {
		return i18n(strings);
	}

	let str = '';
	if (exprs.length === 0) {
		for (let i = 0; i < strings.length; i++) {
			str += i18n(strings[i]);
		}

	} else {
		for (let i = 0; i < strings.length; i++) {
			str += i18n(strings[i]) + (i in exprs ? exprs[i] : '');
		}
	}

	return str;
};

/**
 * Global i18n helper function (string tag)
 */
GLOBAL.l = function l(strings: unknown | string[], ...exprs: unknown[]): string {
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
			str += strings[i] + (i in exprs ? String(exprs[i]) : '');
		}

		return str;
	}

	return String(strings);
};

/**
 * Base i18n function
 *
 * @param val
 * @param [defLang]
 */
function i18n(val: unknown, defLang?: string): string {
	const str = String(val);
	defLang = defLang === undefined ? lang : defLang;

	if (defLang) {
		const w = langs[defLang] && langs[defLang][str];
		return w != null ? String(w) : str;
	}

	return str;
}
