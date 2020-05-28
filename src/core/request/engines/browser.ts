/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import Response from 'core/request/response';
import RequestError from 'core/request/error';
import { RequestEngine, RequestOptions } from 'core/request/interface';

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

	if (p.body instanceof FormData) {
		data = p.body;

		if (!contentType) {
			contentType = '';
		}

	} else if (Object.isPlainObject(p.body)) {
		data = JSON.stringify(p.body);

		if (!contentType) {
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

	if (p.responseType) {
		xhr.responseType = p.responseType === 'json' ?
			'text' :
			<XMLHttpRequestResponseType>p.responseType.toLowerCase();
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

					if (el != null) {
						xhr.setRequestHeader(name, el);
					}
				}

			} else if (val != null) {
				xhr.setRequestHeader(name, val);
			}
		}
	}

	if (contentType) {
		xhr.setRequestHeader('Content-Type', contentType);
	}

	return new Then<Response>((resolve, reject, onAbort) => {
		onAbort(() => {
			xhr.abort();
		});

		xhr.addEventListener('load', () => {
			resolve(generateResponse(xhr, p));
		});

		xhr.addEventListener('error', (err) => {
			reject(new RequestError('invalidStatus', {
				response: generateResponse(xhr, p)
			}));
		});

		xhr.addEventListener('timeout', () => {
			reject(new RequestError('timeout'));
		});

		xhr.send(data);
	}, p.parent);
};

/**
 * Generates response object based on passed arguments
 *
 * @param xhr
 * @param opts
 */
function generateResponse(xhr: XMLHttpRequest, opts: RequestOptions): Response {
	return new Response(xhr.response, {
		parent: opts.parent,
		important: opts.important,
		responseType: opts.responseType,
		okStatuses: opts.okStatuses,
		status: xhr.status,
		headers: xhr.getAllResponseHeaders(),
		decoder: opts.decoders
	});
}

export default request;
