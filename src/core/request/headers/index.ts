/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { HeadersInit } from 'core/request/headers/interface';
import { normalizeHeaderName, normalizeHeaderValue } from 'core/request/utils';

export * from 'core/request/headers/interface';

export default class Headers {
	protected readonly headers: Map<string, string>;

	constructor(init?: HeadersInit) {
		this.headers = new Map();

		let iter;

		if (init instanceof Headers) {
			iter = init.entries();
		} else if (Array.isArray(init)) {
			iter = init;
		} else if (init != null) {
			iter = Object.entries(init);
		}

		for (const [name, value] of iter) {
			this.set(name, value);
		}
	}

	append(name: string, value: string): void {
		const
			normalizedName = normalizeHeaderName(name),
			normalizedValue = normalizeHeaderValue(value),
			currentValue = this.headers.get(normalizedName),
			error = validateHeader(normalizedName, normalizedValue);

		if (error) {
			throw error;
		}

		const newValue = currentValue != null ? `${currentValue},${normalizedValue}` : normalizedValue;

		this.headers.set(normalizedName, newValue);
	}

	delete(name: string): void {
		const
			normalizedName = normalizeHeaderName(name),
			error = validateHeader(normalizedName);

		if (error) {
			throw error;
		}

		this.headers.delete(normalizedName);
	}

	entries(): IterableIterator<[string, string]> {
		return this.headers.entries();
	}

	forEach(cb: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
		for (const [key, value] of this.entries()) {
			cb.call(thisArg, value, key, this);
		}
	}

	get(name: string): string | null {
		const
			normalizedName = normalizeHeaderName(name),
			error = validateHeader(normalizedName);

		if (error) {
			throw error;
		}

		return this.headers.get(normalizedName) ?? null;
	}

	has(name: string): boolean {
		const
			normalizedName = normalizeHeaderName(name),
			error = validateHeader(normalizedName);

		if (error) {
			throw error;
		}

		return this.headers.has(normalizedName);
	}

	*keys(): IterableIterator<string> {
		for (const [name] of this.entries()) {
			yield name;
		}
	}

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

	*values(): IterableIterator<string> {
		for (const [_, value] of this.entries()) {
			yield value;
		}
	}

	[Symbol.iterator](): IterableIterator<[string, string]> {
		return this.entries();
	}
}

function validateHeader(name: string, value?: string): TypeError | undefined {
	if (name === '') {
		return new TypeError(`Invalid header name: ${name}`);
	}

	if (value === '') {
		return new TypeError(`Invalid header value: ${value}`);
	}
}
