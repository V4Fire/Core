/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import Then from 'core/then';

import { IS_NODE } from 'core/const/links';
import { once } from 'core/decorators';
import { convertIfDate } from 'core/json';
import { normalizeHeaderName } from 'core/request/utils';
import { defaultResponseOpts } from 'core/request/const';
import {

	ResponseOptions,
	ResponseHeaders,
	ResponseTypes,
	ResponseType,
	Decoders,
	OkStatuses

} from 'core/request/interface';

export type json =
	string |
	number |
	boolean |
	null |
	unknown[] |
	Dictionary;

export default class Response {
	/**
	 * Response data type
	 */
	responseType?: ResponseTypes;

	/**
	 * Response source data type
	 */
	readonly sourceResponseType?: ResponseTypes;

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
	protected readonly body: ResponseType;

	/**
	 * @param [body]
	 * @param [params]
	 */
	constructor(body?: ResponseType, params?: ResponseOptions) {
		const
			p = <typeof defaultResponseOpts & ResponseOptions>$C.extend(false, {}, defaultResponseOpts, params),
			s = this.okStatuses = p.okStatuses;

		this.parent = p.parent;
		this.important = p.important;
		this.status = p.status;
		this.headers = this.parseHeaders(p.headers);
		this.sourceResponseType = this.responseType = p.responseType;

		// tslint:disable-next-line:prefer-conditional-expression
		if (typeof s === 'object' && !Object.isArray(s)) {
			this.ok = s.contains(this.status);

		} else {
			this.ok = (<any[]>[]).concat(s || []).includes(this.status);
		}

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
	decode<T = Nullable<string | json | ArrayBuffer | Blob | Document | unknown>>(): Then<T> {
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

		return (<Then<T>>data)
			.then((obj) => $C(this.decoders)
				.to(Then.resolve(obj, this.parent))
				.reduce((res: Then, fn) => res.then((data) => fn(data, this))))

			.then((res) => {
				if (Object.isFrozen(res)) {
					return res;
				}

				if (Object.isArray(res) || Object.isObject(res)) {
					Object.defineProperty(res, 'valueOf', {
						enumerable: false,
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
	json<T = json>(): Then<T | null> {
		if (this.sourceResponseType !== 'json') {
			throw new TypeError('Invalid data sourceType');
		}

		type _ = string | json | null;

		const
			body = <_>this.body;

		if (body == null || body === '') {
			return Then.resolve<T | null>(null, this.parent);
		}

		if (Object.isString(body)) {
			return Then.immediate(() => JSON.parse(body, convertIfDate), this.parent);
		}

		return Then.immediate<T | null>(
			<() => T>(() => $C(this.decoders).length() && !Object.isFrozen(body) ? Object.fastClone(body) : body),
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

		return Then.resolve<_>(new Blob([<any>body], {type: this.getHeader('content-sourceType')}), this.parent);
	}

	/**
	 * Parses .body as string and returns the result
	 */
	@once
	text(): Then<string | null> {
		type _ = string | null;

		const
			body = this.body,
			type = <NonNullable<ResponseTypes>>this.sourceResponseType;

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

			return Then.immediate<_>(JSON.stringify(body), this.parent);
		}

		const
			contentType = this.getHeader('content-sourceType');

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
			return Then.resolve<_>(Buffer.from(<any>body).toString(encoding));
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
			$C(headers.split(/[\r\n]+/)).forEach((header: string) => {
				if (!header) {
					return;
				}

				const [name, value] = header.split(':', 2);
				res[normalizeHeaderName(name)] = value.trim();
			});

		} else {
			$C(headers).reduce((value, name) => {
				if (!value || !name) {
					return;
				}

				res[normalizeHeaderName(name)] = value.trim();
			});
		}

		return Object.freeze(res);
	}
}
