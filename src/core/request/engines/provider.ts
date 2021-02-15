import type {

	MiddlewareParams,
	Middlewares,

	OkStatuses,

	RequestBody,
	RequestEngine,
	RequestMethod,
	RequestOptions,
	RequestQuery,
	RequestResponse

} from 'core/request/interface';
import Response, { ResponseTypeValue } from 'core/request/response';
import type iProvider from 'core/data/interface';
import type { ModelMethod, ProviderConstructor, ExtraProviderConstructor } from 'core/data/interface/types';
import { providers, queryMethods } from 'core/data/const';
import Then from 'core/then';
import { generate, serialize } from 'core/uuid';
import Provider from 'core/data';

interface AvailableOptions {
	readonly method: RequestMethod;
	readonly body?: RequestBody;
	readonly query: RequestQuery;
	readonly headers: Dictionary<CanArray<unknown>>;
	readonly okStatuses?: OkStatuses;
	readonly timeout?: number;
	readonly externalRequest?: boolean;
	readonly important?: boolean;
	readonly meta: Dictionary;
	readonly url: string;

	parent?: Then;
	middlewares?: Middlewares;
}

type MethodsMapping = {
	[key in ModelMethod]: ModelMethod
};

/**
 * Returns provider class or object.
 *
 * @param providerOrNamespace - provider class or object, or provider namespace in the global store
 */
function getProvider(providerOrNamespace: ExtraProviderConstructor): iProvider {
	if (Object.isString(providerOrNamespace)) {
		if (!(providerOrNamespace in providers)) {
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
	// 'api', // у источника свой
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
	'meta'
	// 'engine',
	// 'url' // путь для реквеста берем из мета-данных
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
const middleware = ({opts, ctx}: MiddlewareParams): void => {
	if (opts.meta.isProvider === true || opts.meta.providerMethod === undefined) {
		ctx.canUsePendingCache = false;

	} else {
		opts.meta.isProvider = true;
	}
};

/**
 * Returns request promise created by provider method
 *
 * @param provider
 * @param providerMethod
 * @param params
 */
function getRequestByProviderMethod(
	provider: iProvider,
	providerMethod: string,
	params: AvailableOptions
): Then<RequestResponse> {
	let method;

	if (providerMethod === 'post') {
		method = 'POST';
	} else {
		const methodPropertyName = `${providerMethod}Method`;

		method = provider[methodPropertyName];
	}

	const body = method in queryMethods ? params.query : params.body;

	return provider[providerMethod](body, params);
}

/**
 * Returns request promise created by path (default request)
 *
 * @param provider
 * @param params
 */
function getRequestByPath(provider: iProvider, params: AvailableOptions): Then<RequestResponse> {
	// @ts-ignore - Property 'request' does not exist on type 'Provider'.
	return provider.request(params.meta.path, params);
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

		const parent = new Then<Response<unknown>>(async (resolve, reject, onAbort): Then<Response<unknown>> => {
			await new Promise((r) => {
				globalThis['setImmediate'](r);
			});

			p.parent = <Then<unknown>>parent;

			if (!('middlewares' in p)) {
				p.middlewares = [middleware];

			} else if (Object.isArray(p.middlewares)) {
				p.middlewares.push(middleware);

			} else if (Object.isPlainObject(p.middlewares)) {
				p.middlewares[serialize(generate())] = middleware;
			}

			let providerMethod = <string | undefined>p.meta.providerMethod;
			let req: Then<RequestResponse>;

			if (providerMethod !== undefined) {
				if (methodsMapping && providerMethod in methodsMapping) {
					providerMethod = methodsMapping[providerMethod];
				}

				req = getRequestByProviderMethod(provider, providerMethod!, p);
			} else {
				req = getRequestByPath(provider, p);
			}

			onAbort(() => {
				req.abort();
			});

			const {data, response: res} = (await req);

			let responseBody = data;

			if (Object.isArray(data)) {
				responseBody = [...data];
			} else if (Object.isPlainObject(data)) {
				responseBody = {...data};
			}

			return resolve(new Response(<ResponseTypeValue>responseBody, {
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
