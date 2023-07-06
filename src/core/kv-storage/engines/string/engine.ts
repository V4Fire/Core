/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { ClearFilter } from 'core/kv-storage/interface';

import { defaultDataSeparators } from 'core/kv-storage/engines/string/const';
import type { StorageOptions, DataSeparators } from 'core/kv-storage/engines/string/interface';

export default class StringEngine {
	/**
	 * Serialized storage data
	 */
	get serializedData(): string {
		return this.data;
	}

	/**
	 * Serialized storage data
	 */
	protected data: string;

	/**
	 * Separators for keys and values for serialization into a string
	 */
	protected separators: DataSeparators = defaultDataSeparators;

	/**
	 * Replaces serialized storage data with new ones
	 */
	protected set serializedData(data: string) {
		this.data = data;
	}

	/**
	 * @param [opts] - additional options
	 */
	constructor(opts: StorageOptions = {}) {
		this.data = opts.data ?? '';
		Object.assign(this.separators, opts.separators);
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
	get(key: string): CanUndef<string> {
		return this.getDataFromRaw()[key];
	}

	/**
	 * Stores a value to the storage by the specified key
	 *
	 * @param key
	 * @param value
	 */
	set(key: string, value: string): void {
		const
			separators = Object.values(this.separators),
			isForbiddenCharacterUsed = separators.some((el) => key.includes(el) || String(value).includes(el));

		if (isForbiddenCharacterUsed) {
			throw new TypeError(`Forbidden character used in the string storage key: ${key}, value: ${String(value)}`);
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
	 * Clears either the entire data storage or records that match the specified filter
	 * @param filter
	 */
	clear(filter?: ClearFilter<string>): void {
		if (filter != null) {
			const
				state = this.getDataFromRaw();

			Object.entries(state).forEach(([key, value]) => {
				if (filter(Object.cast(value), key) === true) {
					delete state[key];
				}
			});

			this.overwriteData(state);

		} else {
			this.overwriteData({});
		}
	}

	/**
	 * Update the data in the storage with the data passed from the dictionary
	 * @param data - the dictionary with the data to be added to the storage
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
	 * Overwrites the data in the storage with the new data from the passed dictionary
	 * @param data - the dictionary with the data to be saved in the storage
	 */
	protected overwriteData(data: Dictionary<string>): void {
		const s = this.separators;

		this.serializedData = Object.entries(data)
			.map(([key, value]) => `${key}${s.record}${value}`)
			.join(s.chunk);
	}

	/**
	 * Returns data parsed as a dictionary from the serialized data string
	 */
	protected getDataFromRaw(): Dictionary<string> {
		const {serializedData} = this;

		if (serializedData === '') {
			return {};
		}

		const s = this.separators;

		return serializedData.split(s.chunk).reduce((acc, el) => {
			const [key, value] = el.split(s.record);
			acc[key] = value;
			return acc;
		}, {});
	}
}
