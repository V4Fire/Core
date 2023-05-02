/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Provider from 'core/data';
import type { MockDictionary, Mock } from 'core/data';

import type { MiddlewareParams } from 'core/request';

import { mockOpts } from 'core/data/middlewares/attach-mock/const';
import type { RequestMatchingData, MockBestMatch } from 'core/data/middlewares/attach-mock/interface';

/**
 * Extracts mocks from the passed data provider class
 *
 * @param provider
 * @param opts - request options
 */
export async function getProviderMocks(
	provider: Provider,
	opts: MiddlewareParams['opts']
): Promise<MockDictionary | null> {
	const
		id = opts.cacheId,
		mocksDecl = (<typeof Provider>provider.constructor).mocks ?? provider.mocks;

	const canIgnore =
		mocksDecl == null ||
		!Object.isString(id) ||
		mockOpts.value?.patterns.every((rgxp) => !RegExp.test(rgxp, id));

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
 * Returns the best matching mock from the passed list for the given request data.
 * Otherwise, returns the first mock from the list.
 *
 * @param mocks - the available mocks
 * @param requestData
 */
export function findMockForRequestData(mocks: Mock[], requestData: RequestMatchingData): Mock | null {
	let bestMatch: MockBestMatch = {
		score: -1,
		mismatches: Number.MAX_SAFE_INTEGER,
		mock: null
	};

	mocks.forEach((mock) => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (mock != null) {
			const [score, mismatches] = calculateMockMatchScore(mock, requestData);

			// Allow only non-comparable or matching mocks
			if (score !== 0 && score >= bestMatch.score && bestMatch.mismatches > mismatches) {
				bestMatch = {score, mismatches, mock};
			}
		}
	});

	// Return first mock if none match for legacy reasons
	return bestMatch.mock ?? mocks[0];
}

/**
 * Returns the match/mismatch score of the passed mock for the given request data.
 *
 * If `score` is `-1` than the mock is non-comparable.
 * If `score` is `0` than the mock doesn't match the request data.
 *
 * @param mock
 * @param requestData
 *
 * @example
 * ```js
 * const requestData = {query: 'Abracadabra', headers: {accept: 'application/json'}};
 *
 * calculateMockMatchScore({}, requestData) // [-1, 2]
 * calculateMockMatchScore({query: 'Foo'}, requestData) // [0, 1]
 * calculateMockMatchScore({query: 'Abracadabra'}, requestData) // [1, 1]
 * calculateMockMatchScore(
 *  {query: 'Abracadabra', headers: {accept: 'application/json'}},
 *  requestData
 * ) // [2, 0]
 * ```
 */
export function calculateMockMatchScore(
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
