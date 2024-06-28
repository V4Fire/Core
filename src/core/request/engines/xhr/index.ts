/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/engines/xhr/README.md]]
 * @packageDocumentation
 */

//#if node_js
import XMLHttpRequest from 'xhr2';
//#endif

import AbortablePromise from 'core/promise/abortable';

import { IS_NODE } from 'core/env';
import { isOnline } from 'core/net';

import Response from 'core/request/response';
import RequestError from 'core/request/error';
import StreamBuffer from 'core/request/modules/stream-buffer';

import { convertDataToSend } from 'core/request/engines/helpers';
import type { RequestEngine, RequestResponseChunk } from 'core/request/interface';

/**
 * Creates request by using XMLHttpRequest with the specified parameters and returns a promise
 * @param params
 */
const request: RequestEngine = (params) => {
	const
		p = params,
		xhr = new XMLHttpRequest(),
		streamBuffer = new StreamBuffer<RequestResponseChunk>();

	let
		[body, contentType] = convertDataToSend(p.body, p.contentType);

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

	if (p.credentials !== false) {
		xhr.withCredentials = true;
	}

	if (p.headers) {
		for (const [name, val] of p.headers) {
			xhr.setRequestHeader(name, val);
		}
	}

	if (contentType != null) {
		xhr.setRequestHeader('Content-Type', contentType);
	}

	return new AbortablePromise<Response>(async (resolve, reject, onAbort) => {
		const
			{status} = await AbortablePromise.resolve(isOnline(), p.parent);

		if (!status) {
			return reject(new RequestError(RequestError.Offline));
		}

		onAbort((reason) => {
			streamBuffer.destroy(reason);
			xhr.abort();
		});

		const
			registeredEvents = Object.createDict<boolean>();

		p.emitter.on('newListener', (event: string) => {
			if (registeredEvents[event]) {
				return;
			}

			registeredEvents[event] = true;

			if (event.startsWith('upload.')) {
				xhr.upload.addEventListener(event.split('.').slice(1).join('.'), (e) => {
					p.emitter.emit(event, e);
				});

			} else {
				xhr.addEventListener(event, (e) => {
					p.emitter.emit(event, e);
				});
			}
		});

		p.emitter.emit('drainListeners');
		xhr.addEventListener('progress', (e: ProgressEvent) => {
			streamBuffer.add({
				total: e.total,
				loaded: e.loaded
			});
		});

		const getResponse = new Promise((resolve) => {
			xhr.addEventListener('load', () => {
				streamBuffer.close();
				resolve(xhr.response);
			});
		});

		getResponse[Symbol.asyncIterator] = streamBuffer[Symbol.asyncIterator].bind(streamBuffer);

		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState !== 2) {
				return;
			}

			const response = new Response(getResponse, {
				url: xhr.responseURL,
				redirected: p.url !== xhr.responseURL,

				parent: p.parent,
				important: p.important,

				okStatuses: p.okStatuses,
				noContentStatuses: p.noContentStatuses,
				status: xhr.status,
				statusText: xhr.statusText,

				headers: xhr.getAllResponseHeaders(),
				responseType: p.responseType,
				forceResponseType: p.forceResponseType,

				decoder: p.decoders,
				streamDecoder: p.streamDecoders,
				jsonReviver: p.jsonReviver
			});

			resolve(response);
		});

		xhr.addEventListener('error', (error) => {
			const
				requestError = new RequestError(RequestError.Engine, {error});

			streamBuffer.destroy(requestError);
			reject(new RequestError(RequestError.Engine, {error}));
		});

		xhr.addEventListener('timeout', () => {
			const
				requestError = new RequestError(RequestError.Timeout);

			streamBuffer.destroy(requestError);
			reject(requestError);
		});

		xhr.send(body);
	}, p.parent);
};

export default request;
