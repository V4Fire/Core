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
import Range from 'core/range';
import AbortablePromise from 'core/promise/abortable';

import { IS_NODE } from 'core/env';
import { once } from 'core/functools';
import { convertIfDate } from 'core/json';
import { getDataType } from 'core/mime-type';

import { normalizeHeaderName } from 'core/request/utils';
import { defaultResponseOpts, noContentStatusCodes } from 'core/request/response/const';

import Headers, { BasicHeadersInit, HeaderName, HeaderValue } from 'core/request/headers';

import type StreamController from 'core/request/simple-stream-controller';

import type { OkStatuses, WrappedDecoders, RequestChunk } from 'core/request/interface';

import type {

	ResponseType,
	ResponseTypeValue,
	ResponseTypeValueP,

	ResponseHeaders,
	ResponseOptions,

	ListenerFn,
	ResponseEventEmitter,

	JSONLikeValue

} from 'core/request/response/interface';

export * from 'core/request/headers';

export * from 'core/request/response/const';
export * from 'core/request/response/interface';

/**
 * Class of a remote response
 * @typeparam D - response data type
 */
export default class Response<
	D extends Nullable<string | JSONLikeValue | ArrayBuffer | Blob | Document | unknown
> = unknown> implements ResponseEventEmitter {
	/**
	 * Value of the response data type
	 */
	responseType?: ResponseType;

	/**
	 * Original value of the response data type
	 */
	readonly sourceResponseType?: ResponseType;

	/**
	 * Value of the response status code
	 */
	readonly status: number;

	/**
	 * Response’s status message
	 */
	readonly statusText: string;

	/**
	 * The request URL or the final URL after redirects
	 */
	readonly url: string;

	/**
	 * True, if response was obtained through a redirect
	 */
	readonly redirected: boolean | null;

	/**
	 * True if the response is valid
	 */
	readonly ok: boolean;

	/**
	 * List of status codes (or a single code) that is ok for the response,
	 * also can pass a range of codes
	 */
	readonly okStatuses: OkStatuses;

	/**
	 * Map of response headers
	 */
	readonly headers: ResponseHeaders;

	/**
	 * Sequence of response decoders
	 */
	readonly decoders: WrappedDecoders;

	/**
	 * Reviver function for JSON.parse
	 * @default `convertIfDate`
	 */
	readonly jsonReviver?: JSONCb;

	/**
	 * True, if the request is important
	 */
	readonly important?: boolean;

	/**
	 * Parent operation promise
	 */
	readonly parent?: AbortablePromise;

	/**
	 * Value of the response body
	 */
	readonly body: CanPromise<ResponseTypeValue>;

	/**
	 * Stream controller for handling async iteration
	 */
	readonly streamController?: StreamController<RequestChunk>;

	/**
	 * Event emitter
	 */
	protected readonly emitter?: ResponseEventEmitter;

	/**
	 * @param [body] - response body
	 * @param [opts] - additional options
	 */
	constructor(body?: ResponseTypeValueP, opts?: ResponseOptions) {
		const
			p = Object.mixin(false, {}, defaultResponseOpts, opts),
			ok = p.okStatuses;

		this.parent = p.parent;
		this.important = p.important;

		this.status = p.status;
		this.okStatuses = ok;
		this.statusText = p.statusText;

		this.url = p.url;
		this.redirected = p.redirected;

		this.emitter = p.eventEmitter;
		this.streamController = p.streamController;

		this.ok = ok instanceof Range ?
			ok.contains(this.status) :
			Array.concat([], <number>ok).includes(this.status);

		this.headers = this.parseHeaders(p.headers);

		const
			contentType = this.getHeader('content-type');

		this.responseType = contentType != null ? getDataType(contentType) : p.responseType;
		this.sourceResponseType = this.responseType;

		// tslint:disable-next-line:prefer-conditional-expression
		if (p.decoder == null) {
			this.decoders = [];

		} else {
			this.decoders = Object.isFunction(p.decoder) ? [p.decoder] : p.decoder;
		}

		if (Object.isFunction(p.jsonReviver)) {
			this.jsonReviver = p.jsonReviver;

		} else if (p.jsonReviver !== false) {
			this.jsonReviver = convertIfDate;
		}

		this.body = Object.isFunction(body) ? body() : body;
	}

	/**
	 * Returns an HTTP header value by the specified name
	 * @param name
	 */
	getHeader(name: string): CanUndef<string> {
		return this.headers[normalizeHeaderName(name)];
	}

	/**
	 * Parses a body of the response and returns the result
	 */
	@once
	decode(): AbortablePromise<D> {
		let data;

		if (noContentStatusCodes.includes(this.status)) {
			data = AbortablePromise.resolve(null, this.parent);

		} else {
			switch (this.sourceResponseType) {
				case 'json':
					data = this.json();
					break;

				case 'arrayBuffer':
					data = this.arrayBuffer();
					break;

				case 'blob':
					data = this.blob();
					break;

				case 'document':
					data = this.document();
					break;

				case 'object':
					data = AbortablePromise.resolve(this.body, this.parent);
					break;

				default:
					data = this.text();
			}
		}

		let
			decoders = data.then((obj) => AbortablePromise.resolve(obj, this.parent));

		Object.forEach(this.decoders, (fn) => {
			decoders = decoders.then((data) => {
				if (data != null && Object.isFrozen(data)) {
					data = data.valueOf();
				}

				return fn(data, Object.cast(this));
			});
		});

		return decoders.then((res) => {
			if (Object.isFrozen(res)) {
				return res;
			}

			if (Object.isArray(res) || Object.isPlainObject(res)) {
				Object.defineProperty(res, 'valueOf', {
					value: () => Object.fastClone(res, {freezable: false})
				});

				Object.freeze(res);
			}

			return res;
		});
	}

	/**
	 * Parses the response body as a Document instance and returns it
	 */
	@once
	document(): AbortablePromise<Document | null> {
		return AbortablePromise.resolve(this.body, this.parent)
			.then<Document | null>((body) => {
				//#if node_js

				if (IS_NODE) {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					const {JSDOM} = require('jsdom');

					return this.text()
						.then((text) => new JSDOM(text))
						.then((res) => Object.get(res, 'window.document'));
				}

				//#endif

				if (Object.isString(body) || body instanceof ArrayBuffer) {
					return this.text().then((text) => {
						const type = this.getHeader('content-type') ?? 'text/html';
						return new DOMParser().parseFromString(text ?? '', Object.cast(type));
					});
				}

				if (!(body instanceof Document)) {
					throw new TypeError('Invalid data type');
				}

				return body;
			});
	}

	/**
	 * Parses the response body as a JSON object and returns it
	 */
	json(): AbortablePromise<D | null> {
		return AbortablePromise.resolve(this.body, this.parent)
			.then<D | null>((body) => {
				if (!IS_NODE && body instanceof Document) {
					throw new TypeError('Invalid data type');
				}

				if (body == null || body === '') {
					return null;
				}

				if (Object.isString(body) || body instanceof ArrayBuffer || body instanceof Uint8Array) {
					return this.text().then((text) => {
						if (text == null || text === '') {
							return null;
						}

						return JSON.parse(text, this.jsonReviver);
					});
				}

				return Object.size(this.decoders) > 0 && !Object.isFrozen(body) ?
					Object.fastClone(body) :
					body;
			});
	}

	/**
	 * Parses the response body as an ArrayBuffer object and returns it
	 */
	arrayBuffer(): AbortablePromise<ArrayBuffer | null> {
		return AbortablePromise.resolve(this.body, this.parent)
			.then<ArrayBuffer | null>((body) => {
				//#unless node_js

				if (!IS_NODE && !(body instanceof ArrayBuffer)) {
					throw new TypeError('Invalid data type');
				}

				//#endunless

				//#if node_js

				if (!(body instanceof Buffer) && !(body instanceof ArrayBuffer)) {
					throw new TypeError('Invalid data type');
				}

				//#endif

				if (body.byteLength === 0) {
					return null;
				}

				return body;
			});
	}

	/**
	 * Parses the response body as a Blob structure and returns it
	 */
	blob(): AbortablePromise<Blob | null> {
		return AbortablePromise.resolve(this.body, this.parent)
			.then<Blob | null>((body) => {
				if (!IS_NODE && body instanceof Document) {
					throw new TypeError('Invalid data type');
				}

				if (body == null) {
					return null;
				}

				let
					{Blob} = globalThis;

				//#if node_js

				if (IS_NODE) {
					Blob = require('node-blob');
				}

				//#endif

				return new Blob([Object.cast(body)], {type: this.getHeader('content-type')});
			});
	}

	/**
	 * Parses the response body as a string and returns it
	 */
	@once
	text(): AbortablePromise<string | null> {
		return AbortablePromise.resolve(this.body, this.parent)
			.then<string | null>((body) => {
				if (body == null || body instanceof ArrayBuffer && body.byteLength === 0) {
					return null;
				}

				if (IS_NODE) {
					if (body instanceof Buffer && body.byteLength === 0) {
						throw new TypeError('Invalid data type');
					}

				} else if (body instanceof Document) {
					return String(body);
				}

				if (Object.isString(body)) {
					return body;
				}

				if (Object.isDictionary(body)) {
					return JSON.stringify(body);
				}

				const
					contentType = this.getHeader('content-type');

				let
					encoding = <BufferEncoding>'utf-8';

				if (contentType != null) {
					const
						search = /charset=(\S+)/.exec(contentType);

					if (search) {
						encoding = <BufferEncoding>search[1].toLowerCase();
					}
				}

				if (IS_NODE) {
					return Buffer.from(Object.cast(body)).toString(encoding);
				}

				if (typeof TextDecoder !== 'undefined') {
					const decoder = new TextDecoder(encoding, {fatal: true});
					return decoder.decode(new DataView(Object.cast(body)));
				}

				return new AbortablePromise((resolve, reject, onAbort) => {
					const
						reader = new FileReader();

					reader.onload = () => resolve(<string>reader.result);
					reader.onerror = reject;
					reader.onerror = reject;

					this.blob().then((blob) => {
						onAbort(() => reader.abort());
						reader.readAsText(<Blob>blob, encoding);
					}).catch(stderr);

				}, this.parent);
			});
	}

	/**
	 * Async iterator to iterate through stream
	 */
	async*[Symbol.asyncIterator](): AsyncGenerator<RequestChunk> {
		if (this.streamController == null) {
			throw new Error('Stream controller wasn\'t provided');
		}

		yield* this.streamController[Symbol.asyncIterator]();
	}

	/**
	 * Synchronously calls each of the listeners registered for the event named eventName,
	 * in the order they were registered,passing the supplied arguments to each.
	 * Returns true if the event had listeners, false otherwise.
	 */
	emit(eventName: string, values: any[]): boolean {
		return Boolean(this.emitter?.emit(eventName, values));
	}

	/**
	 * Adds the listener function to the end of the listeners array for the event named eventName
	 */
	on(eventName: string, listener: ListenerFn): this {
		this.emitter?.on(eventName, listener);
		return this;
	}

	/**
	 * Adds a one-time listener function for the event named eventName.
	 */
	once(eventName: string, listener: ListenerFn): this {
		this.emitter?.once(eventName, listener);
		return this;
	}

	/**
	 * Removes the specified listener from the listener array for the event named eventName
	 */
	off(eventName: string, listener: ListenerFn): this {
		this.emitter?.off(eventName, listener);
		return this;
	}

	/**
	 * Returns a normalized object of HTTP headers from the specified string or object
	 * @param headers
	 */
	protected parseHeaders(
		headers: CanUndef<string | Dictionary<CanArray<string>> | Headers>
	): ResponseHeaders {
		let init: BasicHeadersInit = {};

		if (headers instanceof Headers) {
			init = headers;
		} else if (Object.isString(headers)) {
			for (let o = headers.split(/[\r\n]+/), i = 0; i < o.length; i++) {
				const
					header = o[i];

				if (header === '') {
					continue;
				}

				const [name, value] = header.split(':', 2);
				init[normalizeHeaderName(name)] = value.trim();
			}

		} else if (headers != null) {
			for (let keys = Object.keys(headers), i = 0; i < keys.length; i++) {
				const
					name = keys[i],
					value = headers[name];

				if (value == null || name === '') {
					continue;
				}

				init[normalizeHeaderName(name)] = (Object.isArray(value) ? value.join(';') : value).trim();
			}
		}

		const res = new Headers(init);

		return <ResponseHeaders>new Proxy(res, {
			get(target: Headers, prop: HeaderName, receiver: unknown): CanUndef<HeaderValue> {
				if (prop in target) {
					return Reflect.get(target, prop, receiver);
				}

				return target.get.call(receiver, prop) ?? undefined;
			}
		});
	}
}
