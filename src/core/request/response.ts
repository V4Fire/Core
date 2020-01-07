/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import Range from 'core/range';

import { IS_NODE } from 'core/env';
import { once } from 'core/meta';
import { convertIfDate } from 'core/json';
import { normalizeHeaderName, getResponseTypeFromMime } from 'core/request/utils';
import { defaultResponseOpts } from 'core/request/const';
import {

	ResponseOptions,
	ResponseHeaders,
	ResponseType,
	ResponseTypeValue,
	Decoders,
	OkStatuses,
	JSONLikeValue

} from 'core/request/interface';

export default class Response {
	/**
	 * Response data type
	 */
	responseType?: ResponseType;

	/**
	 * Response source data type
	 */
	readonly sourceResponseType?: ResponseType;

	/**
	 * Parent operation promise
	 */
	readonly parent?: Then;

	/**
	 * Important flag
	 */
	readonly important?: boolean;

	/**
	 * Response status code
	 */
	readonly status: number;

	/**
	 * Range of ok status codes
	 */
	readonly okStatuses: OkStatuses;

	/**
	 * True if .okStatuses contains .status
	 */
	readonly ok: boolean;

	/**
	 * Response headers
	 */
	readonly headers: ResponseHeaders;

	/**
	 * Response decoders
	 */
	readonly decoders: Decoders;

	/**
	 * Response body
	 */
	protected readonly body: ResponseTypeValue;

	/**
	 * @param [body]
	 * @param [params]
	 */
	constructor(body?: ResponseTypeValue, params?: ResponseOptions) {
		const
			p = Object.mixin<typeof defaultResponseOpts & ResponseOptions>(false, {}, defaultResponseOpts, params),
			s = this.okStatuses = p.okStatuses;

		this.parent = p.parent;
		this.important = p.important;

		this.status = p.status;
		this.ok = s instanceof Range ? s.contains(this.status) : (<number[]>[]).concat(s || []).includes(this.status);
		this.headers = this.parseHeaders(p.headers);

		this.sourceResponseType = this.responseType = p.responseType == null ?
			getResponseTypeFromMime(this.getHeader('content-type')) : p.responseType;

		this.decoders = p.decoder ? Object.isFunction(p.decoder) ? [p.decoder] : p.decoder : [];
		this.body = body;
	}

	/**
	 * Returns HTTP header by the specified name from the response
	 * @param name
	 */
	getHeader(name: string): CanUndef<string> {
		return this.headers[normalizeHeaderName(name)];
	}

	/**
	 * Parses .body as .sourceType and returns the result
	 */
	@once
	decode<T extends Nullable<string | JSONLikeValue | ArrayBuffer | Blob | Document | unknown>>(): Then<T> {
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

		Object.forEach(this.decoders, (fn: Function) => {
			decoders = decoders.then((data) => fn(data, this));
		});

		return decoders.then((res) => {
			if (Object.isFrozen(res)) {
				return res;
			}

			if (Object.isArray(res) || Object.isObject(res)) {
				Object.defineProperty(res, 'valueOf', {
					value: () => Object.fastClone(res, {freezable: false})
				});

				Object.freeze(res);
			}

			return res;
		});
	}

	/**
	 * Parses .body as Document and returns the result
	 */
	@once
	document(): Then<Document | null> {
		if (this.sourceResponseType !== 'document') {
			throw new TypeError('Invalid data sourceType');
		}

		type _ = Document | null;

		const
			body = <_>this.body;

		if (!body) {
			return Then.resolve<_>(null, this.parent);
		}

		return Then.resolve<_>(body, this.parent);
	}

