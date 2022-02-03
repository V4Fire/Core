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

import { readonly } from 'core/object/proxy-readonly';
import { clone } from 'core/object/proxy-clone';

import { convertIfDate } from 'core/json';
import { getDataType } from 'core/mime-type';

import Range from 'core/range';
import AbortablePromise from 'core/promise/abortable';
import symbolGenerator from 'core/symbol';

import Headers from 'core/request/headers';
import { FormData, Blob } from 'core/request/engines';

import { defaultResponseOpts, noContentStatusCodes } from 'core/request/response/const';
import type { OkStatuses, WrappedDecoders, RequestResponseChunk } from 'core/request/interface';

import type {

	ResponseType,
	ResponseTypeValue,
	ResponseTypeValueP,
	ResponseModeType,

	ResponseOptions,
	JSONLikeValue

} from 'core/request/response/interface';

export * from 'core/request/headers';

export * from 'core/request/response/const';
export * from 'core/request/response/interface';

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
	 * List of status codes (or a single code) that match successful operation.
	 * Also, you can pass a range of codes.
	 */
	readonly okStatuses: OkStatuses;

	/**
	 * Set of response headers
	 */
	readonly headers: Readonly<Headers>;

	/**
	 * Sequence of response decoders
	 */
	readonly decoders: WrappedDecoders;

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

		} else {
			this.type = location.hostname === new URL(this.url).hostname ? 'basic' : 'cors';
		}

		this.parent = p.parent;
		this.important = p.important;

		const
			ok = p.okStatuses;

		this.status = p.status;
		this.okStatuses = ok;
		this.statusText = p.statusText;

		this.ok = ok instanceof Range ?
			ok.contains(this.status) :
			Array.concat([], <number>ok).includes(this.status);

		this.headers = Object.freeze(new Headers(p.headers));
		this.body = body;

		const contentType = this.headers['content-type'];
		this.sourceResponseType = contentType != null ? getDataType(contentType) : p.responseType;

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
	 * @emits `asyncIteratorUsed()`
	 */
	[Symbol.asyncIterator](): AsyncIterableIterator<RequestResponseChunk> {
		if (this.bodyUsed) {
			throw new Error("The response can't be parsed as a stream because it already read");
		}

		const
			{body} = this;

		if (!Object.isAsyncIterable(body)) {
			throw new TypeError('The response is not an iterable object');
		}

		if (!this.streamUsed) {
			this.emitter.emit('asyncIteratorUsed');
		}

		this.streamUsed = true;
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
	 *
	 * @emits `bodyUsed()`
	 */
	@once
	decode(): AbortablePromise<D | null> {
		if (this.streamUsed) {
			return AbortablePromise.resolve<D | null>(null);
		}

		this.bodyUsed = true;
		this.emitter.emit('bodyUsed');

		let
			data;

		if (noContentStatusCodes.includes(this.status)) {
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
					data = AbortablePromise.resolve(this.body, this.parent);
					break;

				default:
					data = this.text();
			}
		}

		return this.applyDecoders(data);
	}

	/**
	 * Parses the response body as a JSON object and returns it
	 */
	@once
	json(): AbortablePromise<JSONLikeValue> {
		return AbortablePromise.resolveAndCall(this.body, this.parent)
			.then<JSONLikeValue>((body) => {
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
						res = {};

					for (const [key, val] of Object.cast<Iterable<[string, string]>>(body)) {
						res[key] = val;
					}

					return res;
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

				return Object.size(this.decoders) > 0 && !Object.isFrozen(body) ? Object.fastClone(body) : body;
			});
	}

	/**
	 * Parses the response body as a FormData object and returns it
	 */
	@once
	formData(): AbortablePromise<FormData> {
		const
			that = this;

		return AbortablePromise.resolveAndCall(this.body, this.parent)
			.then<FormData>(decode);

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
		return AbortablePromise.resolveAndCall(this.body, this.parent)
			.then<Document>((body) => {
				//#if node_js

				if (IS_NODE) {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					const {JSDOM} = require('jsdom');

					return this.text()
						.then((text) => new JSDOM(text))
						.then((res) => Object.get(res, 'window.document'));
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
		const
			that = this;

		return AbortablePromise.resolveAndCall(this.body, this.parent)
			.then<string>(decode);

		function decode(body: ResponseTypeValueP): CanPromise<string> {
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
				contentType = that.headers.get('Content-Type');

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

			return new AbortablePromise<string>((resolve, reject, onAbort) => {
				const
					reader = new FileReader();

				reader.onload = () => resolve(String(reader.result));
				reader.onerror = reject;
				reader.onerror = reject;

				that.blob().then((blob) => {
					onAbort(() => reader.abort());
					reader.readAsText(blob, encoding);
				}).catch(stderr);

			}, that.parent);
		}
	}

	/**
	 * Parses the response body as a Blob structure and returns it
	 */
	@once
	blob(): AbortablePromise<Blob> {
		return AbortablePromise.resolveAndCall(this.body, this.parent)
			.then<Blob>((body) => {
				const
					type = this.headers.get('Content-Type') ?? '';

				if (body == null) {
					return new Blob([], {type});
				}

				if (body instanceof Blob) {
					return body;
				}

				if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
					return new Blob(Object.cast(body), {type});
				}

				return new Blob([body.toString()], {type});
			});
	}

	/**
	 * Parses the response body as an ArrayBuffer and returns it
	 */
	@once
	arrayBuffer(): AbortablePromise<ArrayBuffer> {
		return AbortablePromise.resolveAndCall(this.body, this.parent)
			.then<ArrayBuffer>((body) => {
				if (body == null) {
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
	 * Applies the given decoders to the specified data and returns a promise with the result
	 *
	 * @param data
	 * @param [decoders]
	 */
	protected applyDecoders<T = unknown>(
		data: CanPromise<ResponseTypeValue>,
		decoders: WrappedDecoders = this.decoders
	): T {
		let
			res = AbortablePromise.resolve(data, this.parent);

		Object.forEach(decoders, (fn) => {
			res = res.then((data) => {
				if (data != null && Object.isFrozen(data)) {
					data = data.valueOf();
				}

				return fn(data, Object.cast(this));
			});
		});

		res = res.then((data) => {
			if (Object.isFrozen(data)) {
				return data;
			}

			if (Object.isArray(data) || Object.isPlainObject(data)) {
				const
					originalData = data;

				Object.defineProperty(data, 'valueOf', {
					configurable: true,
					value: () => clone(originalData)
				});

				data = readonly(data);
			}

			return data;
		});

		return Object.cast(res);
	}
}
