import {
	MiddlewareParams, Middlewares,
	OkStatuses,
	RequestAPI,
	RequestBody, RequestEngine, RequestMethod,
	RequestOptions, RequestQuery,
} from 'core/request/interface';
import Response from 'core/request/response';
import iProvider, { ModelMethod, ProviderConstructor, ExtraProviderConstructor } from 'core/data/interface';
import {providers, queryMethods} from 'core/data/const';
import Then from 'core/then';
import {generate, serialize} from "core/uuid";
import Provider from "core/data";

interface AvailableOptions {
	readonly method: RequestMethod; // всегда есть, падает из дефолтных настроек
	readonly api: RequestAPI; // всегда есть, падает из globalOpts
	readonly body?: RequestBody;
	readonly query: RequestQuery; // всегда есть, падает из дефолтных настроек
	readonly headers: Dictionary<CanArray<unknown>>; // всегда есть, падает из дефолтных настроек
	readonly okStatuses?: OkStatuses;
	readonly timeout?: number;
	readonly externalRequest?: boolean;
	readonly important?: boolean;
	readonly meta: Dictionary; // всегда есть, падает из дефолтных настроек
	readonly url: string; // всегда есть, падает из реквеста

	parent?: Then;
	middlewares?: Middlewares;
}

type MethodsMapping = {
	[key in ModelMethod]: ModelMethod
}

/**
 * Returns provider class or object.
 *
 * @param providerOrNamespace - provider class or object, or provider namespace in the global store
 */
function getProvider(providerOrNamespace: ExtraProviderConstructor): iProvider {
	if (Object.isString(providerOrNamespace)) {
		if (! (providerOrNamespace in providers)) {
			throw new ReferenceError(`A provider "${providerOrNamespace}" is not registered`);
		}

		providerOrNamespace = <ProviderConstructor>providers[providerOrNamespace];
	}

	if (providerOrNamespace instanceof Provider) {
		return providerOrNamespace;
	}

	return new (<ProviderConstructor>providerOrNamespace)();
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
];

/**
 * Prepare initial params for engine.
 *
 * @param params
 */
function prepareParams(params: RequestOptions): AvailableOptions {
	return <AvailableOptions>Object.select(params, availableParams);
}

/**
 * Hack for pending cache.
 *
 * @param opts
 * @param ctx
 */
const middleware = ({ opts, ctx }: MiddlewareParams): void => {
	if (opts.meta.isProvider) {
		ctx.canUsePendingCache = false;

	} else {
		opts.meta.isProvider = true;
	}
}

/**
 * Creates engine for request by using data provider as source
 *
 * @param providerOrNamespace - provider class or object, or provider namespace in the global store
 * @param methodsMapping -
 */
export default function makeProviderEngine(
	providerOrNamespace: ExtraProviderConstructor,
	methodsMapping?: MethodsMapping
): RequestEngine {
	return (params: RequestOptions): Then<Response> => {
		const p: AvailableOptions = prepareParams(params);
		const provider = getProvider(providerOrNamespace);

		let providerMethod = <string>p.meta!.providerMethod;

		if (methodsMapping && providerMethod in methodsMapping) {
			providerMethod = methodsMapping[providerMethod];
		}

		const parent = new Then<Response<unknown>>(async (resolve, reject, onAbort): Then<Response<unknown>> => {
			await new Promise((r) => {
				globalThis['setImmediate'](r);
			});

			if (!('middlewares' in p)) {
				p.middlewares = [middleware];

			} else if (Object.isArray(p.middlewares)) {
				p.middlewares.push(middleware);

			} else if (Object.isPlainObject(p.middlewares)) {
				p.middlewares[serialize(generate())] = middleware;
			}

			let method;

			if (providerMethod === 'post') {
				method = 'POST';
			} else {
				const methodPropertyName = `${providerMethod}Method`;

				method = provider[methodPropertyName];
			}

			let body: RequestQuery | RequestBody | undefined = p.body;

			if (queryMethods[method]) {
				body = p.query;
			}

			p.parent = <Then<unknown>>parent;
			const req = provider[providerMethod](body, p);

			onAbort(() => {
				req.abort();
			});

			const { data, response: res } = (await req);

			let responseBody = data;

			if (Object.isArray(data)) {
				responseBody = [...data];
			} else if (Object.isPlainObject(data)) {
				responseBody = {...data};
			}

			return resolve(new Response(responseBody, {
				parent: params.parent,
				important: res.important,
				responseType: 'object',
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
