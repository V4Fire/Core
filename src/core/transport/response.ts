/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import Then from 'core/then';

import { convertIfDate } from 'core/helpers/json';
import { normalizeHeaderName } from 'core/transport/utils';
import { defaultResponseOpts } from 'core/transport/const';
import { ResponseOptions, ResponseHeaders, ResponseTypes, ResponseType } from 'core/transport/interface';

export type json =
	string |
	number |
	boolean |
	null |
	any[] |
	Dictionary;

export default class Response {
	/**
	 * Response status code
	 */
	readonly status: number;

	/**
	 * @alias status
	 */
	get statusCode(): number {
		return this.status;
	}

	/**
	 * True if 200 <= .status < 300
	 */
	readonly ok: boolean;

	/**
	 * Response headers
	 */
	readonly headers: ResponseHeaders;

	/**
	 * Response type
	 */
	readonly type: ResponseTypes;

	/**
	 * Response body
	 */
	protected readonly body: ResponseType;

	/**
	 * Object factory
	 */
	protected clone?: Function | null;

	/**
	 * Object factory timer
	 */
	protected cloneTimer?: number;

	/**
	 * @param [body]
	 * @param [params]
	 */
	constructor(body?: ResponseType, params?: ResponseOptions) {
		const p = {...defaultResponseOpts, ...params};
		this.status = p.status;
		this.ok = Number.range(200, 299).contains(this.status);
		this.headers = this.parseHeaders(p.headers);
		this.body = body;
		this.type = p.type;
	}

	/**
	 * Returns HTTP header by the specified name from the response
	 * @param name
	 */
	getHeader(name: string): string | undefined {
		return this.headers[normalizeHeaderName(name)];
	}

	/**
	 * Parses .body as .type and returns the result
	 */
	response<T = string | json | ArrayBuffer | Blob | Document | null>(): Then<T> {
		switch (this.type) {
			case 'text':
				return <any>this.text();

			case 'json':
				return <any>this.json();

			case 'arrayBuffer':
				return <any>this.arrayBuffer();

			case 'blob':
				return <any>this.blob();

			case 'document':
				return <any>this.document();
		}
	}

	/**
	 * Parses .body as Document and returns the result
	 */
	document(): Then<Document | null> {
		if (this.type !== 'document') {
			throw new TypeError('Invalid data type');
		}

		if (!this.body) {
			return <any>Then.resolve(null);
		}

		return <any>Then.resolve(this.body);
	}

	/**
	 * Parses .body as JSON and returns the result
	 */
	json<T = json>(): Then<T | null> {
		if (this.type !== 'json') {
			throw new TypeError('Invalid data type');
		}

		if (!this.body) {
			return <any>Then.resolve(null);
		}

		const
			body = String(this.body);

		if (!this.clone && this.clone !== null) {
			this.clone = null;
			this.cloneTimer = requestIdleCallback(() => {
				let data = JSON.parse(body, convertIfDate);
				this.cloneTimer = requestIdleCallback(() => {
					data = data.toSource();
					this.cloneTimer = requestIdleCallback(() => this.clone = new Function(`return ${data}`));
				});
			});
		}

		return Then.resolve(this.clone ? this.clone() : JSON.parse(body, convertIfDate));
	}

	/**
	 * Parses .body as ArrayBuffer and returns the result
	 */
	arrayBuffer(): Then<ArrayBuffer | null> {
		if (this.type !== 'arrayBuffer') {
			throw new TypeError('Invalid data type');
		}

		if (!this.body) {
			return <any>Then.resolve(null);
		}

		return <any>Then.resolve((<ArrayBuffer>this.body).slice(0));
	}

	/**
	 * Parses .body as Blob and returns the result
	 */
	blob(): Then<Blob> {
		if (this.type !== 'blob') {
			throw new TypeError('Invalid data type');
		}

		return Then.resolve(new Blob([this.body], {type: this.getHeader('content-type')}));
	}

	/**
	 * Parses .body as string and returns the result
	 */
	text(): Then<string | null> {
		const
			{body, type} = this;

		if (!body) {
			return <any>Then.resolve(null);
		}

		if ({json: true, text: true, document: true}[type]) {
			return <any>Then.resolve(String(body));
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

		if (typeof TextDecoder !== 'undefined') {
			const decoder = new TextDecoder(encoding, {fatal: true});
			return <any>Then.resolve(decoder.decode(new DataView(<any>body)));
		}

		return new Then((resolve, reject, onAbort) => {
			const
				reader = new FileReader();

			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;

			this.blob().then((blob) => {
				reader.readAsText(blob, encoding);
				onAbort(() => reader.abort());
			});
		});
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
				if (!value) {
					return;
				}

				res[normalizeHeaderName(name)] = value.trim();
			});
		}

		return Object.freeze(res);
	}
}
