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

import Then from 'core/then';
import Range from 'core/range';

import { IS_NODE } from 'core/env';
import { once } from 'core/functools';
import { convertIfDate } from 'core/json';
import { getDataType } from 'core/mime-type';

import { normalizeHeaderName } from 'core/request/utils';
import { defaultResponseOpts } from 'core/request/response/const';

import { OkStatuses, WrappedDecoders } from 'core/request/interface';
import {

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
	 * True, if the request is important
	 */
	readonly important?: boolean;

	/**
	 * Parent operation promise
	 */
	readonly parent?: Then;

	/**
	 * Value of the response body
	 */
	protected readonly body: ResponseTypeValue;

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

		if (p.decoder == null) {
			this.decoders = [];

		} else {
			this.decoders = Object.isFunction(p.decoder) ? [p.decoder] : p.decoder;
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
	decode(): Then<D> {
		let data;
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
				data = Then.resolve(this.body, this.parent);
				break;

			default:
				data = this.text();
		}

		let
			decoders = data.then((obj) => Then.resolve(obj, this.parent));

		Object.forEach(this.decoders, (fn) => {
			decoders = decoders.then((data) => fn(data, this));
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
	document(): Then<Document | null> {
		const
			{body} = this;

		if (!(body instanceof Document)) {
			throw new TypeError('Invalid data type');
		}

		return Then.resolve<Document | null>(body, this.parent);
	}

	/**
	 * Parses the response body as a JSON object and returns it
	 */
	json(): Then<D | null> {
		type _ = D | null;

		const
			{body} = this;

		if (body instanceof Document || body instanceof ArrayBuffer) {
			throw new TypeError('Invalid data type');
		}

		if (body == null || body === '') {
			return Then.resolve<_>(null, this.parent);
		}

		if (Object.isString(body)) {
			return Then.resolveAndCall(() => JSON.parse(body, convertIfDate), this.parent);
		}

		return Then.resolveAndCall<_>(
			() => Object.size(this.decoders) > 0 && !Object.isFrozen(body) ? Object.fastClone(body) : body,
			this.parent
		);
	}

	/**
	 * Parses the response body as an ArrayBuffer object and returns it
	 */
	arrayBuffer(): Then<ArrayBuffer | null> {
		type _ = ArrayBuffer | null;

		const
			{body} = this;

		if (!(body instanceof ArrayBuffer)) {
			throw new TypeError('Invalid data type');
		}

		if (body.byteLength === 0) {
			return Then.resolve<_>(null, this.parent);
		}

		return Then.resolve<_>(body, this.parent);
	}

	/**
	 * Parses the response body as a Blob structure and returns it
	 */
	blob(): Then<Blob | null> {
		type _ = Blob | null;

		const
			{body} = this;

		if (body instanceof Document) {
			throw new TypeError('Invalid data type');
		}

		if (body == null) {
			return Then.resolve<_>(null);
		}

		return Then.resolve<_>(new Blob([body], {type: this.getHeader('content-type')}), this.parent);
	}

	/**
	 * Parses the response body as a string and returns it
	 */
	@once
	text(): Then<string | null> {
		type _ = string | null;

		const
			{body} = this;

		if (body == null || body instanceof ArrayBuffer && body.byteLength === 0) {
			return Then.resolve<_>(null, this.parent);
		}

		if (Object.isString(body) || body instanceof Document) {
			return Then.resolve<_>(String(body), this.parent);
		}

		if (Object.isDictionary(body)) {
			return Then.resolve<_>(JSON.stringify(body), this.parent);
		}

		const
			contentType = this.getHeader('content-type');

		let
			encoding = 'utf-8';

		if (contentType != null) {
			const
				search = /charset=(\S+)/.exec(contentType);

			if (search) {
				encoding = search[1].toLowerCase();
			}
		}

		if (IS_NODE) {
			//#if node_js
			return Then.resolve<_>(Buffer.from(body).toString(encoding));
			//#endif
		}

		if (typeof TextDecoder !== 'undefined') {
			const decoder = new TextDecoder(encoding, {fatal: true});
			return Then.resolve<_>(decoder.decode(new DataView(body)), this.parent);
		}

		return new Then((resolve, reject, onAbort) => {
			const
				reader = new FileReader();

			reader.onload = () => resolve(<string>reader.result);
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
	protected parseHeaders(headers: CanUndef<string | Dictionary<string>>): ResponseHeaders {
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

				res[normalizeHeaderName(name)] = value.trim();
			}
		}

		return Object.freeze(res);
	}
}
