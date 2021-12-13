/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import got, { Options, CancelableRequest, Response as GotResponse, GotStream } from 'got';

import AbortablePromise from 'core/promise/abortable';
import { isOnline } from 'core/net';

import Response, { ResponseTypeValueP } from 'core/request/response';
import RequestError from 'core/request/error';

import { convertDataToSend } from 'core/request/engines/helpers';
import type { RequestEngine, NormalizedCreateRequestOptions } from 'core/request/interface';

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
		isStream: true,
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
			stream = <ReturnType<GotStream>>got(p.url, normalizedOpts);

		onAbort(() => {
			stream.destroy();
		});

		const cachedChunks: Uint8Array[] = [];

		let
			receivedLength = 0,
			resBody: ResponseTypeValueP;

		let pendingChunk: ReturnType<typeof createResolvablePromise> | null = createResolvablePromise();

		const rawBody = new AbortablePromise<Uint8Array>((resolve) => {
			stream.on('end', () => {
				const allChunks = new Uint8Array(receivedLength);

				let pos = 0;

				for (const chunk of cachedChunks) {
					allChunks.set(chunk, pos);
					pos += chunk.length;
				}

				pendingChunk!.resolveNow();
				pendingChunk = null;
				resolve(allChunks);
			});
		}, p.parent);

		stream.on('data', (chunk) => {
			cachedChunks.push(chunk);
			receivedLength += chunk.length;
			pendingChunk!.resolveNow();
			pendingChunk = createResolvablePromise();
		});

		stream.on('error', (error) => {
			const type = error.name === 'TimeoutError' ? RequestError.Timeout : RequestError.Engine;
			reject(new RequestError(type, {error}));
		});

		switch (p.responseType) {
			case 'json':
			case 'document':
			case 'text':
				resBody = rawBody.then((buf) => new TextDecoder('utf-8').decode(buf));
				break;

			default:
				resBody = rawBody.then((buf) => buf.buffer);
		}

		stream.on('response', (res) => {
			const result = new Response(Object.cast(resBody), {
				parent: p.parent,
				important: p.important,
				responseType: p.responseType,
				okStatuses: p.okStatuses,
				status: res.statusCode,
				headers: <Dictionary<string>>res.headers,
				jsonReviver: p.jsonReviver,
				decoder: p.decoders
			});

			result[Symbol.asyncIterator] = async function* iter() {
				try {
					let pos = 0;

					while (true) {
						if (pos < cachedChunks.length) {
							yield cachedChunks[pos];
							pos++;
							continue;
						}

						if (!pendingChunk) {
							return;
						}

						await pendingChunk;
					}
				} catch {}
			};

			resolve(result);
		});

	}, p.parent);

	function createResolvablePromise(): AbortablePromise<undefined> & { resolveNow(): void } {
		let promiseResolve;

		const promise = <AbortablePromise<undefined> & { resolveNow(): void }>new AbortablePromise<undefined>(
			(resolve) => {
				promiseResolve = resolve;
			},
			p.parent
		);

		promise.resolveNow = promiseResolve;
		return promise;
	}
};

export default request;
