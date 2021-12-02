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

import AbortablePromise from '@src/core/promise/abortable';

import { IS_NODE } from '@src/core/env';
import { isOnline } from '@src/core/net';

import Response from '@src/core/request/response';
import RequestError from '@src/core/request/error';

import { convertDataToSend } from '@src/core/request/engines/helpers';
import type { RequestEngine, NormalizedCreateRequestOptions } from '@src/core/request/interface';

/**
 * Creates request by using XMLHttpRequest with the specified parameters and returns a promise
 * @param params
 */
const request: RequestEngine = (params) => {
	const
		p = params,
		xhr = new XMLHttpRequest();

	let
		[body, contentType] = convertDataToSend<BodyInit>(p.body, p.contentType);

	if (!IS_NODE && body instanceof FormData && contentType == null) {
		contentType = '';
	}

	xhr.open(p.method, p.url, true);

	if (p.timeout != null) {
		xhr.timeout = p.timeout;
	}

	switch (p.responseType) {
		case 'json':
		case 'text':
			xhr.responseType = 'text';
			break;

		case 'document':
			xhr.responseType = IS_NODE ? 'text' : 'document';
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

	return new AbortablePromise<Response>(async (resolve, reject, onAbort) => {
		const
			{status} = await AbortablePromise.resolve(isOnline(), p.parent);

		if (!status) {
			return reject(new RequestError('offline', {
				request: <NormalizedCreateRequestOptions>xhr
			}));
		}

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

		xhr.send(body);
	}, p.parent);
};

export default request;
