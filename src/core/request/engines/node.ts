/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import got, { Options, Response as GotResponse } from 'got';

import AbortablePromise from 'core/promise/abortable';
import { isOnline } from 'core/net';

import Response, { ResponseTypeValueP } from 'core/request/response';
import RequestError from 'core/request/error';

import { RequestEvents } from 'core/request/const';

import { writeableStreamMethods } from 'core/request/engines/const';

import StreamController from 'core/request/simple-stream-controller';

import { convertDataToSend } from 'core/request/engines/helpers';
import type { RequestEngine, NormalizedCreateRequestOptions, RequestChunk } from 'core/request/interface';

/**
 * Creates request by using node.js with the specified parameters and returns a promise
 * @param params
 */
const request: RequestEngine = (params) => {
	const
		p = params;

	const
		[body, contentType] = convertDataToSend(p.body);

	const
		headers = {...p.headers};

	if (contentType != null) {
		Object.assign(headers, {
			'Content-Type': contentType
		});
	}

	const normalizedOpts = <Options>{
		throwHttpErrors: false,
		method: p.method,
		timeout: p.timeout,
		retry: 0,
		headers,
		body
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
			stream = got.stream(p.url, <any>normalizedOpts),
			streamController = new StreamController<RequestChunk>();

		onAbort((err) => {
			streamController.destroy(err);
			stream.destroy();
		});

		if (needEndStream(normalizedOpts)) {
			stream.end();
		}

		p.eventEmitter.removeAllListeners('newListener');
		p.eventEmitter.on('newListener', (event) => {
			if (RequestEvents.includes(event)) {
				return;
			}

			stream.on(event, (...values: unknown[]) => {
				p.eventEmitter.emit(event, ...values);
			});
		});

		stream.on('error', (error) => {
			const
				type = error.name === 'TimeoutError' ? RequestError.Timeout : RequestError.Engine;

			reject(new RequestError(type, {error}));
		});

		stream.on('response', (response: GotResponse) => {
			const
				contentLength = <string | null>response.headers['content-length'],
				totalLength = contentLength != null ? Number(contentLength) : null;

			const rawBody = (async () => {
				let
					allChunks,
					receivedLength = 0;

				try {
					for await (const data of stream) {
						receivedLength += data.length;

						const chunk = {
							data,
							loaded: receivedLength,
							total: totalLength
						};

						p.eventEmitter.emit('progress', chunk);
						streamController.add(chunk);
					}

					streamController.close();
					allChunks = new Uint8Array(receivedLength);

					let pos = 0;

					for (const {data} of streamController) {
						if (data == null) {
							continue;
						}

						allChunks.set(data, pos);
						pos += data.length;
					}
				} catch {}

				return <Uint8Array>allChunks;
			})();

			let resBody: ResponseTypeValueP;

			switch (p.responseType) {
				case 'json':
				case 'document':
				case 'text':
					resBody = rawBody.then((buf: Uint8Array) => new TextDecoder('utf-8').decode(buf));
					break;

				default:
					resBody = rawBody.then((buf: Uint8Array) => buf.buffer);
			}

			const res = new Response(resBody, {
				parent: p.parent,
				important: p.important,
				responseType: p.responseType,
				okStatuses: p.okStatuses,
				status: response.statusCode,
				statusText: response.statusMessage,
				url: response.url,
				redirected: response.redirectUrls.length !== 0,
				headers: <Dictionary<string>>response.headers,
				jsonReviver: p.jsonReviver,
				decoder: p.decoders,
				streamController
			});

			p.eventEmitter.emit('response', res);
			resolve(res);
		});

		function needEndStream({body, method}: Options): boolean {
			return body == null && method != null && writeableStreamMethods.includes(method.toUpperCase());
		}

	}, p.parent);
};

export default request;
