/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type Provider from '../../../../core/data';
import type { MockDictionary, Mock } from '../../../../core/data';
import type { MiddlewareParams } from '../../../../core/request';
import type { RequestMatchingData } from '../../../../core/data/middlewares/attach-mock/interface';
/**
 * Extracts mocks from the passed data provider class
 *
 * @param provider
 * @param opts - request options
 */
export declare function getProviderMocks(provider: Provider, opts: MiddlewareParams['opts']): Promise<MockDictionary | null>;
/**
 * Returns the best matching mock from the passed list for the given request data.
 * Otherwise, returns the first mock from the list.
 *
 * @param mocks - the available mocks
 * @param requestData
 */
export declare function findMockForRequestData(mocks: Mock[], requestData: RequestMatchingData): Mock | null;
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
export declare function calculateMockMatchScore(mock: Mock, requestData: RequestMatchingData): [number, number];
