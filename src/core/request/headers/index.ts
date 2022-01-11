/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { HeadersInit } from 'core/request/headers/interface';
import { normalizeHeaderName, normalizeHeaderValue, validateHeader } from 'core/request/utils';

export * from 'core/request/headers/interface';

export default class Headers {
	/**
	 * Container that holds normalized key-value pairs of headers
	 */
	protected readonly headers: Map<string, string>;

	/**
	 * @param init - initial headers
	 */
	constructor(init?: HeadersInit) {
		this.headers = new Map();

		if (init != null) {
			const iter = <Iterable<[string, string]>>(Symbol.iterator in init ? init : Object.entries(init));

			for (const [name, value] of iter) {
				this.set(name, value);
			}
		}
	}

	/**
	 * Appends a new value onto an existing header, or adds the header if it does not already exist.
	 *
	 * @param name - name of header to append
	 * @param value - value of header to append
	 */
	append(name: string, value: string): void {
		const
			normalizedName = normalizeHeaderName(name),
			normalizedValue = normalizeHeaderValue(value),
			currentValue = this.headers.get(normalizedName),
			error = validateHeader(normalizedName, normalizedValue);

		if (error) {
			throw error;
		}

		const newValue = currentValue != null ? `${currentValue}, ${normalizedValue}` : normalizedValue;

		this.headers.set(normalizedName, newValue);
	}

	/**
	 * Deletes a header with a given name.
	 *
	 * @param name - name of header to delete
	 */
	delete(name: string): void {
		const
			normalizedName = normalizeHeaderName(name),
			error = validateHeader(normalizedName);

		if (error) {
			throw error;
		}

		this.headers.delete(normalizedName);
	}

	/**
	 * Returns an iterator allowing to go through all key-value pairs of headers
	 */
	entries(): IterableIterator<[string, string]> {
		return this.headers.entries();
	}

	/**
	 * Executes a provided function once for each header
	 *
	 * @param cb - function to execute on each header
	 * @param [thisArg] - value to use as this when executing callback
	 */
	forEach(cb: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
		for (const [key, value] of this.entries()) {
			cb.call(thisArg, value, key, this);
		}
	}

	/**
	 * Returns a String sequence of all the values of a header with a given name
	 *
	 * @param name - name of header to get
	 */
	get(name: string): string | null {
		const
			normalizedName = normalizeHeaderName(name),
			error = validateHeader(normalizedName);

		if (error) {
			throw error;
		}

		return this.headers.get(normalizedName) ?? null;
	}

	/**
	 * Returns a boolean stating whether this object contains a header with a given name
	 *
	 * @param name - name of header to check
	 */
	has(name: string): boolean {
		const
			normalizedName = normalizeHeaderName(name),
			error = validateHeader(normalizedName);

		if (error) {
			throw error;
		}

		return this.headers.has(normalizedName);
	}

	/**
	 * Returns an iterator allowing you to go through all keys of headers contained in this object
	 */
	*keys(): IterableIterator<string> {
		for (const [name] of this.entries()) {
			yield name;
		}
	}

	/**
	 * Sets a new value for an existing header, or adds the header if it does not already exist
	 *
	 * @param name - name of header to set
	 * @param value - value of header to set
	 */
	set(name: string, value: string): void {
		const
			normalizedName = normalizeHeaderName(name),
			normalizedValue = normalizeHeaderValue(value),
			error = validateHeader(normalizedName);

		if (error) {
			throw error;
		}

		this.headers.set(normalizedName, normalizedValue);
	}

	/**
	 * Returns an iterator allowing you to go through all values of headers
	 */
	*values(): IterableIterator<string> {
		for (const [, value] of this.entries()) {
			yield value;
		}
	}

	/**
	 * Returns an iterator allowing to go through all key-value pairs of headers
	 */
	[Symbol.iterator](): IterableIterator<[string, string]> {
		return this.entries();
	}
}
