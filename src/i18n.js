'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { GLOBAL, IS_NODE } from './const/links';
import * as langs from './lang';

const
	$C = require('collection.js'),
	config = require('./config');

const
	ws = /[\r\n]+/g;

// Normalize translates
$C(langs).forEach((el) => {
	if (typeof el !== 'object') {
		return;
	}

	$C(el).forEach((el, key, data) => {
		data[key.replace(ws, ' ')] = el.replace(ws, ' ');
	});
});

/**
 * System language
 */
export let
	lang: ?string,
	isLangDef: ?boolean;

if (IS_NODE) {
	setLang(config.lang);

} else {
	try {
		const
			l = localStorage.getItem('SYSTEM_LANGUAGE');

		if (l && !{null: true, undefined: true}[l]) {
			setLang(l, Object.parse(localStorage.getItem('SYSTEM_LANGUAGE_DEF')));

		} else {
			setLang(config.lang, true);
		}

	} catch (_) {
		setLang(config.lang, true);
	}
}

const {format} = Date.prototype;
Date.prototype.format = function (str, locale) {
	const aliases = {
		humanTimeDate: '{HH}:{mm} {humanDate}',
		humanDate: lang === 'ru' ? '{dd}.{MM}.{yyyy}' : '{MM}.{dd}.{yyyy}'
	};

	const replace = (str) => str.replace(/{(humanTimeDate|humanDate)}/g, (str, $1) => replace(aliases[$1]));
	return format.call(this, replace(str), locale || lang);
};

/**
 * Sets a new system language
 *
 * @param [value]
 * @param [def] - if true, then the language is system default
 */
export function setLang(value: string, def?: boolean) {
	lang = value;
	isLangDef = Boolean(def);

	if (!IS_NODE) {
		try {
			localStorage.setItem('SYSTEM_LANGUAGE', value);
			localStorage.setItem('SYSTEM_LANGUAGE_DEF', isLangDef);

		} catch (_) {}
	}

	return lang;
}

/**
 * Global i18n function (string tag)
 */
GLOBAL.i18n = GLOBAL.t = function (strings: any | Array, ...expr?: any): ?string {
	if (strings == null) {
		return undefined;
	}

	if (!Object.isArray(strings)) {
		return i18n(strings);
	}

	let str = '';
	if (expr.length === 0) {
		for (let i = 0; i < strings.length; i++) {
			str += i18n(strings[i]);
		}

	} else {
		for (let i = 0; i < strings.length; i++) {
			str += i18n(strings[i]) + (i in expr ? expr[i] : '');
		}
	}

	return str;
};

/**
 * Global i18n helper function (string tag)
 */
GLOBAL.l = function (strings: any | Array, ...expr?: any): ?string {
	if (strings == null) {
		return undefined;
	}

	if (!Object.isArray(strings)) {
		return String(strings);
	}

	if (strings.length === 1) {
		return String(strings[0]);
	}

	let str = '';
	for (let i = 0; i < strings.length; i++) {
		str += strings[i] + (i in expr ? expr[i] : '');
	}

	return str;
};

/**
 * Base i18n function
 *
 * @param str
 * @param [defLang]
 */
function i18n(str: any, defLang?: string): string {
	str = String(str);
	defLang = defLang === undefined ? lang : defLang;

	if (defLang) {
		const w = langs[defLang] && langs[defLang][str];
		return w != null ? w : str;
	}

	return str;
}
