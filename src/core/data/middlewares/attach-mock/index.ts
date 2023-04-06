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
import type { MockDictionary, MockCustomResponse, Mock } from 'core/data';
import { Response, MiddlewareParams } from 'core/request';

import type { MockOptions } from 'core/data/middlewares/attach-mock/interface';

export * from 'core/data/middlewares/attach-mock/interface';

type RequestMatchingData = Partial<Pick<MiddlewareParams['opts'], 'query' | 'body' | 'headers'>>;

interface MockBestMatch {
	score: number;
	mismatches: number;
	mock: Mock | null;
}

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
		{opts, ctx} = params,
		mocks = await getProviderMocks(this, opts);

	if (!mocks) {
		return;
	}

	const
		mock = findMockForRequestData(mocks[opts.method] ?? [], getRequestMatchingData(opts));

	if (!mock) {
		return;
	}

	const customResponse: MockCustomResponse = {
		status: undefined,
		responseType: undefined,
		decoders: undefined
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
				// FIXME: customResponse.decoders (Decoders) type doesn't match with ctx.decoders (WrappedDecoders)
				decoder: mock.decoders === false ? undefined : (<any>customResponse).decoders ?? ctx.decoders
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

/**
 * Extracts mocks from the provider
 *
 * @param provider
 * @param opts
 */
async function getProviderMocks(
	provider: Provider,
	opts: MiddlewareParams['opts']
): Promise<MockDictionary | null> {
	const
		id = opts.cacheId,
		mocksDecl = (<typeof Provider>provider.constructor).mocks ?? provider.mocks;

	const canIgnore =
		mocksDecl == null ||
		!Object.isString(id) ||
		mockOpts?.patterns.every((rgxp) => !RegExp.test(rgxp, id));

	if (canIgnore) {
		return null;
	}

	let mocks = await mocksDecl;

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (mocks == null) {
		return null;
	}

	if ('default' in mocks) {
		mocks = mocks.default;
	}

	return mocks;
}

/**
 * Returns request data needed for mock matching
 * @param opts
 */
function getRequestMatchingData(opts: MiddlewareParams['opts']): RequestMatchingData {
	const requestKeys = [
		'query',
		'body',
		'headers'
	];

	const requestData = {};

	for (let i = 0; i < requestKeys.length; i++) {
		const key = <keyof RequestMatchingData>requestKeys[i];
		if (opts[key] != null) {
			requestData[key] = opts[key];
		}
	}

	return requestData;
}

/**
 * Returns best matching mock for given request data or first mock
 *
 * @param mocks
 * @param requestData
 */
function findMockForRequestData(mocks: Mock[], requestData: RequestMatchingData): Mock | null {
	let bestMatch: MockBestMatch = {
		score: -1,
		mismatches: Number.MAX_SAFE_INTEGER,
		mock: null
	};

	for (let i = 0; i < mocks.length; i++) {
		const mock = mocks[i];

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (mock != null) {
			const [score, mismatches] = calculateMockMatchScore(mock, requestData);

			// Allow only non-comparable or matching mocks
			if (score !== 0 && score >= bestMatch.score && bestMatch.mismatches > mismatches) {
				bestMatch = {score, mismatches, mock};
			}
		}
	}

	// Return first mock if none match for legacy reasons
	return bestMatch.mock ?? mocks[0];
}

/**
 * Returns match score and mismatches of the mock to given request data
 *
 * if `score` is `-1` than mock is non-comparable \
 * if `score` is `0` than mock doesn't match the request data
 *
 * @param mock
 * @param requestData
 */
function calculateMockMatchScore(
	mock: Mock,
	requestData: RequestMatchingData
): [number, number] {
	const
		requestKeys = Object.keys(requestData);

	let
		score = 0,
		mismatches = 0;

	requestKeys: for (let i = 0; i < requestKeys.length; i++) {
		const key = requestKeys[i];

		if (!(key in mock)) {
			mismatches += 1;
			continue;
		}

		const
			valFromMock = mock[key],
			reqVal = requestData[key];

		if (Object.isPlainObject(valFromMock)) {
			for (let keys = Object.keys(valFromMock), i = 0; i < keys.length; i++) {
				const key = keys[i];

				if (!Object.fastCompare(valFromMock[key], reqVal[key])) {
					score = 0;
					break requestKeys;
				}
			}

			score += 1;
		} else if (Object.fastCompare(reqVal, valFromMock)) {
			score += 1;
		} else {
			score = 0;
		}
	}

	return [
		mismatches === requestKeys.length ? -1 : score,
		mismatches
	];
}
