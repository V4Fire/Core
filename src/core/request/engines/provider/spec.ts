/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import express from 'express';

import { set, get } from 'core/env';

import request, { globalOpts, MiddlewareParams } from 'core/request';
import Provider, { provider } from 'core/data';
import createProviderEngine from 'core/request/engines/provider';

@provider
class ProviderEngineTestBaseProvider extends Provider {
	static override request: typeof Provider.request = Provider.request({
		api: {
			url: 'http://localhost:3000'
		}
	});
}

@provider
class ProviderEngineTestDataProvider extends Provider {
	static override request: typeof Provider.request = Provider.request({
		engine: createProviderEngine(ProviderEngineTestBaseProvider)
	});

	override baseURL: string = '/data';
}

@provider
class ProviderEngineTestJSONProvider extends Provider {
	static override request: typeof Provider.request = Provider.request({
		engine: createProviderEngine(ProviderEngineTestDataProvider, {
			peek: 'get'
		})
	});

	override baseURL: string = 'json';
}

@provider
class ProviderEngineTestDecodersProvider extends Provider {
	static override request: typeof Provider.request = Provider.request({
		engine: createProviderEngine(ProviderEngineTestJSONProvider)
	});

	static override encoders: typeof Provider.encoders = {
		post(data: Dictionary) {
			data.id = 12345;
			return data;
		}
	};

	static override decoders: typeof Provider.decoders = {
		post(data: Dictionary) {
			data.message = 'ok';
			return data;
		}
	};
}

@provider
class ProviderEngineTestMiddlewareProvider extends Provider {
	static override request: typeof Provider.request = Provider.request({
		engine: createProviderEngine(ProviderEngineTestDecodersProvider)
	});

	static override decoders: typeof Provider.decoders= {
		post(data: Dictionary) {
			data.error = false;
			return data;
		}
	};

	static override middlewares: typeof Provider.middlewares = {
		fakeResponse({ctx}: MiddlewareParams) {
			if (Object.isDictionary(ctx.params.body)) {
				ctx.params.body.value = (<string[]>ctx.params.body.value).join('-');
			}
		}
	};
}

@provider
class ProviderEngineTestBasePathProvider extends ProviderEngineTestDataProvider {
	override baseURL: string = '/data/:id';
}

@provider
class ProviderEngineTestPathProvider extends Provider {
	static override request: typeof Provider.request = Provider.request({
		engine: createProviderEngine(ProviderEngineTestBasePathProvider)
	});

	override baseURL: string = '/:id';
}

describe('core/request/engine/provider', () => {
	const
		baseProvider = new ProviderEngineTestBaseProvider(),
		dataProvider = new ProviderEngineTestDataProvider(),
		jsonProvider = new ProviderEngineTestJSONProvider(),
		encodersProvider = new ProviderEngineTestDecodersProvider(),
		middlewareProvider = new ProviderEngineTestMiddlewareProvider(),
		pathProvider = new ProviderEngineTestPathProvider();

	let
		api,
		logOptions,
		server;

	beforeAll(async () => {
		api = globalOpts.api;
		globalOpts.api = 'http://localhost:3000';

		logOptions = await get('log');
		set('log', {patterns: []});

		server = createServer();
	});

	afterAll((done) => {
		globalOpts.api = api;
		set('log', logOptions);

		server.close(done);
	});

	it('base URL-s concatenation', async () => {
		try {
			const req = await baseProvider.get();

			expect(req).toBe(undefined);

		} catch(err) {
			expect(err.details.response.status).toBe(404);
		}

		const req = await dataProvider.get();

		expect(req.response.status).toBe(200);
	});

	it('response type is correct for XML', async () => {
		expect((await dataProvider.get<XMLDocument>().data)?.querySelector('foo')?.textContent)
			.toBe('Hello world');
	});

	it('methods mapping', async () => {
		expect(await jsonProvider.peek().data)
			.toEqual({id: 1, value: 'things'});
	});

	it('encoders/decoders', async () => {
		const req = await encodersProvider.post({
			value: 'abc-def-ghi'
		});

		expect(await req.data)
			.toEqual({message: 'ok'});

		expect(req.response.status)
			.toBe(201);

		expect(req.response.ok)
			.toBe(true);
	});

	it('middlewares', async () => {
		const req = await middlewareProvider.post({
			value: ['abc', 'def', 'ghi']
		});

		expect(await req.data)
			.toEqual({message: 'ok', error: false});

		expect(req.response.status)
			.toBe(201);
	});

	it('simple request methods mapping', async () => {
		const req = request({
			engine: createProviderEngine(ProviderEngineTestDataProvider, {
				POST: 'get'
			})
		});

		expect(await req('/json', {method: 'POST'}).data)
			.toEqual({id: 1, value: 'things'});
	});

	it('correct path resolving for URL with parameters', async () => {
		expect((await pathProvider.get({id: 2})).response.status)
			.toEqual(201);
	});
});

function createServer() {
	const
		serverApp = express();

	serverApp.use(express.json());

	serverApp.get('/data', (req, res) => {
		res.type('text/xml');
		res.status(200).send('<foo>Hello world</foo>');
	});

	serverApp.get('/data/1', (req, res) => {
		res.sendStatus(200);
	});

	serverApp.get('/data/2/2', (req, res) => {
		res.sendStatus(201);
	});

	serverApp.get('/data/json', (req, res) => {
		res.status(200).json({id: 1, value: 'things'});
	});

	serverApp.post('/data/json', (req, res) => {
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
