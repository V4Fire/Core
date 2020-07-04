/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Provider, { provider, providers } from 'core/data';

describe('core/data', () => {
	@provider
	class TestProvider extends Provider {
		static request = Provider.request({api: {url: 'http://3878g.mocklab.io'}});

		baseGetURL = 'json/1';

		baseAddURL = 'json';
	}

	@provider('foo')
	// eslint-disable-next-line no-unused-vars
	class TestNamespacedProvider extends Provider {
		static encoders = {
			add: [
				(data) => {
					data.value = data.value.join('-');
					return data;
				}
			]
		};

		baseGetURL = 'http://3878g.mocklab.io/json/1';

		baseAddURL = 'http://3878g.mocklab.io/json';
	}

	it('simple provider', async () => {
		const
			provider = new TestProvider();

		expect((await provider.get()).data)
			.toEqual({id: 1, value: 'things'});

		const spy = jasmine.createSpy();
		provider.emitter.on('add', (getData) => spy('add', getData()));

		expect((await provider.add({id: 12345, value: 'abc-def-ghi'})).data)
			.toEqual({message: 'Success'});

		expect(spy).toHaveBeenCalledWith('add', {message: 'Success'});
	});

	it('namespaced provider with encoders', async () => {
		const
			// eslint-disable-next-line new-cap
			provider = new providers['foo.TestNamespacedProvider']();

		expect((await provider.get()).data)
			.toEqual({id: 1, value: 'things'});

		const spy = jasmine.createSpy();
		provider.emitter.on('add', (getData) => spy('add', getData()));

		expect((await provider.add({id: 12345, value: ['abc', 'def', 'ghi']})).data)
			.toEqual({message: 'Success'});

		expect(spy).toHaveBeenCalledWith('add', {message: 'Success'});
	});
});
