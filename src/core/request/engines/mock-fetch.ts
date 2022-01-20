/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import nodeFetch from 'node-fetch';

const mockFetch: typeof fetch = async (input, init?) => {
	const
		response = await nodeFetch(input, init),
		stream = response.body;

	Object.defineProperty(response, 'body', {
		get() {
			return {
				getReader(): ReadableStreamDefaultReader<Uint8Array> {
					const
						iter = stream[Symbol.asyncIterator]();

					return Object.cast({
						read(): Promise<ReadableStreamDefaultReadResult<Uint8Array>> {
							return iter.next();
						}
					});
				}
			};
		}
	});

	return <Response>response;
};

export default mockFetch;
