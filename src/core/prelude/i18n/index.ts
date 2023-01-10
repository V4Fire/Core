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

export * from 'core/prelude/i18n/const';
export * from 'core/prelude/i18n/helpers';
export * from 'core/prelude/i18n/interface';

const storage = import('core/prelude/i18n/storage').then((storage) => storage.default);

if (IS_NODE) {
	setLocale(config.locale);

} else {
	(async () => {
		const
			s = await storage,
			l = s.get('locale');

		if (l != null) {
			setLocale(s.get('locale'), s.get('isLocaleDef'));

		} else {
			setLocale(config.locale, true);
		}
	})();
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

	if (!IS_NODE) {
		void storage.then((storage) => {
			storage.set('locale', value);
			storage.set('isLocaleDef', locale.isDefault);
		});
	}

	emitter.emit('setLocale', value, oldVal);
	return value;
}
