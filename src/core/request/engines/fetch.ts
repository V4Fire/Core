/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

//#if node_js
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
//#endif

import Then from 'core/then';
import Response, { ResponseTypeValue } from 'core/request/response';
import RequestError from 'core/request/error';
import { RequestEngine } from 'core/request/interface';

/**
 * Creates request by using the fetch API with the specified parameters and returns a promise
 * @param params
 */
const request: RequestEngine = (params) => {
	const
		p = params,
		controller = new AbortController();

	let
		body,
		{contentType} = p;

	if (Object.isPlainObject(p.body)) {
		body = JSON.stringify(p.body);

		if (contentType == null) {
			contentType = 'application/json;charset=UTF-8';
		}

	} else if (Object.isNumber(p.body) || Object.isBoolean(p.body)) {
		body = String(p.body);

	} else {
		body = p.body;
	}

	const
		headers: Record<string, string> = {};

	if (p.headers) {
		for (const name of Object.keys(p.headers)) {
			const
				val = p.headers[name];

			if (val == null) {
				continue;
			}

			headers[name] = Array.isArray(val) ? val.join(', ') : val;
		}
	}

	if (contentType != null) {
		headers['Content-Type'] = contentType;
	}

	const normalizedOpts: RequestInit = {
		body,
		credentials: p.credentials ? 'include' : 'same-origin',
		headers,
		method: p.method,
		signal: controller.signal
	};

	return new Then<Response>((resolve, reject, onAbort) => {
		const
			req = fetch(p.url, normalizedOpts);

		let
			timer;

		if (p.timeout != null) {
			timer = setTimeout(() => controller.abort(), p.timeout);
		}

		onAbort(() => {
			controller.abort();
		});

		req.then(async (response) => {
			clearTimeout(timer);

			let
				body: ResponseTypeValue;

			const
				headers: Dictionary<string> = {};

			response.headers.forEach((value, name) => {
				headers[name] = value;
			});

			switch (p.responseType) {
				case 'json':
					body = await response.json();
					break;

				case 'document':
				case 'text':
					body = await response.text();
					break;

				default:
					body = await response.arrayBuffer();
			}

			resolve(new Response(body, {
				parent: p.parent,
				important: p.important,
				responseType: p.responseType,
				okStatuses: p.okStatuses,
				status: response.status,
				headers,
				decoder: p.decoders,
				jsonReviver: p.jsonReviver
			}));

		}, (error) => {
			clearTimeout(timer);

			const
				type = error.name === 'AbortError' ? 'timeout' : 'engine';

			reject(new RequestError(type, {error}));
		});

	}, p.parent);
};

export default request;
