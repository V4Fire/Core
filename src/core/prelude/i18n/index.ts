/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';

import { IS_NODE } from 'core/env';

import { emitter, locale } from 'core/prelude/i18n/const';

import storage from 'core/prelude/i18n/storage';

export * from 'core/prelude/i18n/const';
export * from 'core/prelude/i18n/interface';

if (IS_NODE) {
	setLocale(config.locale);

} else {
	(() => {
		if (storage) {
			const locale = storage.get<string>('locale');

			if (locale != null) {
				setLocale(locale, storage.get<boolean>('isLocaleDef'));
				return;
			}
		}

		setLocale(config.locale, true);
	})();
}

/**
 * Sets a new system language
 *
 * @param [value]
 * @param [def] - if true, then the language is marked as default
 * @emits `setLocale(value: string, oldValue?: string)`
 */
export function setLocale(value: string | undefined, def?: boolean): string | undefined {
	const
		oldVal = locale.value;

	if (value === oldVal) {
		return;
	}

	locale.value = value;
	locale.isDefault = Boolean(def);

	if (!IS_NODE && storage != null) {
		storage.set('locale', value);
		storage.set('isLocaleDef', locale.isDefault);
	}

	emitter.emit('setLocale', value, oldVal);
	return value;
}
