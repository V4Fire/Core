/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import $C = require('collection.js');
import Then from 'core/then';
import Response from 'core/request/response';
import RequestError from 'core/request/error';

import { toQueryString } from 'core/url';
import { RequestOptions } from 'core/request/interface';
import { normalizeHeaders } from 'core/request/utils';
import { defaultRequestOpts } from 'core/request/const';

const simpleTypes = {
	string: true,
	number: true,
	boolean: true
};

const urlEncodeRequests = {
	GET: true,
	HEAD: true
};

/**
 * Creates request by XMLHttpRequest with the specified parameters and returns a promise
 * @param params
 */
export default function createTransport<T>(params: RequestOptions): Then<Response> {
	const
		p = <typeof defaultRequestOpts & RequestOptions>{...defaultRequestOpts, ...params},
		xhr = new XMLHttpRequest();

	let
		data = p.body;

	if (p.encoder) {
		const
			v = p.encoder(data);

		if (v.contentType) {
			p.contentType = v.contentType;
		}

		data = v.data;

	} else if (data) {
		if (simpleTypes[typeof data]) {
			data = {data: String(data)};

		} else if (Object.isObject(data) || Object.isArray(data)) {
			data = Object.fastClone(data);
		}
	}

	const
		urlEncodeRequest = urlEncodeRequests[p.method];

	if (data) {
		if (urlEncodeRequest) {
			p.body = toQueryString(data);
			p.contentType = 'text/plain;charset=UTF-8';

		} else if (data instanceof FormData) {
			p.contentType = '';

		} else if (Object.isObject(data)) {
			p.body = JSON.stringify(data);
			p.contentType = 'application/json;charset=UTF-8';
		}
	}

	const
		url = p.url + (urlEncodeRequest && p.body ? `?${p.body}` : ''),
		isJSON = p.responseType === 'json';

	xhr.open(
		p.method,
		url,
		true,
		p.user,
		p.password
	);

	if (p.timeout != null) {
		xhr.timeout = p.timeout;
	}

	if (isJSON) {
		xhr.responseType = '';

	} else if (p.responseType) {
		xhr.responseType = <XMLHttpRequestResponseType>p.responseType.toLowerCase();
	}

	if (p.withCredentials) {
		xhr.withCredentials = true;
	}

	$C(normalizeHeaders(p.headers)).forEach((val, name) => {
		if (Object.isArray(val)) {
			$C(val as string[]).forEach((val) => {
				xhr.setRequestHeader(name, val);
			});

		} else {
			xhr.setRequestHeader(name, val);
		}
	});

	if (p.contentType) {
		xhr.setRequestHeader('Content-Type', p.contentType);
	}

	return new Then<Response>((resolve, reject, onAbort) => {
		xhr.addEventListener('load', () => {
			resolve(new Response(isJSON ? xhr.responseText : xhr.response, {
				status: xhr.status,
				headers: xhr.getAllResponseHeaders()
			}));
		});

		xhr.addEventListener('error', (err) => {
			reject(err);
		});

		xhr.addEventListener('timeout', () => {
			reject(new RequestError('timeout'));
		});

		onAbort((replacedBy) => {
			if (replacedBy) {
				resolve(replacedBy);

			} else {
				reject(new RequestError('abort'));
			}

			xhr.abort();
		});

		xhr.send(urlEncodeRequest ? undefined : p.body);
	});
}
