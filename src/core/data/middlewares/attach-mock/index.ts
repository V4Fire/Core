/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/data/middlewares/attach-mock/README.md]]
 * @packageDocumentation
 */

import AbortablePromise from 'core/promise/abortable';
import * as env from 'core/env';

import Provider, { RequestError } from 'core/data';
import { Response, MiddlewareParams } from 'core/request';

import type { MockOptions } from 'core/data/middlewares/attach-mock/interface';

export * from 'core/data/middlewares/attach-mock/interface';

let
	mockOpts: CanUndef<MockOptions>;

const setConfig = (opts) => {
	const p = {
		patterns: [],
		...opts
	};

	mockOpts = p;

	if (!mockOpts) {
		return;
	}

	p.patterns = (p.patterns ?? []).map((el) => Object.isRegExp(el) ? el : new RegExp(el));
};

const optionsInitializer = env.get('mock').then(setConfig, setConfig);
env.emitter.on('set.mock', setConfig);
env.emitter.on('remove.mock', setConfig);

/**
 * Middleware: attaches mock data from the `mocks` property
 *
 * @param this
 * @param params
 */
export async function attachMock(this: Provider, params: MiddlewareParams): Promise<CanUndef<Function>> {
	if (mockOpts == null) {
		await optionsInitializer;
	}

	if (mockOpts == null) {
		return;
	}

	const
		{opts, ctx} = params;

	const
		id = opts.cacheId,
		mocksDecl = (<typeof Provider>this.constructor).mocks ?? this.mocks;

	const canIgnore =
		mocksDecl == null ||
		!Object.isString(id) ||
		mockOpts.patterns.every((rgxp) => !RegExp.test(rgxp, id));

	if (canIgnore) {
		return;
	}

	let
		mocks = await mocksDecl;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (mocks == null) {
		return;
	}

	if ('default' in mocks) {
		mocks = mocks.default;
	}

	const
		requests = mocks[String(opts.method)];

	if (requests == null) {
		return;
	}

	const requestKeys = [
		'query',
		'body',
		'headers'
	];

	let
		currentRequest;

	for (let i = 0; i < requests.length; i++) {
		const
			request = requests[i];

		if (request == null) {
			continue;
		}

		requestKeys: for (let keys = requestKeys, i = 0; i < keys.length; i++) {
			const
				key = keys[i];

			if (!(key in request)) {
				currentRequest = request;
				continue;
			}

			const
				valFromMock = request[key],
				reqVal = opts[key];

			if (Object.isPlainObject(valFromMock)) {
				for (let keys = Object.keys(valFromMock), i = 0; i < keys.length; i++) {
					const
						key = keys[i];

					if (!Object.fastCompare(valFromMock[key], reqVal?.[key])) {
						currentRequest = undefined;
						break requestKeys;
					}
				}

				currentRequest = request;
				continue;
			}

			if (Object.fastCompare(reqVal, valFromMock)) {
				currentRequest = request;
				continue;
			}

			currentRequest = undefined;
		}

		if (currentRequest != null) {
			break;
		}
	}

	if (currentRequest === undefined) {
		return;
	}

	const customResponse: typeof currentRequest = {
		status: undefined,
		responseType: undefined,
		decoders: undefined
	};

	let
		{response} = currentRequest;

	if (Object.isFunction(response)) {
		response = response.call(this, params, customResponse);
	}

	return () => AbortablePromise.resolve(response, ctx.parent)
		.then((data) => {
			const response = new Response(data, {
				status: customResponse.status ?? currentRequest.status ?? 200,
				responseType: customResponse.responseType ?? currentRequest.responseType ?? opts.responseType,
				okStatuses: opts.okStatuses,
				decoder: currentRequest.decoders === false ? undefined : customResponse.decoders ?? ctx.decoders
			});

			if (!response.ok) {
				throw AbortablePromise.wrapReasonToIgnore(new RequestError(RequestError.InvalidStatus, {
					request: ctx.params,
					response
				}));
			}

			return response;
		})

		.then(ctx.wrapAsResponse.bind(ctx));
}
