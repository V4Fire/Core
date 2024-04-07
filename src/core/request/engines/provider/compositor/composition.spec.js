// import type { JSHandle } from '@playwright/test';
// import test from 'tests/config/unit/test';
// import { BOM, RequestInterceptor } from 'tests/helpers';

// import Utils from 'tests/helpers/utils';
// import type * as Composition from 'models/modules/composition';

// test.describe('models/modules/composition', () => {

// 	let
// 		api: JSHandle<typeof Composition>,
// 		provider: JSHandle<Composition.CompositionProviderTest>,
// 		bannersInterceptor: RequestInterceptor,
// 		contentInterceptor: RequestInterceptor;

// 	test.describe('providerCompositionEngine', () => {
// 		test.beforeEach(async ({page, demoPage}) => {
// 			await demoPage.goto();

// 			api = await Utils.import<typeof Composition>(page, 'models/modules/composition');
// 			provider = await api.evaluateHandle((ctx) => new ctx.CompositionProviderTest());

// 			bannersInterceptor = await new RequestInterceptor(page, /v1.1\/get/).start();
// 			contentInterceptor = await new RequestInterceptor(page, /v1.1\/cards/).start();
// 		});

// 		test('Возвращает правильные ответ и подставляет правильные query параметры', async () => {
// 			const
// 				bannersResponse = {banners: []},
// 				contentResponse = {content: {}};

// 			bannersInterceptor.response(200, bannersResponse);
// 			contentInterceptor.response(200, contentResponse);

// 			const
// 				bannersQuery = {screen: 'suggest'},
// 				contentQuery = {page: 1};

// 			const result = await provider.evaluate(async (ctx, [bannersQuery, contentQuery]) => {
// 				const data = await ctx.get({
// 					bannersQuery,
// 					contentQuery
// 				}).data;

// 				return data;

// 			}, [bannersQuery, contentQuery]);

// 			test.expect(bannersInterceptor.request(0)?.query()).toEqual(bannersQuery);
// 			test.expect(contentInterceptor.request(0)?.query()).toEqual(contentQuery);
// 			test.expect(result).toEqual({
// 				// Декодер вернул массив
// 				banners: [],
// 				content: contentResponse
// 			});
// 		});

// 		test('Заканчивает запрос с ошибкой если произошла ошибка запроса с failCompositionOnError=true', async () => {
// 			const
// 				bannersResponse = {banners: []};

// 			bannersInterceptor.response(200, bannersResponse);
// 			contentInterceptor.response(401, {});

// 			const result = await provider.evaluate(async (ctx) => {
// 				try {
// 					const data = await ctx.get().data;
// 					return data;

// 				} catch (err) {
// 					return {
// 						status: err.details.response.status,
// 						statusText: err.details.response.statusText,
// 						ok: err.details.response.ok
// 					};
// 				}
// 			});

// 			test.expect(result).toEqual({
// 				status: 401,
// 				statusText: 'Unauthorized',
// 				ok: false
// 			});
// 		});

// 		test('Не заканчивает запрос с ошибкой если произошла ошибка запроса с failCompositionOnError=false', async () => {
// 			const
// 				contentResponse = {content: {}};

// 			bannersInterceptor.response(500, {});
// 			contentInterceptor.response(200, contentResponse);

// 			const result = await provider.evaluate(async (ctx) => {
// 				const data = await ctx.get().data;
// 				return data;
// 			});

// 			test.expect(result).toEqual({
// 				content: contentResponse
// 			});
// 		});

// 		test('Не начинает запрос если requestFilter вернул false', async ({page}) => {
// 			const
// 				bannersResponse = {banners: []},
// 				contentResponse = {content: {}};

// 			bannersInterceptor.response(200, bannersResponse);
// 			contentInterceptor.response(200, contentResponse);

// 			await page.evaluate(() => globalThis.requestFilter = false);

// 			const result = await provider.evaluate(async (ctx) => {
// 				const data = await ctx.get().data;
// 				return data;
// 			});

// 			test.expect(bannersInterceptor.calls).toHaveLength(1);
// 			test.expect(contentInterceptor.calls).toHaveLength(0);
// 			test.expect(result).toEqual({
// 				// Декодер вернул массив
// 				banners: []
// 			});
// 		});

// 		test('Не начинает запрос пока requestFilter не разрешился', async ({page}) => {
// 			const
// 				bannersResponse = {banners: []},
// 				contentResponse = {content: {}};

// 			bannersInterceptor.response(200, bannersResponse);
// 			contentInterceptor.response(200, contentResponse);

// 			await page.evaluate(() => {
// 				globalThis.requestFilter = new Promise((res) => {
// 					globalThis.requestFilterResolver = res;
// 				});
// 			});

