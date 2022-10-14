/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import nodeFetch from 'node-fetch';

const node: typeof fetch = async (input, init?) => {
	const
		response = await nodeFetch(input, init),
		{body} = response;

	Object.defineProperty(response, 'body', {
		get() {
			body.getReader = () => {
				const
					iter = body[Symbol.asyncIterator]();

				return Object.cast({
					read: () => iter.next()
				});
			};

			return body;
		}
	});

	return <Response>response;
};

export default node;
