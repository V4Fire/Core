/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable capitalized-comments,no-tabs */

import express from 'express';
import Provider, { provider, providers } from 'core/data';

describe('core/data', () => {
	let server;

	beforeEach(() => {
		if (server) {
			server.close();
		}

		server = createServer();
	});

	afterAll((done) => {
		server.close(done);
	});

	it('simple provider', async () => {
		@provider
		class TestProvider extends Provider {
			static request = Provider.request({api: {url: 'http://localhost:3000/'}});

			baseGetURL = 'json/1';

			baseAddURL = 'json';
		}

		const
			dp = new TestProvider();

		expect(await dp.get().data)
			.toEqual({id: 1, value: 'things'});

		const spy = jest.fn();
		dp.emitter.on('add', (getData) => spy('add', getData()));

		expect(await dp.add({id: 12345, value: 'abc-def-ghi'}).data)
			.toEqual({message: 'Success'});
	});

	it('provider with overrides', async () => {
		@provider
		class TestOverrideProvider extends Provider {
			static request = Provider.request({api: {url: 'http://localhost:3000/'}});
		}

		const
			dp = new TestOverrideProvider(),
			mdp = dp.name('bla').url('json');

		const spy = jest.fn();
		mdp.emitter.on('bla', async (getData) => spy('bla', await getData()));

		expect(await mdp.post({id: 12345, value: 'abc-def-ghi'}).data)
			.toEqual({message: 'Success'});

		expect(spy).toHaveBeenCalledWith('bla', {message: 'Success'});
	});

	it('namespaced provider with encoders/decoders', async () => {
		@provider('foo')
		// eslint-disable-next-line no-unused-vars
		class TestNamespacedProvider extends Provider {
			static encoders = {
				update: [
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

			baseGetURL = 'http://localhost:3000/json/1';

			updateMethod = 'POST';

			baseUpdateURL = 'http://localhost:3000/json';
		}

		const
			// eslint-disable-next-line new-cap
			dp = new providers['foo.TestNamespacedProvider']();

		expect(await dp.get().data)
			.toEqual({id: '1', value: 'things'});

		const spy = jest.fn();
		dp.emitter.on('update', async (getData) => spy('update', await getData()));

		expect(await dp.update({id: 12345, value: ['abc', 'def', 'ghi']}).data)
			.toEqual({message: 'Success'});

		expect(spy).toHaveBeenCalledWith('update', {message: 'Success'});
	});

	it('`get` with extra providers', async () => {
		@provider
		class TestExtraProvider extends Provider {
			baseGetURL = 'http://localhost:3000/json/1';
		}

		@provider
		class TestProviderWithExtra extends Provider {
			alias = 'foo';

			baseGetURL = 'http://localhost:3000/json/1';

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

		expect(await dp.get().data).toEqual({
			bla: Object({id: 1, value: 'things'}),
			bar: Object({id: 1, value: 'things'}),
			foo: Object({id: 1, value: 'things'})
		});
	});
});

function createServer() {
	const serverApp = express();
	serverApp.use(express.json());

	serverApp.get('/json/1', (req, res) => {
		res.status(200).json({id: 1, value: 'things'});
	});

	serverApp.put('/json/2', (req, res) => {
		if (req.get('Accept') === 'application/json') {
			res.status(200).end('{"message": "Success"}');

		} else {
			res.sendStatus(422);
		}
	});

	serverApp.post('/json', (req, res) => {
		const
			{body} = req;

		if (body.id === 12345 && body.value === 'abc-def-ghi') {
			res.status(201).json({message: 'Success'});

		} else {
			res.sendStatus(422);
		}
	});

	return serverApp.listen(3000);
}
