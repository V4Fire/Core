/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

//#if node_js
import fetch from 'core/request/engines/mock-fetch';
//#endif

import AbortablePromise from 'core/promise/abortable';
import { isOnline } from 'core/net';

import Response from 'core/request/response';
import RequestError from 'core/request/error';
import StreamBuffer from 'core/request/modules/stream-buffer';

import { convertDataToSend } from 'core/request/engines/helpers';
import type { RequestEngine, RequestChunk } from 'core/request/interface';

/**
 * Creates request by using the fetch API with the specified parameters and returns a promise
 * @param params
 */
const request: RequestEngine = (params) => {
	const
		p = params,
		abortController = new AbortController(),
		streamBuffer = new StreamBuffer<RequestChunk>();

	const
		[body, contentType] = convertDataToSend<BodyInit>(p.body, p.contentType);

	const
		headers: Record<string, string> = {};

	if (p.headers != null) {
		for (const [name, val] of p.headers) {
			headers[name] = val;
		}
	}

	if (contentType != null) {
		headers['Content-Type'] = contentType;
	}

	const fetchOpts: RequestInit = {
		body,
		headers,
		method: p.method,
		credentials: p.credentials ? 'include' : 'same-origin',
		signal: abortController.signal
	};

	return new AbortablePromise<Response>(async (resolve, reject, onAbort) => {
		const
			{status} = await AbortablePromise.resolve(isOnline(), p.parent);

		if (!status) {
			return reject(new RequestError(RequestError.Offline));
		}

		const
			req = fetch(p.url, fetchOpts);

		let
			timer;

		if (p.timeout != null) {
			timer = setTimeout(() => abortController.abort(), p.timeout);
		}

		onAbort((reason) => {
			streamBuffer.destroy(reason);
			abortController.abort();
		});

		req.then((res) => {
			clearTimeout(timer);

			const
				contentLength = res.headers.get('Content-Length'),
				total = contentLength != null ? Number(contentLength) : undefined;

			const getResponse = () => {
				switch (p.responseType) {
					case 'json':
					case 'document':
					case 'text':
						return res.text();

					default:
						return res.arrayBuffer();
				}
			};

			getResponse[Symbol.asyncIterator] = () => {
				let
					loaded = 0;

				if (res.body != null) {
					const
						reader: ReadableStreamDefaultReader<Uint8Array> = res.body.getReader();

					(async () => {
						while (true) {
							const
								{done, value: data} = await reader.read();

							if (done || data == null) {
								streamBuffer.close();
								break;
							}

							loaded += data.length;
							streamBuffer.add({total, loaded, data});
						}
					})();
				}

				return streamBuffer[Symbol.asyncIterator]();
			};

			resolve(new Response(getResponse, {
				url: res.url,
				redirected: res.redirected,

				parent: p.parent,
				important: p.important,

				okStatuses: p.okStatuses,
				status: res.status,
				statusText: res.statusText,

				headers: res.headers,
				responseType: p.responseType,

				decoder: p.decoders,
				jsonReviver: p.jsonReviver
			}));

		}, (error) => {
			clearTimeout(timer);

			const
				type = error.name === 'AbortError' ? RequestError.Timeout : RequestError.Engine,
				requestError = new RequestError(type, {error});

			streamBuffer.destroy(requestError);
			reject(requestError);
		});

	}, p.parent);
};

export default request;
