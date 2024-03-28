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

import got, { Options, Response as GotResponse } from 'got';

import AbortablePromise from 'core/promise/abortable';
import { isOnline } from 'core/net';

import Response from 'core/request/response';
import RequestError from 'core/request/error';
import StreamBuffer from 'core/request/modules/stream-buffer';

import { convertDataToSend } from 'core/request/engines/helpers';
import { writeableStreamMethods } from 'core/request/engines/fetch/const';
import type { RequestEngine, RequestResponseChunk } from 'core/request/interface';

/**
 * Creates request by using node.js with the specified parameters and returns a promise
 * @param params
 */
const request: RequestEngine = (params) => {
	const
		p = params,
		streamBuffer = new StreamBuffer<RequestResponseChunk>();

	const
		[body, contentType] = convertDataToSend(p.body);

	const
		headers = {...p.headers};

	if (contentType != null) {
		Object.assign(headers, {
			'content-type': contentType
		});
	}

	const gotOpts = <Options>{
		body,
		headers,
		method: p.method,
		throwHttpErrors: false,
		timeout: p.timeout,
		retry: 0
	};

	return new AbortablePromise<Response>(async (resolve, reject, onAbort) => {
		const
			{status} = await AbortablePromise.resolve(isOnline(), p.parent);

		if (!status) {
			return reject(new RequestError(RequestError.Offline));
		}

		const
			stream = got.stream(p.url, Object.cast(gotOpts));

		onAbort((reason) => {
			streamBuffer.destroy(reason);
			stream.destroy();
		});

		if (needEndStream(gotOpts)) {
			stream.end();
		}

		const
			registeredEvents = Object.createDict<boolean>();

		p.emitter.on('newListener', (event: string) => {
			if (registeredEvents[event]) {
				return;
			}

			registeredEvents[event] = true;
			stream.on(event, (e) => p.emitter.emit(event, e));
		});

		p.emitter.emit('drainListeners');

		stream.on('error', (error) => {
			const
				type = error.name === 'TimeoutError' ? RequestError.Timeout : RequestError.Engine,
				requestError = new RequestError(type, {error});

			streamBuffer.destroy(requestError);
			reject(requestError);
		});

		stream.on('response', (response: GotResponse) => {
			const
				contentLength = <string | null>response.headers['content-length'],
				total = contentLength != null ? Number(contentLength) : undefined;

			let
				loaded = 0;

			(async () => {
				try {
					for await (const data of stream) {
						loaded += data.length;
						streamBuffer.add({total, loaded, data});
					}

					streamBuffer.close();
				} catch {}
			})();

			const getResponse = async () => {
				const
					completeData: Array<[number, Uint8Array]> = [];

				let
					pos = 0;

				for await (const {data} of streamBuffer) {
					if (data == null) {
						continue;
					}

					completeData.push([pos, data]);
					pos += data.length;
				}

				return completeData.reduce(
					(buffer, [pos, data]) => {
						buffer.set(data, pos);
						return buffer;
					},

					new Uint8Array(loaded)
				).buffer;
			};

			getResponse[Symbol.asyncIterator] = streamBuffer[Symbol.asyncIterator].bind(streamBuffer);

			const res = new Response(getResponse, {
				url: response.url,
				redirected: response.redirectUrls.length !== 0,

				parent: p.parent,
				important: p.important,

				okStatuses: p.okStatuses,
				status: response.statusCode,
				statusText: response.statusMessage,

				headers: Object.cast(response.headers),
				responseType: p.responseType,
				forceResponseType: p.forceResponseType,

				decoder: p.decoders,
				streamDecoder: p.streamDecoders,
				jsonReviver: p.jsonReviver
			});

			resolve(res);
		});

		function needEndStream({body, method}: Options): boolean {
			return body == null && method != null && writeableStreamMethods[method.toUpperCase()];
		}

	}, p.parent);
};

export default request;