	/**
	 * Parses .body as JSON and returns the result
	 */
	json<T extends JSONLikeValue>(): Then<T | null> {
		if (this.sourceResponseType !== 'json') {
			throw new TypeError('Invalid data sourceType');
		}

		type _ = string | JSONLikeValue | null;

		const
			body = <_>this.body;

		if (body == null || body === '') {
			return Then.resolve<T | null>(null, this.parent);
		}

		if (Object.isString(body)) {
			return Then.resolveAndCall(() => JSON.parse(body, convertIfDate), this.parent);
		}

		return Then.resolveAndCall<T | null>(
			<() => T>(() => Object.size(this.decoders) && !Object.isFrozen(body) ? Object.fastClone(body) : body),
			this.parent
		);
	}

	/**
	 * Parses .body as ArrayBuffer and returns the result
	 */
	arrayBuffer(): Then<ArrayBuffer | null> {
		if (this.sourceResponseType !== 'arrayBuffer') {
			throw new TypeError('Invalid data sourceType');
		}

		type _ = ArrayBuffer | null;

		const
			body = <_>this.body;

		if (!body || !body.byteLength) {
			return Then.resolve<_>(null, this.parent);
		}

		return Then.resolve<_>(body, this.parent);
	}

	/**
	 * Parses .body as Blob and returns the result
	 */
	blob(): Then<Blob | null> {
		if (this.sourceResponseType !== 'blob') {
			throw new TypeError('Invalid data sourceType');
		}

		type _ = Blob | null;

		const
			{body} = this;

		if (!body) {
			return Then.resolve<_>(null);
		}

		return Then.resolve<_>(new Blob([<any>body], {type: this.getHeader('content-type')}), this.parent);
	}

	/**
	 * Parses .body as string and returns the result
	 */
	@once
	text(): Then<string | null> {
		type _ = string | null;

		const
			body = this.body,
			type = this.sourceResponseType!;

		if (!body || type === 'arrayBuffer' && !(<ArrayBuffer>body).byteLength) {
			return Then.resolve<_>(null, this.parent);
		}

		if ({text: true, document: true}[type]) {
			return Then.resolve<_>(String(body), this.parent);
		}

		if ({json: true, object: true}[type]) {
			if (Object.isString(body)) {
				return Then.resolve<_>(body, this.parent);
			}

			return Then.resolveAndCall<_>(() => JSON.stringify(body), this.parent);
		}

		const
			contentType = this.getHeader('content-type');

		let
			encoding = 'utf-8';

		if (contentType) {
			const
				search = /charset=(\S+)/.exec(contentType);

			if (search) {
				encoding = search[1].toLowerCase();
			}
		}

		if (IS_NODE) {
			//#if node_js
			// @ts-ignore
			return Then.resolve<_>(Buffer.from(body).toString(encoding));
			//#endif
		}

		if (typeof TextDecoder !== 'undefined') {
			const decoder = new TextDecoder(encoding, {fatal: true});
			return Then.resolve<_>(decoder.decode(new DataView(<any>body)), this.parent);
		}

		return new Then((resolve, reject, onAbort) => {
			const
				reader = new FileReader();

			reader.onload = () => resolve(<string>reader.result);
			reader.onerror = reject;

			this.blob().then((blob) => {
				onAbort(() => reader.abort());
				reader.readAsText(<Blob>blob, encoding);
			});

		}, this.parent);
	}

	/**
	 * Returns normalized object of HTTP headers by the specified string/object
	 * @param headers
	 */
	protected parseHeaders(headers: string | Dictionary<string>): ResponseHeaders {
		const
			res = {};

		if (Object.isString(headers)) {
			for (let o = headers.split(/[\r\n]+/), i = 0; i < o.length; i++) {
				const
					header = o[i];

				if (!header) {
					continue;
				}

				const [name, value] = header.split(':', 2);
				res[normalizeHeaderName(name)] = value.trim();
			}

		} else if (headers) {
			for (let keys = Object.keys(headers), i = 0; i < keys.length; i++) {
				const
					name = keys[i],
					value = headers[name];

				if (!value || !name) {
					continue;
				}

				res[normalizeHeaderName(name)] = value.trim();
			}
		}

		return Object.freeze(res);
	}
}
