import type {

	BasicHeadersInit,
	HeaderName,
	HeaderValue,
	NormalizedHeaderName,
	NormalizedHeaderValue

} from 'core/request/headers/interface';

export * from 'core/request/headers/const';
export * from 'core/request/headers/interface';

export default class Headers {
	protected readonly headers: Map<NormalizedHeaderName, NormalizedHeaderValue>;

	constructor(init?: BasicHeadersInit) {
		this.headers = new Map();

		if (init instanceof Headers) {
			for (const [name, value] of init.entries()) {
				this.set(name, value);
			}
		} else if (Array.isArray(init)) {
			for (const [name, value] of init) {
				this.set(name, value);
			}
		} else if (init != null) {
			for (const name of Object.keys(init)) {
				this.set(name, <string>init[name]);
			}
		}
	}

	append(name: HeaderName, value: HeaderValue): void {
		const
			normalizedName = this.normalizeName(name),
			normalizedValue = this.normalizeValue(value),
			currentValue = this.headers.get(normalizedName),
			error = this.validate(normalizedName, normalizedValue);

		if (error) {
			throw error;
		}

		const newValue = currentValue != null ? `${currentValue},${normalizedValue}` : normalizedValue;

		this.headers.set(normalizedName, newValue);
	}

	delete(name: HeaderName): void {
		const
			normalizedName = this.normalizeName(name),
			error = this.validate(normalizedName);

		if (error) {
			throw error;
		}

		this.headers.delete(normalizedName);
	}

	entries(): IterableIterator<[NormalizedHeaderName, NormalizedHeaderValue]> {
		return this.headers.entries();
	}

	forEach(cb: (value: NormalizedHeaderValue, key: NormalizedHeaderName, parent: Headers) => void, thisArg?: any): void {
		for (const [key, value] of this.entries()) {
			cb.call(thisArg, value, key, this);
		}
	}

	get(name: HeaderName): NormalizedHeaderValue | null {
		const
			normalizedName = this.normalizeName(name),
			error = this.validate(normalizedName);

		if (error) {
			throw error;
		}

		return this.headers.get(normalizedName) ?? null;
	}

	has(name: HeaderName): boolean {
		const
			normalizedName = this.normalizeName(name),
			error = this.validate(normalizedName);

		if (error) {
			throw error;
		}

		return this.headers.has(normalizedName);
	}

	*keys(): IterableIterator<NormalizedHeaderName> {
		for (const [name] of this.entries()) {
			yield name;
		}
	}

	set(name: HeaderName, value: HeaderValue): void {
		const
			normalizedName = this.normalizeName(name),
			normalizedValue = this.normalizeValue(value),
			error = this.validate(normalizedName);

		if (error) {
			throw error;
		}

		this.headers.set(normalizedName, normalizedValue);
	}

	*values(): IterableIterator<HeaderValue> {
		for (const [_, value] of this.entries()) {
			yield value;
		}
	}

	[Symbol.iterator](): IterableIterator<[HeaderName, HeaderValue]> {
		return this.entries();
	}

	protected validate(name: HeaderName, value?: HeaderValue): TypeError | undefined {
		if (name === '') {
			return new TypeError(`Invalid header name: ${name}`);
		}

		if (value === '') {
			return new TypeError(`Invalid header value: ${value}`);
		}
	}

	protected normalizeName(name: HeaderName): NormalizedHeaderName {
		return Object.isSymbol(name) ? name : String(name).trim().toLowerCase();
	}

	protected normalizeValue(value: HeaderValue): NormalizedHeaderValue {
		return value.trim();
	}
}
