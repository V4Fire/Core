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
import type { RawHeaders, HeadersForEachCb } from 'core/request/headers/interface';

export * from 'core/request/headers/interface';

/**
 * Class to create a set of HTTP headers
 */
export default class V4Headers {
	/**
	 * Request query object (to interpolate values from headers)
	 */
	[requestQuery]?: Dictionary;

	/**
	 * @param [headers] - headers to initialize
	 * @param [query] - request query object (to interpolate values from headers)
	 */
	constructor(headers?: RawHeaders, query?: Dictionary) {
		Object.defineProperty(this, requestQuery, {
			enumerable: false,
			configurable: false,
			writable: true,
			value: query
		});

		if (Object.isString(headers)) {
			let
				lastHeaderName = '';

			for (let o = headers.split(/[\r\n]+/), i = 0; i < o.length; i++) {
				const
					header = o[i].trim();

				if (header === '') {
					continue;
				}

				const
					headerChunks = header.split(':', 2);

				if (headerChunks.length === 2) {
					lastHeaderName = headerChunks[0];
					headerChunks.shift();
				}

				const
					value = <CanUndef<string>>headerChunks[0];

				if (value != null) {
					this.append(lastHeaderName, value.split(','));
				}
			}

		} else if (headers != null) {
			let
				iter;

			// eslint-disable-next-line @typescript-eslint/unbound-method
			if (headers instanceof V4Headers || Object.isFunction(headers.entries)) {
				iter = Object.cast<Headers>(headers).entries();

			} else {
				iter = Object.entries(headers);
			}

			for (const [name, value] of iter) {
				if (value != null) {

					const prevValue = this.get(name);
					if (prevValue != null) {
						const newValue = [prevValue, value].join(', ');
						this.set(name, newValue);
					} else {
						this.set(name, value);
					}
				}
			}
		}
	}

	/**
	 * Returns an iterator over headers.
	 * It produces tuples with headers' names and values.
	 */
	[Symbol.iterator](): IterableIterator<[string, string]> {
		return this.entries();
	}

	/**
	 * Returns a header value by the specified name
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
	 * Sets a new header value by the specified name.
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
			this.delete(name);
			value.forEach((val) => this.append(name, val));
			return;
		}

		Object.defineProperty(this, normalizedName, {
			configurable: true,
			enumerable: true,
			writable: true,
			value: this.normalizeHeaderValue(value)
		});
	}

	/**
	 * Appends a new value into an existing header or adds the header if it does not already exist.
	 * To set multiple values for one header, provide its value as a list of values.
	 *
	 * @param name
	 * @param value
	 */
	append(name: string, value: CanArray<string>): void {
		const
			normalizedName = this.normalizeHeaderName(name),
			normalizedVal = this.normalizeHeaderValue(value);

		if (normalizedName === '' || normalizedVal === '') {
			return;
		}

		if (Object.isArray(value)) {
			value.forEach((val) => this.append(name, val));
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
		delete this[name];
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
