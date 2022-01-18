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

import Response, { ResponseTypeValue, ResponseTypeValueP } from 'core/request/response';
import RequestError from 'core/request/error';

import { RequestEvents } from 'core/request/const';

import { writeableStreamMethods } from 'core/request/engines/const';

import { SimpleStreamController, PersistentStreamController, hookNames } from 'core/request/stream-controller';

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

	const streamController = p.stream ?
		new SimpleStreamController<RequestChunk>() :
		new PersistentStreamController<RequestChunk>();

	const
		readStream = createStreamReader();

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
			stream = got.stream(p.url, <any>normalizedOpts);

		onAbort((reason) => {
			p.eventEmitter.emit(RequestEvents.ABORT, reason);
			streamController.destroy(reason);
			stream.destroy();
		});

		if (needEndStream(normalizedOpts)) {
			stream.end();
		}

		p.eventEmitter.removeAllListeners('newListener');
		p.eventEmitter.on('newListener', (event, listener) => {
			if (Object.values(RequestEvents).includes(event)) {
				return;
			}

			stream.on(event, listener);
		});

		p.eventEmitter.removeAllListeners('removeListener');
		p.eventEmitter.on('removeListener', (event, listener) => {
			if (Object.values(RequestEvents).includes(event)) {
				return;
			}

			stream.off(event, listener);
		});

		stream.on('error', (error) => {
			const
				type = error.name === 'TimeoutError' ? RequestError.Timeout : RequestError.Engine,
				requestError = new RequestError(type, {error});

			streamController.destroy(requestError);
			reject(requestError);
		});

		stream.on('response', (response: GotResponse) => {
			const
				contentLength = <string | null>response.headers['content-length'],
				totalLength = contentLength != null ? Number(contentLength) : null;

			let
				resBody: ResponseTypeValueP;

			if (p.stream) {
				streamController.addHook(hookNames.ASYNC_ITERATOR, () => {
					void readStream(stream, totalLength);
				});

				resBody = null;

			} else {
				const rawBody = (async () => {
					const
						receivedLength = await readStream(stream, totalLength).catch(() => 0),
						allChunks = new Uint8Array(receivedLength);

					let
						pos = 0;

					for (const {data} of streamController) {
						if (data == null) {
							continue;
						}

						allChunks.set(data, pos);
						pos += data.length;
					}

					return allChunks;
				})();

				switch (p.responseType) {
					case 'json':
					case 'document':
					case 'text':
						resBody = rawBody.then((buf: Uint8Array) => new TextDecoder('utf-8').decode(buf));
						break;

					default:
						resBody = rawBody.then((buf: Uint8Array) => buf.buffer);
				}

				resBody = (<Promise<ResponseTypeValue>>resBody).then((data) => {
					p.eventEmitter.emit(RequestEvents.LOAD, data);
					return data;
				});
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

			p.eventEmitter.emit(RequestEvents.RESPONSE, res);
			resolve(res);
		});

		function needEndStream({body, method}: Options): boolean {
			return body == null && method != null && writeableStreamMethods.includes(method.toUpperCase());
		}

	}, p.parent);

	function createStreamReader(): (stream: ReturnType<typeof got.stream>, total: number | null) => Promise<number> {

		let
			promise: Promise<number> | null = null;

		return (stream: ReturnType<typeof got.stream>, totalLength: number | null): Promise<number> => {
			if (promise != null) {
				return promise;
			}

			promise = (async () => {
				let
					receivedLength = 0;

				for await (const data of stream) {
					receivedLength += data.length;

					const chunk = {
						data,
						loaded: receivedLength,
						total: totalLength
					};

					p.eventEmitter.emit(RequestEvents.PROGRESS, chunk);
					streamController.add(chunk);
				}

				streamController.close();

				return receivedLength;
			})();

			return promise;
		};
	}
};

export default request;
