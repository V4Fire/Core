/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/response/README.md]]
 * @packageDocumentation
 */

import { EventEmitter2 as EventEmitter } from 'eventemitter2';
import { once, deprecated } from 'core/functools';
import { IS_NODE } from 'core/env';

import { convertIfDate } from 'core/json';
import { getDataType } from 'core/mime-type';

import Parser, { Token } from 'core/json/stream/parser';

import { createControllablePromise } from 'core/promise';
import AbortablePromise from 'core/promise/abortable';

import symbolGenerator from 'core/symbol';

import Headers from 'core/request/headers';
import { FormData, Blob } from 'core/request/engines';

import { defaultResponseOpts } from 'core/request/response/const';

import type {

	Statuses,
	RequestResponseChunk,

	WrappedDecoder,
	WrappedStreamDecoder

} from 'core/request/interface';

import type {

	ResponseType,
	ResponseTypeValue,
	ResponseTypeValueP,
	ResponseModeType,

	ResponseOptions,
	JSONLikeValue

} from 'core/request/response/interface';

import { statusesContainStatus } from 'core/request/response/helpers';

export * from 'core/request/headers';

export * from 'core/request/response/const';
export * from 'core/request/response/interface';
export * from 'core/request/response/helpers';

export const
	$$ = symbolGenerator();

/**
 * Class to work with server response data
 * @typeparam D - response data type
 */
export default class Response<
	D extends Nullable<string | JSONLikeValue | ArrayBuffer | Blob | Document | unknown
