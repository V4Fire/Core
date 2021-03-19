/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Provider, { provider, providers } from 'core/data';

// Probably http://3878g.mocklab.io died
xdescribe('core/data', () => {
	it('simple provider', async () => {
		@provider
		class TestProvider extends Provider {
			static request = Provider.request({api: {url: 'http://3878g.mocklab.io'}});

			baseGetURL = 'json/1';

			baseAddURL = 'json';
		}

		const
			dp = new TestProvider();

		expect((await dp.get()).data)
			.toEqual({id: 1, value: 'things'});

		const spy = jasmine.createSpy();
		dp.emitter.on('add', (getData) => spy('add', getData()));

		expect((await dp.add({id: 12345, value: 'abc-def-ghi'})).data)
			.toEqual({message: 'Success'});
	});

	it('provider with overrides', async () => {
		@provider
		class TestOverrideProvider extends Provider {
			static request = Provider.request({api: {url: 'http://3878g.mocklab.io'}});
		}

		const
			dp = new TestOverrideProvider(),
			mdp = dp.name('bla').url('json');

		const spy = jasmine.createSpy();
		mdp.emitter.on('bla', (getData) => spy('bla', getData()));

		expect((await mdp.post({id: 12345, value: 'abc-def-ghi'})).data)
			.toEqual({message: 'Success'});

		expect(spy).toHaveBeenCalledWith('bla', {message: 'Success'});
	});

	it('namespaced provider with encoders/decoders', async () => {
		@provider('foo')
		// eslint-disable-next-line no-unused-vars
		class TestNamespacedProvider extends Provider {
			static encoders = {
				upd: [
					(data) => {
						data.value = data.value.join('-');
						return data;
					}
				]
			};

			static decoders = {
				get: [
					(data) => {
						data.id = String(data.id);
						return data;
					}
				]
			};

			baseGetURL = 'http://3878g.mocklab.io/json/1';

			updMethod = 'POST';

			baseUpdURL = 'http://3878g.mocklab.io/json';
		}

		const
			// eslint-disable-next-line new-cap
			dp = new providers['foo.TestNamespacedProvider']();

		expect((await dp.get()).data)
			.toEqual({id: '1', value: 'things'});

		const spy = jasmine.createSpy();
		dp.emitter.on('upd', (getData) => spy('upd', getData()));

		expect((await dp.upd({id: 12345, value: ['abc', 'def', 'ghi']})).data)
			.toEqual({message: 'Success'});

		expect(spy).toHaveBeenCalledWith('upd', {message: 'Success'});
	});

	it('get with extra providers', async () => {
		@provider
		class TestExtraProvider extends Provider {
			baseGetURL = 'http://3878g.mocklab.io/json/1';
		}

		@provider
		class TestProviderWithExtra extends Provider {
			alias = 'foo';

			baseGetURL = 'http://3878g.mocklab.io/json/1';

			extraProviders = () => ({
				TestExtraProvider: {
					alias: 'bla'
				},

				bar: {
					provider: new TestExtraProvider()
				}
			})
		}

		const
			dp = new TestProviderWithExtra();

		expect((await dp.get()).data).toEqual({
			bla: Object({id: 1, value: 'things'}),
			bar: Object({id: 1, value: 'things'}),
			foo: Object({id: 1, value: 'things'})
		});
	});
});
