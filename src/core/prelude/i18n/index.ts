/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import config from '@src/config';

import { IS_NODE } from '@src/core/env';
import type { AsyncStorageNamespace } from '@src/core/kv-storage';

import { emitter, locale } from '@src/core/prelude/i18n/const';

export * from '@src/core/prelude/i18n/const';
export * from '@src/core/prelude/i18n/interface';

let
	storage: CanUndef<Promise<AsyncStorageNamespace>>;

//#if runtime has core/kv-storage
// eslint-disable-next-line prefer-const
storage = import('@src/core/kv-storage').then(({asyncLocal}) => asyncLocal.namespace('[[I18N]]'));
//#endif

if (IS_NODE) {
	setLocale(config.locale);

} else {
	locale.isInitialized = (async () => {
		try {
			const
				s = await storage,
				l = await s.get<string>('locale');

			if (l != null) {
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

	if (!IS_NODE && storage != null) {
		storage.then((storage) => Promise.all([
			storage.set('locale', value),
			storage.set('isLocaleDef', locale.isDefined)
		])).catch(stderr);
	}

	emitter.emit('setLocale', value, oldVal);
	return value;
}
