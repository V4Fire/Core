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

import Range from 'core/range';
import AbortablePromise from 'core/promise/abortable';
import symbolGenerator from 'core/symbol';

import Headers from 'core/request/headers';
import { FormData, Blob } from 'core/request/engines';

import { defaultResponseOpts, noContentStatusCodes } from 'core/request/response/const';
import type { OkStatuses, WrappedDecoders, RequestChunk } from 'core/request/interface';

import type {

	ResponseType,
	ResponseTypeValueP,
	ResponseOptions,
	JSONLikeValue

} from 'core/request/response/interface';

export * from 'core/request/headers';

export * from 'core/request/response/const';
export * from 'core/request/response/interface';

export const
	$$ = symbolGenerator();

/**
 * Class of a request response
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
	 * Container of response headers
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
	get body(): ResponseTypeValueP {
		return this[$$.body];
	}

	/**
	 * Sets a new value of the response body
	 */
	protected set body(value: ResponseTypeValueP) {
		this[$$.body] = value;
	}

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
	 * @param [body] - response body value
	 * @param [opts] - additional options
	 */
	constructor(body?: ResponseTypeValueP, opts?: ResponseOptions) {
		const
			p = Object.mixin(false, {}, defaultResponseOpts, opts);

		this.url = p.url;
		this.redirected = Boolean(p.redirected);

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
	}

	/**
	 * Returns an iterator by the response body.
	 * Mind, when you parse response via iterator, you won't be able to use other parse methods, like `json` or `text`.
	 * @emits `asyncIteratorUsed()`
	 */
	[Symbol.asyncIterator](): AsyncIterableIterator<RequestChunk> {
		if (this.bodyUsed) {
			throw new Error("The response can't be parsed as a stream because it already read");
		}

		const
			{body} = this;

		if (!Object.isAsyncIterable(body)) {
			throw new TypeError('The response is not an iterable object');
		}

		this.streamUsed = true;
		this.emitter.emit('asyncIteratorUsed');

		return Object.cast(body[Symbol.asyncIterator]());
	}

	/**
	 * Returns an HTTP header' value by the specified name
	 * @param name
	 */
	@deprecated({alternative: 'headers.get'})
	getHeader(name: string): CanUndef<string> {
		return this.headers.get(name) ?? undefined;
	}

	/**
	 * Parses the response body and returns a result
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
	 * Parses the response body as a JSON object and returns it
	 */
	@once
	json(): AbortablePromise<D | null> {
		return AbortablePromise.resolveAndCall(this.body, this.parent)
			.then<D | null>((body) => {
				if (body == null) {
					return null;
				}

				if (!IS_NODE && body instanceof Document) {
					throw new TypeError("Can't read response data as JSON");
				}

				if (body instanceof FormData) {
					if (!Object.isIterable(body)) {
						throw new TypeError("Can't parse FormData as JSON because it is not iterable object");
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
				throw new TypeError("Can't read response data as FormData");
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
	 * Parses the response body as an ArrayBuffer object and returns it
	 */
	@once
	arrayBuffer(): AbortablePromise<ArrayBuffer> {
		return AbortablePromise.resolveAndCall(this.body, this.parent)
			.then<ArrayBuffer>((body) => {
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
}
