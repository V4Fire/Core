/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/prelude/i18n/README.md]]
 * @packageDocumentation
 */

import config from 'config';

import { IS_NODE } from 'core/env';

import { emitter, locale, region } from 'core/prelude/i18n/const';

import storage from 'core/prelude/i18n/storage';

export * from 'core/prelude/i18n/const';
export * from 'core/prelude/i18n/helpers';
export * from 'core/prelude/i18n/interface';

(['locale', 'region'] as const).forEach((type) => {
	if (IS_NODE) {
		setI18NParam(type, config[type]);

	} else {
		const value = storage.get<Language | Region>(type);

		if (value != null) {
			setI18NParam(type, value, storage.get<boolean>(`is${type.capitalize()}Def`));

		} else {
			setI18NParam(type, config[type], true);
		}
	}
});

/**
 * Sets a new application i18n param
 *
 * @param type
 * @param [value]
 * @param [def] - if true, the param is marked as default
 * @emits `setLocale(value: string, oldValue?: string) | setRegion(value: string, oldValue?: string)`
 */
export function setI18NParam(type: 'locale', value: CanUndef<Language>, def?: boolean): CanUndef<Language>;
export function setI18NParam(type: 'region', value: CanUndef<Region>, def?: boolean): CanUndef<Region>;
export function setI18NParam(type: 'locale' | 'region', value: CanUndef<Language | Region>, def?: boolean): CanUndef<Language | Region>;
export function setI18NParam(type: 'locale' | 'region', value: CanUndef<Language | Region>, def?: boolean): CanUndef<Language | Region> {
	const element = {
		locale,
		region
	}[type];

	const oldVal = element.value;

	if (value === oldVal) {
		return;
	}

	element.value = value;
	element.isDefault = Boolean(def);

	if (!IS_NODE && storage.set) {
		storage.set(type, value);
		storage.set(`is${type.capitalize()}Def`, element.isDefault);
	}

	emitter.emit(`set${type.capitalize()}`, value, oldVal);
	return value;
}

/**
 * @deprecated
 * @see [[setI18NParam]]
 */
export function setLocale(value: CanUndef<Language>, def?: boolean): CanUndef<Language> {
	return setI18NParam('locale', value, def);
}
