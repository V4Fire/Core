/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

//#if node_js
import XMLHttpRequest from 'xhr2';
//#endif

import { IS_NODE } from 'core/env';
import Then from 'core/then';

import Response from 'core/request/response';
import RequestError from 'core/request/error';

import type { RequestEngine } from 'core/request/interface';

/**
 * Creates request by using XMLHttpRequest with the specified parameters and returns a promise
 * @param params
 */
const request: RequestEngine = (params) => {
	const
		p = params,
		xhr = new XMLHttpRequest();

	let
		data,
		{contentType} = p;

	if (!IS_NODE && p.body instanceof FormData) {
		data = p.body;

		if (contentType == null) {
			contentType = '';
		}

	} else if (Object.isPlainObject(p.body)) {
		data = JSON.stringify(p.body);

		if (contentType == null) {
			contentType = 'application/json;charset=UTF-8';
		}

	} else if (Object.isNumber(p.body) || Object.isBoolean(p.body)) {
		data = String(p.body);

	} else {
		data = p.body;
	}

	xhr.open(
		p.method,
		p.url,
		true
	);

	if (p.timeout != null) {
		xhr.timeout = p.timeout;
	}

	switch (p.responseType) {
		case 'json':
		case 'text':
			xhr.responseType = 'text';
			break;

		case 'document':
			//#if node_js
			xhr.responseType = 'text';
			//#endif

			//#unless node_js
			xhr.responseType = 'document';
			//#endunless

			break;

		default:
			xhr.responseType = 'arraybuffer';
	}

	if (p.credentials) {
		xhr.withCredentials = true;
	}

	if (p.headers) {
		for (let o = p.headers, keys = Object.keys(o), i = 0; i < keys.length; i++) {
			const
				name = keys[i],
				val = o[name];

			if (Object.isArray(val)) {
				for (let i = 0; i < val.length; i++) {
					const
						el = val[i];

					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (el != null) {
						xhr.setRequestHeader(name, el);
					}
				}

			} else if (val != null) {
				xhr.setRequestHeader(name, val);
			}
		}
	}

	if (contentType != null) {
		xhr.setRequestHeader('Content-Type', contentType);
	}

	return new Then<Response>((resolve, reject, onAbort) => {
		onAbort(() => {
			xhr.abort();
		});

		xhr.addEventListener('load', () => {
			resolve(new Response(xhr.response, {
				parent: p.parent,
				important: p.important,
				responseType: p.responseType,
				okStatuses: p.okStatuses,
				status: xhr.status,
				headers: xhr.getAllResponseHeaders(),
				decoder: p.decoders,
				jsonReviver: p.jsonReviver
			}));
		});

		xhr.addEventListener('error', (error) => {
			reject(new RequestError('engine', {error}));
		});

		xhr.addEventListener('timeout', () => {
			reject(new RequestError('timeout'));
		});

		xhr.send(data);
	}, p.parent);
};

export default request;
