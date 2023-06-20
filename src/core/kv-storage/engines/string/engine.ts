/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { ClearFilter } from 'core/kv-storage/interface';
import { stringStorageSeparators } from 'core/kv-storage/engines/string/const';

export default class StringEngine {
	/**
	 * Raw string with data
	 */
	protected stringStorage: string;

	/**
	 * @param initString - Initial value for storage
	 */
	constructor(initString: string = '') {
		this.stringStorage = initString;
	}

	/**
	 * Returns true if a value by the specified key exists in the storage
	 * @param key
	 */
	has(key: string): boolean {
		return key in this.getDataFromRaw();
	}

	/**
	 * Returns a value from the storage by the specified key
	 * @param key
	 */
	get(key: string): CanUndef<Primitive> {
		const value = this.getDataFromRaw()[key];
		return value != null ? JSON.parse(value) : value;
	}

	/**
	 * Saves a value to the storage by the specified key
	 *
	 * @param key
	 * @param value
	 */
	set(key: string, value: Primitive): void {
		const
			dividersValues = Object.values(stringStorageSeparators),
			isForbiddenCharacterUsed = dividersValues.some((el) => key.includes(el) || String(value).includes(el));

		if (isForbiddenCharacterUsed) {
			throw new TypeError(`Forbidden character used in the cookie storage key: ${key}, value: ${String(value)}`);
		}

		this.updateData({[key]: String(value)});
	}

	/**
	 * Removes a value from the storage by the specified key
	 * @param key
	 */
	remove(key: string): void {
		this.updateData({[key]: undefined});
	}

	/**
	 * Clears the storage by the specified filter
	 * @param filter
	 */
	clear(filter?: ClearFilter<string>): void {
		if (filter != null) {
			const
				state = this.getDataFromRaw();

			Object.entries(state).forEach(([key, value]) => {
				if (filter(<string>value, key) === true) {
					delete state[key];
				}
			});

			this.overwriteData(state);

		} else {
			this.overwriteData({});
		}
	}

	/**
	 * Returns raw data
	 */
	protected getRawData(): string {
		return this.stringStorage;
	}

	/**
	 * Overrides raw data with the passed value
	 */
	protected setRawData(value: string): void {
		this.stringStorage = value;
	}

	/**
	 * Updates the data stored in the storage
	 * @param data - values to update in the storage
	 */
	protected updateData(data: Dictionary<CanUndef<string>>): void {
		const
			currentState = this.getDataFromRaw();

		Object.entries(data).forEach(([key, value]) => {
			if (value === undefined) {
				delete currentState[key];

			} else {
				currentState[key] = value;
			}
		});

		this.overwriteData(currentState);
	}

	/**
	 * Returns data in dictionary format
	 */
	protected getDataFromRaw(): Dictionary<string> {
		return this.getRawData().split(stringStorageSeparators.keys).reduce((acc, el) => {
			const [key, value] = el.split(stringStorageSeparators.values);
			acc[key] = value;
			return acc;
		}, {});
	}

	/**
	 * Overwrites the storage with the passed data
	 * @param data
	 */
	protected overwriteData(data: Dictionary<string>): void {
		const rawCookie = Object.entries(data)
			.map(([key, value]) => `${key}${stringStorageSeparators.values}${value}`)
			.join(stringStorageSeparators.keys);

		this.setRawData(rawCookie);
	}
}
