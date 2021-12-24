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

import AbortablePromise from 'core/promise/abortable';

import { IS_NODE } from 'core/env';
import { isOnline } from 'core/net';

import Response from 'core/request/response';
import RequestError from 'core/request/error';

import { convertDataToSend } from 'core/request/engines/helpers';
import type { RequestEngine, NormalizedCreateRequestOptions, RequestChunk } from 'core/request/interface';

import StreamController from 'core/request/simple-stream-controller';

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
			{status} = await AbortablePromise.resolve(isOnline(), p.parent),
			streamController = new StreamController<RequestChunk>();

		if (!status) {
			return reject(new RequestError(RequestError.Offline, {
				request: <NormalizedCreateRequestOptions>xhr
			}));
		}

		onAbort(() => {
			xhr.abort();
		});

		xhr.addEventListener('onprogress', (event: ProgressEvent) => {
			streamController.add({data: null, ...Object.select(event, ['loaded', 'total'])});
		});

		const resBody = new Promise((resolve) => {
			xhr.addEventListener('load', () => {
				streamController.close();
				resolve(xhr.response);
			});
		});

		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState !== 2) {
				return;
			}

			const redirected = xhr.status === 301 || xhr.status === 302;

			resolve(new Response(resBody, {
				parent: p.parent,
				important: p.important,
				redirected: redirected || undefined,
				responseType: p.responseType,
				okStatuses: p.okStatuses,
				status: xhr.status,
				statusText: xhr.statusText,
				headers: xhr.getAllResponseHeaders(),
				decoder: p.decoders,
				jsonReviver: p.jsonReviver,
				streamController
			}));
		});

		xhr.addEventListener('error', (error) => {
			const requestError = new RequestError(RequestError.Engine, {error});

			streamController.destroy(requestError);
			reject(requestError);
		});

		xhr.addEventListener('timeout', () => {
			const requestError = new RequestError(RequestError.Timeout);

			streamController.destroy(requestError);
			reject(requestError);
		});

		xhr.send(body);
	}, p.parent);
};

export default request;
