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

import Response, { ResponseTypeValueP, ResponseTypeValue } from 'core/request/response';
import RequestError from 'core/request/error';

import StreamController from 'core/request/simple-stream-controller';

import { convertDataToSend } from 'core/request/engines/helpers';
import type { RequestEngine, NormalizedCreateRequestOptions, RequestChunk } from 'core/request/interface';

/**
 * Creates request by using the fetch API with the specified parameters and returns a promise
 * @param params
 */
const request: RequestEngine = (params) => {
	const
		p = params,
		controller = new AbortController();

	const
		[body, contentType] = convertDataToSend<BodyInit>(p.body, p.contentType);

	const
		headers: Record<string, string> = {};

	if (p.headers != null) {
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

	return new AbortablePromise<Response>(async (resolve, reject, onAbort) => {
		const
			{status} = await AbortablePromise.resolve(isOnline(), p.parent);

		if (!status) {
			return reject(new RequestError(RequestError.Offline, {
				request: <NormalizedCreateRequestOptions>normalizedOpts
			}));
		}

		const
			req = fetch(p.url, normalizedOpts),
			streamController = new StreamController<RequestChunk>();

		let
			timer;

		if (p.timeout != null) {
			timer = setTimeout(() => controller.abort(), p.timeout);
		}

		onAbort((err) => {
			streamController.destroy(err);
			controller.abort();
		});

		req.then((response) => {
			clearTimeout(timer);

			const
				contentLength = response.headers.get('Content-Length'),
				totalLength = contentLength != null ? Number(contentLength) : null;

			const rawBody = (async () => {
				let receivedLength = 0;

				if (response.body != null) {
					const reader: ReadableStreamDefaultReader<Uint8Array> = response.body.getReader();

					while (true) {
						const {done, value} = await reader.read();

						if (done) {
							streamController.close();
							break;
						}

						receivedLength += value!.length;

						const chunk = {
							data: value ?? null,
							loaded: receivedLength,
							total: totalLength
						};

						p.eventEmitter.emit('progress', chunk);
						streamController.add(chunk);
					}
				}

				const allChunks = new Uint8Array(receivedLength);

				let pos = 0;

				for (const {data} of streamController) {
					if (data == null) {
						continue;
					}

					allChunks.set(data, pos);
					pos += data.length;
				}

				return allChunks;
			})();

			let
				body: ResponseTypeValueP;

			const
				headers: Dictionary<string> = {};

			response.headers.forEach((value, name) => {
				headers[name] = value;
			});

			switch (p.responseType) {
				case 'json':
				case 'document':
				case 'text':
					body = rawBody.then((buf) => new TextDecoder('utf-8').decode(buf));
					break;

				default:
					body = rawBody.then((buf) => buf.buffer);
			}

			const res = new Response(body, {
				parent: p.parent,
				important: p.important,
				url: response.url,
				redirected: response.redirected,
				responseType: p.responseType,
				okStatuses: p.okStatuses,
				status: response.status,
				statusText: response.statusText,
				headers,
				decoder: p.decoders,
				jsonReviver: p.jsonReviver,
				streamController,
				eventEmitter: p.eventEmitter
			});

			p.eventEmitter.emit('response', res);
			resolve(res);

		}, (error) => {
			clearTimeout(timer);

			const
				type = error.name === 'AbortError' ? RequestError.Timeout : RequestError.Engine;

			reject(new RequestError(type, {error}));
		});

	}, p.parent);
};

export default request;
