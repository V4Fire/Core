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
import { once, deprecated } from 'core/functools';
import { convertIfDate } from 'core/json';
import { getDataType } from 'core/mime-type';

import Headers from 'core/request/headers';
import type StreamBuffer from 'core/request/modules/stream-buffer';

import { defaultResponseOpts, noContentStatusCodes } from 'core/request/response/const';
import type { OkStatuses, WrappedDecoders, RequestChunk } from 'core/request/interface';

import type {

	ResponseType,
	ResponseTypeValue,
	ResponseTypeValueP,
	ResponseOptions,

	JSONLikeValue

} from 'core/request/response/interface';

export * from 'core/request/headers';

export * from 'core/request/response/const';
export * from 'core/request/response/interface';

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
	 * True if response was obtained through a redirect
	 */
	readonly redirected: boolean;

	/**
	 * Parent operation promise
	 */
	readonly parent?: AbortablePromise;

	/**
	 * True if the request is important
	 */
	readonly important?: boolean;

	/**
	 * Type of the response data
	 */
	responseType?: ResponseType;

	/**
	 * Original type of the response data
	 */
	readonly sourceResponseType?: ResponseType;

	/**
	 * Value of the response status code
	 */
	readonly status: number;

	/**
	 * Text of the response status
	 */
	readonly statusText: string;

	/**
	 * True if the response' status matches with a successful status codes
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
	 * Value of the response body
	 */
	readonly body: CanPromise<ResponseTypeValue>;

	/**
	 * Stream controller for handling async iteration
	 */
	readonly stream?: StreamBuffer<RequestChunk>;

	/**
	 * @param [body] - response body
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

		const
			contentType = this.headers['content-type'];

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
	 * Returns an HTTP header' value by the specified name
	 * @param name
	 */
	@deprecated({alternative: 'headers.get'})
	getHeader(name: string): CanUndef<string> {
		return this.headers.get(name) ?? undefined;
	}

	/**
	 * Parses the response body and returns a result
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

				return new Blob([Object.cast(body)], {type: this.headers['content-type']});
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
}
