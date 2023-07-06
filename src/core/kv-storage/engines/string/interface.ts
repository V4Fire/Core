/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface StorageOptions {
	/**
	 * Initial data for the storage, serialized into a string
	 */
	data?: string;

	/**
	 * Separators for keys and values for serialization into a string
	 */
	separators?: DataSeparators;
}

export interface DataSeparators {
	/**
	 * This separator separates one "key-value" pair from another
	 * @default `'{{#}}'`
	 */
	chunk: string;

	/**
	 * This separator separates the key from the value
	 * @default `'{{.}}'`
	 */
	record: string;
}