// 			const request = provider.evaluate(async (ctx) => {
// 				const data = await ctx.get().data;
// 				return data;
// 			});

// 			await Utils.wait(() => bannersInterceptor.calls.length > 0);
// 			await BOM.waitForIdleCallback(page);

// 			test.expect(bannersInterceptor.calls).toHaveLength(1);
// 			test.expect(contentInterceptor.calls).toHaveLength(0);

// 			await page.evaluate(() => globalThis.requestFilterResolver());

// 			const result = await request;

// 			test.expect(bannersInterceptor.calls).toHaveLength(1);
// 			test.expect(contentInterceptor.calls).toHaveLength(1);
// 			test.expect(result).toEqual({
// 				// Декодер вернул массив
// 				banners: [],
// 				content: contentResponse
// 			});
// 		});

// 		test('Не начинает запрос если requestFilter вернул промис который разрешился в false', async ({page}) => {
// 			const
// 				bannersResponse = {banners: []},
// 				contentResponse = {content: {}};

// 			bannersInterceptor.response(200, bannersResponse);
// 			contentInterceptor.response(200, contentResponse);

// 			await page.evaluate(() => {
// 				globalThis.requestFilter = new Promise((res) => res(false));
// 			});

// 			const result = await provider.evaluate(async (ctx) => {
// 				const data = await ctx.get().data;
// 				return data;
// 			});

// 			test.expect(bannersInterceptor.calls).toHaveLength(1);
// 			test.expect(contentInterceptor.calls).toHaveLength(0);
// 			test.expect(result).toEqual({
// 				// Декодер вернул массив
// 				banners: []
// 			});
// 		});

// 		test('Одновременные запросы приводят лишь к одному запросу', async ({page}) => {
// 			const
// 				bannersResponse = {banners: []},
// 				contentResponse = {content: {}};

// 			bannersInterceptor.response(200, bannersResponse).responder();
// 			contentInterceptor.response(200, contentResponse).responder();

// 			const request1 = provider.evaluate(async (ctx) => {
// 				const data = await ctx.get().data;
// 				return data;
// 			});

// 			await BOM.waitForIdleCallback(page);

// 			const request2 = provider.evaluate(async (ctx) => {
// 				const data = await ctx.get().data;
// 				return data;
// 			});

// 			await BOM.waitForIdleCallback(page);

// 			await Promise.all([
// 				bannersInterceptor.unresponder(),
// 				contentInterceptor.unresponder()
// 			]);

// 			const [result1, result2] = await Promise.all([
// 				request1,
// 				request2
// 			]);

// 			test.expect(bannersInterceptor.calls).toHaveLength(1);
// 			test.expect(contentInterceptor.calls).toHaveLength(1);

// 			test.expect(result1).toEqual({
// 				// Декодер вернул массив
// 				banners: [],
// 				content: contentResponse
// 			});

// 			test.expect(result2).toEqual({
// 				// Декодер вернул массив
// 				banners: [],
// 				content: contentResponse
// 			});
// 		});

// 		test('Повторные запросы берут данные из кэша', async () => {
// 			const
// 				bannersResponse = {banners: []},
// 				contentResponse = {content: {}};

// 			bannersInterceptor.response(200, bannersResponse);
// 			contentInterceptor.response(200, contentResponse);

// 			const result1 = await provider.evaluate(async (ctx) => {
// 				const data = await ctx.get().data;
// 				return data;
// 			});

// 			const result2 = await provider.evaluate(async (ctx) => {
// 				const data = await ctx.get().data;
// 				return data;
// 			});

// 			test.expect(bannersInterceptor.calls).toHaveLength(1);
// 			test.expect(contentInterceptor.calls).toHaveLength(1);

// 			test.expect(result1).toEqual({
// 				banners: [],
// 				content: contentResponse
// 			});

// 			test.expect(result2).toEqual({
// 				banners: [],
// 				content: contentResponse
// 			});
// 		});

// 		test('Вызывается декодер с корректными данными', async ({page}) => {
// 			const
// 				bannersResponse = {banners: []},
// 				contentResponse = {content: {}};

// 			bannersInterceptor.response(200, bannersResponse);
// 			contentInterceptor.response(200, contentResponse);

// 			await page.evaluate(() => {
// 				globalThis.compositionDecoder = (result) => {
// 					const newResult = {...result};
// 					newResult.all = result;
// 					return newResult;
// 				};
// 			});

// 			const result = await provider.evaluate(async (ctx) => {
// 				const data = await ctx.get().data;
// 				return data;
// 			});

// 			test.expect(result).toEqual({
// 				// Декодер вернул массив
// 				banners: [],
// 				content: contentResponse,
// 				all: {
// 					banners: [],
// 					content: contentResponse
// 				}
// 			});
// 		});
// 	});
// });
