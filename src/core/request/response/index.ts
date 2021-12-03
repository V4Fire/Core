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

import type { OkStatuses, WrappedDecoders } from 'core/request/interface';

import type {

	ResponseType,
	ResponseTypeValue,
	ResponseHeaders,
	ResponseOptions,
	JSONLikeValue

} from 'core/request/response/interface';

export * from 'core/request/response/const';
export * from 'core/request/response/interface';

/**
 * Class of a remote response
 * @typeparam D - response data type
 */
export default class Response<
	D extends Nullable<string | JSONLikeValue | ArrayBuffer | Blob | Document | unknown
> = unknown> {
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
	readonly body: ResponseTypeValue;

	/**
	 * @param [body] - response body
	 * @param [opts] - additional options
	 */
	constructor(body?: ResponseTypeValue, opts?: ResponseOptions) {
		const
			p = Object.mixin(false, {}, defaultResponseOpts, opts),
			ok = p.okStatuses;

		this.parent = p.parent;
		this.important = p.important;

		this.status = p.status;
		this.okStatuses = ok;
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

		this.body = body;
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
		type _ = Document | null;

		const
			{body} = this;

		//#if node_js
		if (IS_NODE) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const {JSDOM} = require('jsdom');

			return AbortablePromise.resolve(
				this.text()
					.then((text) => new JSDOM(text))
					.then<_>((res) => Object.get(res, 'window.document')),

				this.parent
			);
		}
		//#endif

		if (Object.isString(body) || body instanceof ArrayBuffer) {
			return AbortablePromise.resolve(
				this.text().then<_>((text) => {
					const type = this.getHeader('content-type') ?? 'text/html';
					return(new DOMParser()).parseFromString(text ?? '', Object.cast(type));
				}),

				this.parent
			);
		}

		if (!(body instanceof Document)) {
			throw new TypeError('Invalid data type');
		}

		return AbortablePromise.resolve<_>(body, this.parent);
	}

	/**
	 * Parses the response body as a JSON object and returns it
	 */
	json(): AbortablePromise<D | null> {
		type _ = D | null;

		const
			{body} = this;

		if (!IS_NODE && body instanceof Document) {
			throw new TypeError('Invalid data type');
		}

		if (body == null || body === '') {
			return AbortablePromise.resolve<_>(null, this.parent);
		}

		if (Object.isString(body) || body instanceof ArrayBuffer || body instanceof Uint8Array) {
			return AbortablePromise.resolve(
				this.text().then<_>((text) => {
					if (text == null || text === '') {
						return null;
					}

					return JSON.parse(text, this.jsonReviver);
				}),

				this.parent
			);
		}

		return AbortablePromise.resolveAndCall<_>(
			() => Object.cast(
				Object.size(this.decoders) > 0 && !Object.isFrozen(body) ?
					Object.fastClone(body) :
					body
			),

			this.parent
		);
	}

	/**
	 * Parses the response body as an ArrayBuffer object and returns it
	 */
	arrayBuffer(): AbortablePromise<ArrayBuffer | null> {
		type _ = ArrayBuffer | null;

		const
			{body} = this;

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
			return AbortablePromise.resolve<_>(null, this.parent);
		}

		return AbortablePromise.resolve<_>(body, this.parent);
	}

	/**
	 * Parses the response body as a Blob structure and returns it
	 */
	blob(): AbortablePromise<Blob | null> {
		type _ = Blob | null;

		const
			{body} = this;

		if (!IS_NODE && body instanceof Document) {
			throw new TypeError('Invalid data type');
		}

		if (body == null) {
			return AbortablePromise.resolve<_>(null);
		}

		let
			{Blob} = globalThis;

		//#if node_js
		if (IS_NODE) {
			Blob = require('node-blob');
		}
		//#endif

		const blob = new Blob([Object.cast(body)], {type: this.getHeader('content-type')});
		return AbortablePromise.resolve<_>(blob, this.parent);
	}

	/**
	 * Parses the response body as a string and returns it
	 */
	@once
	text(): AbortablePromise<string | null> {
		type _ = string | null;

		const
			{body} = this;

		if (body == null || body instanceof ArrayBuffer && body.byteLength === 0) {
			return AbortablePromise.resolve<_>(null, this.parent);
		}

		if (IS_NODE) {
			if (body instanceof Buffer && body.byteLength === 0) {
				throw new TypeError('Invalid data type');
			}

		} else if (body instanceof Document) {
			return AbortablePromise.resolve<_>(String(body), this.parent);
		}

		if (Object.isString(body)) {
			return AbortablePromise.resolve<_>(String(body), this.parent);
		}

		if (Object.isDictionary(body)) {
			return AbortablePromise.resolve<_>(JSON.stringify(body), this.parent);
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
			return AbortablePromise.resolve<_>(Buffer.from(Object.cast(body)).toString(encoding));
		}

		if (typeof TextDecoder !== 'undefined') {
			const decoder = new TextDecoder(encoding, {fatal: true});
			return AbortablePromise.resolve<_>(decoder.decode(new DataView(Object.cast(body))), this.parent);
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
	}

	/**
	 * Returns a normalized object of HTTP headers from the specified string or object
	 * @param headers
	 */
	protected parseHeaders(
		headers: CanUndef<string | Dictionary<CanArray<string>>>
	): ResponseHeaders {
		const
			res = {};

		if (Object.isString(headers)) {
			for (let o = headers.split(/[\r\n]+/), i = 0; i < o.length; i++) {
				const
					header = o[i];

				if (header === '') {
					continue;
				}

				const [name, value] = header.split(':', 2);
				res[normalizeHeaderName(name)] = value.trim();
			}

		} else if (headers != null) {
			for (let keys = Object.keys(headers), i = 0; i < keys.length; i++) {
				const
					name = keys[i],
					value = headers[name];

				if (value == null || name === '') {
					continue;
				}

				res[normalizeHeaderName(name)] =
					(Object.isArray(value) ? value.join(';') : value).trim();
			}
		}

		return Object.freeze(res);
	}
}
