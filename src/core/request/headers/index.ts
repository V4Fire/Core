/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/headers/README.md]]
 * @packageDocumentation
 */

import { applyQueryForStr } from 'core/request/helpers/interpolation';

import { requestQuery } from 'core/request/headers/const';
import type { HeadersForEachCb } from 'core/request/headers/interface';

export * from 'core/request/headers/interface';

export default class Headers {
	/**
	 * Request query object (to interpolate values from headers)
	 */
	[requestQuery]?: Dictionary;

	/**
	 * @param [headers] - headers to initialize
	 * @param [query] - request query object (to interpolate values from headers)
	 */
	constructor(headers?: Dictionary<CanArray<string>> | Headers, query?: Dictionary) {
		Object.defineProperty(this, requestQuery, {
			enumerable: false,
			configurable: false,
			writable: true,
			value: query
		});

		if (headers != null) {
			const
				iter = headers instanceof Headers ? headers.entries() : Object.entries(headers);

			for (const [name, value] of iter) {
				if (value != null) {
					this.set(name, value);
				}
			}
		}
	}

	/**
	 * Returns an iterator allowing to go through all key-value pairs of headers
	 */
	[Symbol.iterator](): IterableIterator<[string, string]> {
		return this.entries();
	}

	/**
	 * Returns a header' value by the specified name
	 * @param name
	 */
	get(name: string): string | null {
		return this[this.normalizeHeaderName(name)] ?? null;
	}

	/**
	 * Returns true if the structure contains a header by the specified name
	 * @param name
	 */
	has(name: string): boolean {
		return this.normalizeHeaderName(name) in this;
	}

	/**
	 * Sets a new header' value by the specified name.
	 * To set multiple values for one header, provide its value as a list of values.
	 *
	 * @param name
	 * @param value
	 */
	set(name: string, value: CanArray<string>): void {
		const
			normalizedName = this.normalizeHeaderName(name);

		if (normalizedName === '') {
			return;
		}

		if (Object.isArray(value)) {
			value.forEach((val) => this.append(name, val));
			return;
		}

		Object.defineProperty(this, normalizedName, {
			enumerable: true,
			configurable: true,
			writable: true,
			value: this.normalizeHeaderValue(value)
		});
	}

	/**
	 * Appends a new value into an existing header or adds the header if it does not already exist
	 *
	 * @param name
	 * @param value
	 */
	append(name: string, value: string): void {
		const
			normalizedName = this.normalizeHeaderName(name);

		if (normalizedName === '') {
			return;
		}

		const
			currentVal = this[normalizedName],
			newVal = currentVal != null ? `${currentVal}, ${this.normalizeHeaderValue(value)}` : value;

		this.set(name, newVal);
	}

	/**
	 * Deletes a header by the specified name
	 * @param name
	 */
	delete(name: string): void {
		delete this[this.normalizeHeaderName(name)];
	}

	/**
	 * Iterates over the headers and invokes the given callback function at each header
	 *
	 * @param cb
	 * @param [thisArg] - value to use as `this` when executing callback
	 */
	forEach(cb: HeadersForEachCb, thisArg?: any): void {
		for (const [key, value] of this.entries()) {
			cb.call(thisArg, value, key, this);
		}
	}

	/**
	 * Returns an iterator over headers' values
	 */
	values(): IterableIterator<string> {
		return Object.values(this).values();
	}

	/**
	 * Returns an iterator over headers' names
	 */
	keys(): IterableIterator<string> {
		return Object.keys(this).values();
	}

	/**
	 * Returns an iterator over headers.
	 * It produces tuples with headers' names and values.
	 */
	entries(): IterableIterator<[string, string]> {
		return Object.entries(this).values();
	}

	/**
	 * Normalizes the specified header name
	 * @param name
	 */
	protected normalizeHeaderName(name: string): string {
		return applyQueryForStr(String(name).trim(), this[requestQuery]).toLowerCase();
	}

	/**
	 * Normalizes the specified header value
	 * @param value
	 */
	protected normalizeHeaderValue(value: unknown): string {
		return applyQueryForStr(String(value != null ? value : '').trim(), this[requestQuery]);
	}
}
