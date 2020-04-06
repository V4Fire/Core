/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from 'config';

import { IS_NODE } from 'core/env';
import { AsyncNamespace } from 'core/kv-storage';
import { emitter, locale } from 'core/prelude/i18n/const';

export * from 'core/prelude/i18n/const';
export * from 'core/prelude/i18n/interface';

let
	storage: CanUndef<Promise<AsyncNamespace>>;

//#if runtime has core/kv-storage
storage = import('core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[I18N]]'));
//#endif

if (IS_NODE) {
	setLocale(config.locale);

} else {
	locale.isInitialized = (async () => {
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
 * @param [def] - if true, then the language is marked as default
 * @emits `setLocale(value: string, oldValue?: string)`
 */
export function setLocale(value: string, def?: boolean): string {
	const
		oldVal = locale.value;

	locale.value = value;
	locale.isDefined = Boolean(def);

	if (!IS_NODE && storage) {
		storage.then((storage) => Promise.all([
			storage.set('locale', value),
			storage.set('isLocaleDef', locale.isDefined)
		])).catch(stderr);
	}

	emitter.emit('setLocale', value, oldVal);
	return value;
}
