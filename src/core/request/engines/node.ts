/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import got, { Options, CancelableRequest, Response as GotResponse } from 'got';

import AbortablePromise from '@src/core/promise/abortable';
import { isOnline } from '@src/core/net';

import Response from '@src/core/request/response';
import RequestError from '@src/core/request/error';

import { convertDataToSend } from '@src/core/request/engines/helpers';
import type { RequestEngine, NormalizedCreateRequestOptions } from '@src/core/request/interface';

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

	if (p.responseType != null) {
		let
			v;

		switch (p.responseType) {
			case 'json':
			case 'document':
				v = 'text';
				break;

			case 'arrayBuffer':
			case 'blob':
				v = 'buffer';
				break;

			default:
				v = p.responseType.toLowerCase();
		}

		normalizedOpts.responseType = v;

	} else {
		normalizedOpts.responseType = 'buffer';
	}

	return new AbortablePromise<Response>(async (resolve, reject, onAbort) => {
		const
			{status} = await AbortablePromise.resolve(isOnline(), p.parent);

		if (!status) {
			return reject(new RequestError(RequestError.Offline, {
				request: <NormalizedCreateRequestOptions>normalizedOpts
			}));
		}

		const
			request = <CancelableRequest<GotResponse>>got(p.url, normalizedOpts);

		onAbort(() => {
			request.cancel();
		});

		request.then((res) => {
			resolve(new Response(Object.cast(res.body), {
				parent: p.parent,
				important: p.important,
				responseType: p.responseType,
				okStatuses: p.okStatuses,
				status: res.statusCode,
				headers: <Dictionary<string>>res.headers,
				jsonReviver: p.jsonReviver,
				decoder: p.decoders
			}));

		}, (error) => {
			const type = error.name === 'TimeoutError' ? RequestError.Timeout : RequestError.Engine;
			reject(new RequestError(type, {error}));
		});

	}, p.parent);
};

export default request;
