/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import config from 'config';
import * as dict from 'lang';

import { GLOBAL, IS_NODE } from 'core/const/links';
import { AsyncNamespace } from 'core/kv-storage';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

export const
	event = new EventEmitter({maxListeners: 100});

const
	langs = [],
	ws = /[\r\n]+/g;

let
	storage: CanUndef<Promise<AsyncNamespace>>;

//#if runtime has core/kv-storage
storage = import('core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[I18N]]'));
//#endif

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
				s = await storage,
				l = await s.get<string>('lang');

			if (l) {
				setLang(l, await s.get<boolean>('isLangDef'));
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

	if (!IS_NODE && storage) {
		storage.then((storage) => Promise.all([
			storage.set('lang', value),
			storage.set('isLangDef', isLangDef)
		])).catch(stderr);
	}

	event.emit('setLang', lang, oldLang);
	return lang;
}

extend(GLOBAL, 'i18n', globalI18n);
extend(GLOBAL, 't', globalI18n);

/**
 * Global i18n helper function (string tag)
 */
extend(GLOBAL, 'l', (strings: unknown | string[], ...exprs: unknown[]): string => {
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
});

/**
 * Global i18n function (string tag)
 */
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
			str += localI18n(strings[i]) + (i in exprs ? exprs[i] : '');
		}
	}

	return str;
}

/**
 * Base i18n function
 *
 * @param val
 * @param [defLang]
 */
function localI18n(val: unknown, defLang?: string): string {
	const str = String(val);
	defLang = defLang === undefined ? lang : defLang;

	if (defLang) {
		const w = langs[defLang] && langs[defLang][str];
		return w != null ? String(w) : str;
	}

	return str;
}
