/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { SyncStorage } from 'core/kv-storage';

export interface Locale {
	/**
	 * The locale value
	 */
	value: CanUndef<Language>;

	/**
	 * True if the locale is default
	 */
	isDefault: boolean;
}

export interface LocaleKVStorage {
	get: SyncStorage['get'];

	/**
	 * Set is optional for read only storage
	 */
	set?: SyncStorage['set'];
}

export type PluralizationCount = StringPluralizationForms | string | number;
