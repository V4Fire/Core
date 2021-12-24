import nodeFetch from 'node-fetch';

const mockFetch: typeof fetch = async (input, init?) => {
	const
		response = await nodeFetch(input, init),
		stream = response.body;

	Object.defineProperty(response, 'body', {
		get() {
			return {
				getReader(): ReadableStreamDefaultReader<Uint8Array> {
					const iter = stream[Symbol.asyncIterator]();

					return <ReadableStreamDefaultReader<Uint8Array>>{
						read(): Promise<ReadableStreamDefaultReadResult<Uint8Array>> {
							return <Promise<ReadableStreamDefaultReadResult<Uint8Array>>>iter.next();
						}
					};
				}
			};
		}
	});

	return <Response>response;
};

export default mockFetch;