> = unknown> {
	/**
	 * The resolved request URL (after resolving redirects, etc.)
	 */
	readonly url: string;

	/**
	 * True if the response was obtained through a redirect
	 */
	readonly redirected: boolean;

	/**
	 * Mode type of the response
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/type
	 */
	readonly type: ResponseModeType;

	/**
	 * Parent operation promise
	 */
	readonly parent?: AbortablePromise;

	/**
	 * A meta flag that indicates that the request is important: is usually used with decoders to indicate that
	 * the request needs to be executed as soon as possible
	 */
	readonly important?: boolean;

	/**
	 * Type of the response data
	 */
	get responseType(): CanUndef<ResponseType> {
		return this[$$.responseType] ?? this.sourceResponseType;
	}

	/**
	 * Sets a new type of the response data
	 */
	protected set responseType(value: CanUndef<ResponseType>) {
		this[$$.responseType] = value;
	}

	/**
	 * Original type of the response data
	 */
	readonly sourceResponseType?: ResponseType;

	/**
	 * Response status code
	 */
	readonly status: number;

	/**
	 * Response status text
	 */
	readonly statusText: string;

	/**
	 * True if the response status matches with a successful status codes
	 * (by default it should match range from 200 to 299)
	 */
	readonly ok: boolean;

	/**
	 * True if the response status matches with no content status codes
	 * (by default it should match range from 100 to 199, 204 or 304)
	 */
	readonly hasNoContent: boolean;

	/**
	 * A list of status codes (or a single code) that match successful operation.
	 * Also, you can pass a range of codes.
	 */
	readonly okStatuses: Statuses;

	/**
	 * A list of status codes (or a single code) that match a response with no content.
	 * Also, you can pass a range of codes.
	 */
	readonly noContentStatuses: Statuses;

	/**
	 * Set of response headers
	 */
	readonly headers: Readonly<Headers>;

	/**
	 * List of response decoders
	 */
	readonly decoders: WrappedDecoder[];

	/**
	 * List of response decoders to apply for chunks when you are parsing response in a stream form
	 */
	readonly streamDecoders: WrappedStreamDecoder[];

	/**
	 * Reviver function for `JSON.parse`
	 * @default `convertIfDate`
	 */
	readonly jsonReviver?: JSONCb;

	/**
	 * Response body value
	 */
	readonly body: ResponseTypeValueP;

	/**
	 * True, if the response body is already read
	 */
	get bodyUsed(): boolean {
		return Boolean(this[$$.bodyUsed]);
	}

	/**
	 * Sets a new status of `bodyUsed`
	 */
	protected set bodyUsed(value: boolean) {
		this[$$.bodyUsed] = value;
	}

	/**
	 * True, if the response body is already read as a stream
	 */
	get streamUsed(): boolean {
		return Boolean(this[$$.streamUsed]);
	}

	/**
	 * Sets a new status of `streamUsed`
	 */
	protected set streamUsed(value: boolean) {
		this[$$.streamUsed] = value;
	}

	/**
	 * Event emitter to broadcast response events
	 */
	readonly emitter: EventEmitter = new EventEmitter({maxListeners: 100, newListener: false});

	/**
	 * Creates a clone of a response object, identical in every way, but stored in a different variable
	 */
	readonly clone: () => Response<D>;

	/**
	 * @param [body] - response body value
	 * @param [opts] - additional options
	 */
	constructor(body?: ResponseTypeValueP, opts?: ResponseOptions) {
		const
			p = Object.mixin(false, {}, defaultResponseOpts, opts);

		this.url = p.url;
		this.redirected = Boolean(p.redirected);

		if (p.type != null) {
			this.type = p.type;

		} else if (!IS_NODE && Object.size(this.url) > 0) {
			this.type = location.hostname === new URL(this.url).hostname ? 'basic' : 'cors';

		} else {
			this.type = 'basic';
		}

		this.parent = p.parent;
		this.important = p.important;

		const
			ok = p.okStatuses,
			noContent = p.noContentStatuses;

		this.status = p.status;
		this.okStatuses = ok;
		this.noContentStatuses = noContent;
		this.statusText = p.statusText;

		this.ok = statusesContainStatus(ok, this.status);
		this.hasNoContent = statusesContainStatus(noContent, this.status);

		this.headers = Object.freeze(new Headers(p.headers));

		if (Object.isFunction(body)) {
			this.body = body.once();
			this.body[Symbol.asyncIterator] = body[Symbol.asyncIterator].bind(body);

		} else {
			this.body = body;
		}

		const
			contentType = this.headers['content-type'] != null ? getDataType(this.headers['content-type']) : undefined;

		if (p.forceResponseType) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			this.sourceResponseType = p.responseType ?? contentType;

		} else {
			this.sourceResponseType = contentType ?? p.responseType;
		}

		if (p.decoder == null) {
			this.decoders = [];

		} else {
			this.decoders = Object.isFunction(p.decoder) ? [p.decoder] : [...p.decoder];
		}

		if (p.streamDecoder == null) {
			this.streamDecoders = [];

		} else {
			this.streamDecoders = Object.isFunction(p.streamDecoder) ? [p.streamDecoder] : [...p.streamDecoder];
		}

		if (Object.isFunction(p.jsonReviver)) {
			this.jsonReviver = p.jsonReviver;

		} else if (p.jsonReviver !== false) {
			this.jsonReviver = convertIfDate;
		}

		this.clone = () => {
			const res = new Response<D>(body, opts);

			Object.assign(res, {
				bodyUsed: this.bodyUsed,
				streamUsed: this.streamUsed
			});

			return res;
		};
	}

	/**
	 * Returns an iterator by the response body.
	 * Mind, when you parse response via iterator, you won't be able to use other parse methods, like `json` or `text`.
	 * @emits `streamUsed()`
	 */
	[Symbol.asyncIterator](): AsyncIterableIterator<RequestResponseChunk> {
		if (this.bodyUsed) {
			throw new Error("The response can't be consumed as a stream because it already read");
		}

		const
			{body} = this;

		if (!Object.isAsyncIterable(body)) {
			throw new TypeError('The response is not an iterable object');
		}

		if (!this.streamUsed) {
			this.streamUsed = true;
			this.emitter.emit('streamUsed');
		}

		return Object.cast(body[Symbol.asyncIterator]());
	}

	/**
	 * Returns an HTTP header value by the specified name
	 * @param name
	 */
	@deprecated({alternative: 'headers.get'})
	getHeader(name: string): CanUndef<string> {
		return this.headers.get(name) ?? undefined;
	}

	/**
	 * Parses the response body and returns a promise with the result.
	 * The operation result is memoized, and you can't parse the response as a stream after invoking this method.
	 *
	 * A way to parse data is based on the response `Content-Type` header or a passed `responseType` constructor option.
	 * Also, a sequence of decoders is applied to the parsed result if they are passed with a `decoders`
	 * constructor option.
	 */
	decode(): AbortablePromise<D | null> {
		if (this[$$.decodedValue] != null) {
			return this[$$.decodedValue];
		}

		if (this.streamUsed) {
			throw new Error("The response can't be read because it's already consuming as a stream");
		}

		const cache = createControllablePromise({
			type: AbortablePromise,
			args: [this.parent]
		});

		this[$$.decodedValue] = cache;

		let
			data;

		if (this.hasNoContent) {
			data = null;

		} else {
			switch (this.sourceResponseType) {
				case 'json':
					data = this.json();
					break;

				case 'formData':
					data = this.formData();
					break;

				case 'document':
					data = this.document();
					break;

				case 'blob':
					data = this.blob();
					break;

				case 'arrayBuffer':
					data = this.arrayBuffer();
					break;

				case 'object':
					data = this.readBody();
					break;

				default:
					data = this.text();
			}
		}

		const decodedVal = this.applyDecoders(data);
		this[$$.decodedValue] = decodedVal;

		void cache.resolve(decodedVal);
		return Object.cast(decodedVal);
	}

	/**
	 * Parses the response body as a stream and yields chunks via an async iterator.
	 * You can't parse the response as a whole data after invoking this method.
	 *
	 * A way to parse data chunks is based on the response `Content-Type` header or a passed `responseType`
	 * constructor option. Also, a sequence of stream decoders is applied to the parsed chunk if they are
	 * passed with a `streamDecoders` constructor option.
	 */
	decodeStream<T = unknown>(): AsyncIterableIterator<T> {
		let
			stream;

		if (this.hasNoContent) {
			stream = [].values();

		} else {
			switch (this.sourceResponseType) {
				case 'json':
					stream = this.jsonStream();
					break;

				case 'text':
					stream = this.textStream();
					break;

				default:
					stream = this.stream();
			}
		}

		return this.applyStreamDecoders(stream);
	}

	/**
	 * Parses the response body as a JSON object and returns it
	 */
	@once
	json(): AbortablePromise<JSONLikeValue> {
		return this.readBody().then((body) => {
			if (body == null) {
				return null;
			}

			if (!IS_NODE && body instanceof Document) {
				throw new TypeError("Can't read response data as a JSON object");
			}

			if (body instanceof FormData) {
				if (!Object.isIterable(body)) {
					throw new TypeError("Can't parse a FormData value as a JSON object because it is not iterable");
				}

				const
					decodedBody = {};

				for (const [key, val] of Object.cast<Iterable<[string, string]>>(body)) {
					decodedBody[key] = val;
				}

				return decodedBody;
			}

			const isStringOrBuffer =
				Object.isString(body) ||
				body instanceof ArrayBuffer ||
				ArrayBuffer.isView(body);

			if (isStringOrBuffer) {
				return this.text().then((text) => {
					if (text === '') {
						return null;
					}

					return JSON.parse(text, this.jsonReviver);
				});
			}

			const decodedBody = Object.size(this.decoders) > 0 && !Object.isFrozen(body) ?
				Object.fastClone(body) :
				body;

			return Object.cast(decodedBody);
		});
	}

	/**
	 * Parses the response data stream as a JSON tokens and yields them via an async iterator
	 */
	@once
	jsonStream(): AsyncIterableIterator<Token> {
		const
			iter = Parser.from(this.textStream());

		return {
			[Symbol.asyncIterator]() {
				return this;
			},

			next: iter.next.bind(iter)
		};
	}

	/**
	 * Parses the response body as a FormData object and returns it
	 */
	@once
	formData(): AbortablePromise<FormData> {
		const
			that = this;

		return this.readBody().then(decode);

		function decode(body: ResponseTypeValueP): FormData {
			if (body == null) {
				return new FormData();
			}

			if (body instanceof FormData) {
				return body;
			}

			if (!IS_NODE && body instanceof Document) {
				throw new TypeError("Can't read response data as a FormData object");
			}

			return Object.cast(that.text().then(decodeFromString));

			function decodeFromString(body: string): FormData {
				const
					formData = new FormData();

				const
					normalizeRgxp = /[+]/g,
					records = body.trim().split('&');

				for (let i = 0; i < records.length; i++) {
					const
						record = records[i];

					if (record === '') {
						continue;
					}

					const
						chunks = record.split('='),
						name = chunks.shift()!.replace(normalizeRgxp, ' '),
						val = chunks.join('=').replace(normalizeRgxp, ' ');

					formData.append(decodeURIComponent(name), decodeURIComponent(val));
				}

				return formData;
			}
		}
	}

	/**
	 * Parses the response body as a Document instance and returns it
	 */
	@once
	document(): AbortablePromise<Document> {
		return this.readBody().then((body) => {
			//#if node_js

			if (IS_NODE) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const {JSDOM} = require('jsdom');

				return this.text()
					.then((text) => new JSDOM(text))
					.then<Document>((res) => Object.get(res, 'window.document'));
			}

			//#endif

			if (body instanceof Document) {
				return body;
			}

			return this.text().then((text) => {
				const type = this.headers.get('Content-Type') ?? 'text/html';
				return new DOMParser().parseFromString(text, Object.cast(type));
			});
		});
	}

	/**
	 * Parses the response body as a string and returns it
	 */
	@once
	text(): AbortablePromise<string> {
		return this.readBody().then((body) => this.decodeToString(body));
	}

	/**
	 * Parses the response data stream as a text chunks and yields them via an async iterator
	 */
	@once
	textStream(): AsyncIterableIterator<string> {
		const
			iter = this.stream();

		return {
			[Symbol.asyncIterator]() {
				return this;
			},

			next: async () => {
				const
					{done, value} = await iter.next();

				return {
					done,
					value: done ? '' : await this.decodeToString(value)
				};
			}
		};
	}

	/**
	 * Parses the response data stream as an ArrayBuffer chunks and yields them via an async iterator
	 */
	@once
	stream(): AsyncIterableIterator<ArrayBuffer | undefined> {
		const
			iter = this[Symbol.asyncIterator]();

		return {
			[Symbol.asyncIterator]() {
				return this;
			},

			next: async () => {
				const
					{done, value} = await iter.next();

				return {
					done,
					value: done ? undefined : value.data
				};
			}
		};
	}

	/**
	 * Parses the response body as a Blob structure and returns it
	 */
	@once
	blob(): AbortablePromise<Blob> {
		return this.readBody().then((body) => this.decodeToBlob(body));
	}

	/**
	 * Parses the response body as an ArrayBuffer and returns it
	 */
	@once
	arrayBuffer(): AbortablePromise<ArrayBuffer> {
		return this.readBody().then((body) => {
			if (body == null || body === '') {
				return new ArrayBuffer(0);
			}

			if (body instanceof ArrayBuffer) {
				return body;
			}

			if (ArrayBuffer.isView(body)) {
				return body.buffer;
			}

			throw new TypeError("Can't read response data as ArrayBuffer");
		});
	}

	/**
	 * Reads the response body or throws an exception if reading is impossible
	 * @emits `bodyUsed()`
	 */
	protected readBody(): AbortablePromise<ResponseTypeValue> {
		if (this.streamUsed) {
			throw new Error("The response can't be read because it's already consuming as a stream");
		}

		if (!this.bodyUsed) {
			this.bodyUsed = true;
			this.emitter.emit('bodyUsed');
		}

		return AbortablePromise.resolveAndCall(this.body, this.parent);
	}

	/**
	 * Applies the given decoders to the specified data and returns a promise with the result
	 *
	 * @param data
	 * @param [decoders]
	 */
	protected applyDecoders<T = unknown>(
		data: CanPromise<ResponseTypeValue>,
		decoders: WrappedDecoder[] = this.decoders
	): T {
		let
			res = AbortablePromise.resolve(data, this.parent);

		for (const decoder of decoders) {
			res = res.then((data) => {
				if (data != null && Object.isFrozen(data)) {
					data = data.valueOf();
				}

				return Object.cast(decoder(data, Object.cast(this)));
			});
		}

		res = res.then((data) => {
			if (Object.isFrozen(data)) {
				return data;
			}

			if (Object.isArray(data) || Object.isPlainObject(data)) {
				const
					originalData = data;

				Object.defineProperty(data, 'valueOf', {
					configurable: true,
					value: () => Object.fastClone(originalData, {freezable: false})
				});

				data = Object.freeze(data);
			}

			return data;
		});

		return Object.cast(res);
	}

	/**
	 * Applies the given decoders to the specified data stream and yields values via an asynchronous iterator
	 *
	 * @param stream
	 * @param [decoders]
	 */
	protected applyStreamDecoders<T>(
		stream: AnyIterable,
		decoders: WrappedStreamDecoder[] = this.streamDecoders
	): AsyncIterableIterator<T> {
		const
			that = this;

		return applyDecoders(stream);

		// eslint-disable-next-line @typescript-eslint/require-await
		function applyDecoders<T>(
			stream: AnyIterable,
			currentDecoder: number = 0
		): AsyncIterableIterator<T> {
			const
				decoder = decoders[currentDecoder];

			if (Object.isFunction(decoder)) {
				const transformedStream = decoder(stream, Object.cast(that));
				return applyDecoders(transformedStream, currentDecoder + 1);
			}

			let
				i;

			if (Object.isAsyncIterable(stream)) {
				i = stream[Symbol.asyncIterator]();

			} else {
				i = stream[Symbol.iterator]();
			}

			return Object.cast(i);
		}
	}

	/**
	 * Converts the specified data to a Blob structure and returns it
	 *
	 * @param data
	 * @param [type] - blob type, by default it takes from response headers
	 */
	protected decodeToBlob(
		data: unknown,
		type: string = this.headers.get('Content-Type') ?? ''
	): Blob {
		if (data == null) {
			return new Blob([], {type});
		}

		if (data instanceof Blob) {
			return data;
		}

		if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
			return new Blob([data], {type});
		}

		return new Blob([Object.cast<object>(data).toString()], {type});
	}

	/**
	 * Converts the specified data to a string and returns it
	 *
	 * @param data
	 * @param [encoding] - string encoding
	 */
	protected decodeToString(data: unknown, encoding?: string): AbortablePromise<string> {
		return AbortablePromise.resolveAndCall(data, this.parent)
			.then((body) => {
				if (encoding == null) {
					encoding = <BufferEncoding>'utf-8';

					if (body == null) {
						return '';
					}

					if (Object.isString(body)) {
						return body;
					}

					if (Object.isDictionary(body)) {
						return JSON.stringify(body);
					}

					if (!IS_NODE && body instanceof Document) {
						return String(body);
					}

					if (body instanceof FormData) {
						if (body.toString === Object.prototype.toString) {
							const
								res = {};

							body.forEach((val, key) => {
								res[key] = val;
							});

							return JSON.stringify(res);
						}

						return body.toString();
					}

					const
						contentType = this.headers.get('Content-Type');

					if (contentType != null) {
						const
							search = /charset=(\S+)/.exec(contentType);

						if (search) {
							encoding = <BufferEncoding>search[1].toLowerCase();
						}
					}
				}

				if (typeof TextDecoder !== 'undefined') {
					const decoder = new TextDecoder(encoding, {fatal: true});

					if (body instanceof ArrayBuffer) {
						return decoder.decode(new DataView(body));
					}

					return decoder.decode(Object.cast(body));
				}

				return new AbortablePromise<string>((resolve, reject, onAbort) => {
					const
						reader = new FileReader();

					onAbort(() => reader.abort());
					reader.onload = () => resolve(String(reader.result));
					reader.onerror = reject;

					reader.readAsText(this.decodeToBlob(data), encoding);

				}, this.parent);
			});
	}
}
