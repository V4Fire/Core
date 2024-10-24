import { Response } from 'core/request';
import V4Headers from 'core/request/headers';

describe('core/request/response', () => {
	test([
		'should successfully handle a request with the Content-Type: application/octet-stream header',
		'and an empty response body'
	].join(' '), async () => {

		const response = new Response(Promise.resolve(''), {
			url: 'url/url',
			headers: new V4Headers({
				'Content-Type': 'application/octet-stream'
			})
		});

		await expect(response.decode()).resolves.toBeInstanceOf(ArrayBuffer);
	})
})
