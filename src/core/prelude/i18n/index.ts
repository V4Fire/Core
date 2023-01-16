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

import { emitter, locale } from 'core/prelude/i18n/const';

import storage from 'core/prelude/i18n/storage';

export * from 'core/prelude/i18n/const';
export * from 'core/prelude/i18n/helpers';
export * from 'core/prelude/i18n/interface';

if (IS_NODE) {
	setLocale(config.locale);

} else {
	const locale = storage.get<Language>('locale');

	if (locale != null) {
		setLocale(locale, storage.get<boolean>('isLocaleDef'));

	} else {
		setLocale(config.locale, true);
	}
}

/**
 * Sets a new application language
 *
 * @param [value]
 * @param [def] - if true, the language is marked as default
 * @emits `setLocale(value: string, oldValue?: string)`
 */
export function setLocale(value: CanUndef<Language>, def?: boolean): CanUndef<Language> {
	const
		oldVal = locale.value;

	if (value === oldVal) {
		return;
	}

	locale.value = value;
	locale.isDefault = Boolean(def);

	if (!IS_NODE && storage.set) {
		storage.set('locale', value);
		storage.set('isLocaleDef', locale.isDefault);
	}

	emitter.emit('setLocale', value, oldVal);
	return value;
}
