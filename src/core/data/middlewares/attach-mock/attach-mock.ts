/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import AbortablePromise from 'core/promise/abortable';

import Provider, { RequestError } from 'core/data';
import type { MockCustomResponse } from 'core/data';

import { Response, MiddlewareParams } from 'core/request';

import { mockOpts, optionsInitializer } from 'core/data/middlewares/attach-mock/const';
import { getProviderMocks, findMockForRequestData } from 'core/data/middlewares/attach-mock/helpers';

/**
 * Middleware: attaches mock data from the `mocks` property
 * @param params
 */
export async function attachMock(this: Provider, params: MiddlewareParams): Promise<CanUndef<Function>> {
	if (mockOpts.value == null) {
		await optionsInitializer;
	}

	if (mockOpts.value == null) {
		return;
	}

	const
		{opts, ctx} = params,
		mocks = await getProviderMocks(this, opts);

	if (mocks == null) {
		return;
	}

	const
		requestData = Object.select(opts, ['query', 'body', 'headers']),
		mock = findMockForRequestData(mocks[opts.method] ?? [], requestData);

	if (mock == null) {
		return;
	}

	const customResponse: MockCustomResponse = {
		status: undefined,
		responseType: undefined,
		decoders: undefined,
		headers: undefined
	};

	let
		{response} = mock;

	if (Object.isFunction(response)) {
		response = response.call(this, params, customResponse);
	}

	return () => AbortablePromise.resolve(response, ctx.parent)
		.then((data) => {
			const response = new Response(data, {
				status: customResponse.status ?? mock.status ?? 200,
				responseType: customResponse.responseType ?? (<any>mock).responseType ?? opts.responseType,
				okStatuses: opts.okStatuses,
				decoder: mock.decoders === false ? undefined : customResponse.decoders ?? ctx.decoders,
				headers: customResponse.headers ?? mock.headers
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
