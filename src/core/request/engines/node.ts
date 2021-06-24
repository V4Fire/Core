/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import got, { Options, CancelableRequest, Response as GotResponse } from 'got';

import Then from 'core/then';
import Response from 'core/request/response';
import RequestError from 'core/request/error';

import { convertDataToSend } from 'core/request/engines/helpers';
import type { RequestEngine } from 'core/request/interface';

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

	return new Then<Response>((resolve, reject, onAbort) => {
		const
			request = <CancelableRequest<GotResponse>>got(p.url, normalizedOpts);

		onAbort(() => {
			request.cancel();
		});

		request.then((res) => {
			resolve(new Response(<any>res.body, {
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
			const type = error.name === 'TimeoutError' ? 'timeout' : 'engine';
			reject(new RequestError(type, {error}));
		});

	}, p.parent);
};

export default request;
