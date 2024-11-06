/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/request/engines/fetch/README.md]]
 * @packageDocumentation
 */

import AbortablePromise from 'core/promise/abortable';
import { isOnline } from 'core/net';

import Response from 'core/request/response';
import RequestError from 'core/request/error';
import StreamBuffer from 'core/request/modules/stream-buffer';

import { convertDataToSend } from 'core/request/engines/helpers';
import type { RequestEngine, RequestResponseChunk } from 'core/request/interface';

/**
 * Creates request by using the fetch API with the specified parameters and returns a promise
 * @param params
 */
const request: RequestEngine = (params) => {
	const
		p = params,
		abortController = new AbortController(),
		streamBuffer = new StreamBuffer<RequestResponseChunk>();

	const
		[body, contentType] = convertDataToSend(p.body, p.contentType);

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

	let
		credentials: RequestCredentials = 'same-origin';

	if (Object.isString(p.credentials)) {
		credentials = p.credentials;

	} else if (p.credentials) {
		credentials = 'include';
	}

	let
		redirect: RequestRedirect = 'follow';

	if (Object.isString(p.redirect)) {
		redirect = p.redirect;
	}

	const fetchOpts: RequestInit = {
		body,
		headers,
		credentials,
		redirect,
		method: p.method,
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

			const getResponse = () => {
				switch (p.responseType) {
					case 'json':
					case 'document':
					case 'text':
						return res.text();

					case 'formData':
						return res.formData();

					default:
						return res.arrayBuffer();
				}
			};

			getResponse[Symbol.asyncIterator] = () => {
				const
					contentLength = res.headers.get('Content-Length'),
					total = contentLength != null ? Number(contentLength) : undefined;

				let
					loaded = 0;

				if (res.body != null) {
					const
						reader: ReadableStreamDefaultReader<Uint8Array> = res.body.getReader();

					(async () => {
						// eslint-disable-next-line no-constant-condition
						while (true) {
							const
								{done, value: data} = await reader.read();

							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
				type: res.type,

				parent: p.parent,
				important: p.important,

				okStatuses: p.okStatuses,
				noContentStatuses: p.noContentStatuses,
				status: res.status,
				statusText: res.statusText,

				headers: res.headers,
				responseType: p.responseType,
				forceResponseType: p.forceResponseType,

				decoder: p.decoders,
				streamDecoder: p.streamDecoders,
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
