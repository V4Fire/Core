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

import Then from 'core/then';
import * as env from 'core/env';

import Provider, { RequestError } from 'core/data';
import { Response, MiddlewareParams } from 'core/request';

import { MockOptions } from 'core/data/middlewares/attach-mock/interface';

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
 * Middleware: attaches mock data from .mocks
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

	if (mocksDecl == null || !Object.isString(id) || mockOpts.patterns.every((rgxp) => !rgxp.test(id))) {
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
				val = request[key],
				baseVal = opts[key];

			if (Object.isPlainObject(val)) {
				for (let keys = Object.keys(val), i = 0; i < keys.length; i++) {
					const
						key = keys[i];

					if (!Object.fastCompare(val[key], baseVal?.[key])) {
						currentRequest = undefined;
						break requestKeys;
					}
				}

				currentRequest = request;
				continue;
			}

			if (Object.fastCompare(baseVal, val)) {
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

	const customResponse = <typeof currentRequest>{
		status: undefined,
		responseType: undefined,
		decoders: undefined
	};

	let
		{response} = currentRequest;

	if (Object.isFunction(response)) {
		response = response.call(this, params, customResponse);
	}

	return () => Then.resolve(response, ctx.parent)
		.then((data) => {
			const response = new Response(data, {
				status: customResponse.status ?? currentRequest.status ?? 200,
				responseType: customResponse.responseType ?? currentRequest.responseType ?? opts.responseType,
				okStatuses: opts.okStatuses,
				decoder: currentRequest.decoders === false ? undefined : customResponse.decoders ?? ctx.decoders
			});

			if (!response.ok) {
				throw new RequestError('invalidStatus', {request: ctx.params, response});
			}

			return response;
		})

		.then(ctx.wrapAsResponse.bind(ctx));
}
