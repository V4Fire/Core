import {
	RequestEngine,
	RequestOptions,
} from 'core/request/interface';
import Response from 'core/request/response';
import iProvider, { ExtraProviderConstructor } from 'core/data/interface';
import { providers } from 'core/data/const';
import Then from 'core/then';

type DataProvider = string | iProvider | ExtraProviderConstructor;

/**
 * Returns provider class or object.
 *
 * @param providerOrNamespace - provider class or object, or provider namespace in the global store
 */
function getProvider(providerOrNamespace): iProvider {
	if (Object.isString(providerOrNamespace)) {
		if (providerOrNamespace in providers) {
			return providers[providerOrNamespace];
		}

		throw new ReferenceError(`A provider "${providerOrNamespace}" is not registered`);
	}

	return providerOrNamespace;
}

/**
 * Returns a path argument for the request.
 *
 * todo: сначала собираем, а потом разбираем - двойная работа.
 *
 * @param params
 */
function getPath(params: RequestOptions) {
	const baseUrl = params.api.url();

	return params.url.replace(baseUrl, '').split('?')[0];
}

const availableParams = [
	'method',
	'contentType',
	// 'responseType', // источник данных интерпретирует результат
	'body',
	'query',
	'headers',
	// 'credentials', // задает источник
	'api', // необходимо для получения базового пути, чтобы сделать запрос
	'okStatuses', // задает источник ?
	'timeout',
	// 'cacheStrategy', // у источника
	// 'cacheId', // у источника свой
	// 'cacheMethods', // у источника
	// 'cacheTTL', // непонятно, что с этим
	// 'offlineCache', // у источника
	// 'offlineCacheTTL', // непонятно, что с этим
	// 'encoder', // у источника свои
	// 'decoder', // у источника свои
	// 'jsonReviver', // у источника свои
	'externalRequest', // не до конца понимаю влияние
	'important',
	'meta',
	// 'engine',
	'url', // без этого непонятно на какой адрес идти
	// 'decoders', // у источника свои
	// 'parent',
	'isProvider',
];

/**
 * Creates request by using data provider as source
 *
 * @param providerOrNamespace - provider class or object, or provider namespace in the global store
 */
export default function makeEngine(providerOrNamespace: DataProvider): RequestEngine {
	return (params: RequestOptions): Then<Response> => {
		const p = Object.select(params, availableParams);

		const parent = new Then<Response>(async (resolve, reject, onAbort): Then<Response<unknown>> => {
			await new Promise((r) => {
				globalThis['setImmediate'](r);
			});

			if (!('middlewares' in p)) {
				p.middlewares = [];
			}

			p.middlewares.push(({ opts, ctx }) => {
				if (opts.isProvider) {
					ctx.canUsePendingCache = false;
				} else {
					opts.isProvider = true;
				}
			});

			p.parent = parent;
			const path = getPath(p);
			const req = getProvider(providerOrNamespace).request(path, p);

			onAbort(() => {
				req.abort();
			});

			const res = (await req).response;

			resolve(new Response(res.body, {
				parent: params.parent,
				important: res.important,
				responseType: res.responseType,
				okStatuses: res.okStatuses,
				status: res.status,
				headers: res.headers,
				jsonReviver: res.jsonReviver,
				decoder: params.decoders
			}));
		}, params.parent);

		return parent;
	};
}
