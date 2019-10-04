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

import { GLOBAL, IS_NODE } from 'core/env';
import { AsyncNamespace } from 'core/kv-storage';
import { EventEmitter2 as EventEmitter } from 'eventemitter2';

export const
	event = new EventEmitter({maxListeners: 100, newListener: false});

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
	isInitialized: Promise<void> = Promise.resolve(),
	data: {locale:string, isLocaleDef: boolean} = {locale: '', isLocaleDef: false};

if (IS_NODE) {
	setLocale(config.locale);

} else {
	isInitialized = (async () => {
		try {
			const
				s = await storage,
				l = await s.get<string>('locale');

			if (l) {
				setLocale(l, await s.get<boolean>('isLocaleDef'));
				return;
			}

			throw new Error('Default language');

		} catch {
			setLocale(config.locale, true);
		}
	})();
}

/**
 * Sets a new system language
 *
 * @param [value]
 * @param [def] - if true, then the language is system default
 * @emits setLocale(value: string, oldValue?: string)
 */
export function setLocale(value: string, def?: boolean): string {
	const
		oldLang = data.locale;

	data.locale = value;
	data.isLocaleDef = Boolean(def);

	if (!IS_NODE && storage) {
		storage.then((storage) => Promise.all([
			storage.set('locale', value),
			storage.set('isLocaleDef', data.isLocaleDef)
		])).catch(stderr);
	}

	event.emit('setLocale', data.locale, oldLang);
	return data.locale;
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
	defLang = defLang === undefined ? data.locale : defLang;

	if (defLang) {
		const w = langs[defLang] && langs[defLang][str];
		return w != null ? String(w) : str;
	}

	return str;
}
