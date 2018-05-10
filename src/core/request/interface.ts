/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import StatusCodes from 'core/statusCodes';
import Response from 'core/request/response';
import RequestContext from 'core/request/context';

export type RequestMethods =
	'GET' |
	'POST' |
	'PUT' |
	'DELETE' |
	'PATCH' |
	'HEAD' |
	'CONNECT' |
	'OPTIONS' |
	'TRACE';

export type CacheStrategy =
	'queue' |
	'forever' |
	'never';

export type ResponseTypes =
	'text' |
	'json' |
	'document' |
	'arrayBuffer' |
	'blob' |
	'object';

export type ResponseType =
	string |
	ArrayBuffer |
	Document |
	null |
	undefined;

export type RequestBody =
	string | number | boolean |
	Dictionary |
	FormData |
	ArrayBuffer;

export type OkStatuses =
	sugarjs.Range |
	StatusCodes |
	StatusCodes[];

export interface Encoder<I = any, O = any> {
	(data: I, opts: CreateRequestOptions): O;
}

export type Encoders<T = any> =
	Dictionary<Encoder<T>> |
	Iterable<Encoder<T>>;

export interface Decoder<I = any, O = any> {
	(data: I, opts: CreateRequestOptions): O;
}

export type Decoders<T = any> =
	Dictionary<Decoder<T>> |
	Iterable<Decoder<T>>;

export interface RequestResponseObject<T = any> {
	data: T | null;
	response: Response;
	ctx: Readonly<RequestContext<T>>;
	dropCache(): void;
}

export type RequestResponse<T = any> = Then<RequestResponseObject<T>>;
export interface RequestFunctionResponse<T = any, A1 = any, A2 = any, A3 = any> {
	(arg1?: A1, arg2?: A2, arg3?: A3): RequestResponse<T>;
	(...args: any[]): RequestResponse<T>;
}

export interface RequestOptions {
	readonly url: string;
	readonly method?: RequestMethods;
	readonly timeout?: number;
	readonly okStatuses?: OkStatuses;
	readonly contentType?: string;
	readonly responseType?: ResponseTypes;
	readonly decoder?: Decoder | Decoder[];
	readonly headers?: Dictionary<string | string[]>;
	readonly body?: RequestBody;
	readonly credentials?: boolean;
}

export type RequestQuery =
	Dictionary |
	any[] |
	string;

export interface MiddlewareParams<T = any> {
	ctx: RequestContext<T>;
	opts: CreateRequestOptions<T>;
	globalOpts: GlobalOptions;
}

export interface Middleware<T = any> {
	(params: MiddlewareParams): CanPromise<void | Function>;
}

export type Middlewares<T = any> =
	Dictionary<Middleware<T>> |
	Iterable<Middleware<T>>;

export interface CreateRequestOptions<T = any> {
	readonly method?: RequestMethods;
	readonly cacheStrategy?: CacheStrategy;

	contentType?: string;
	responseType?: ResponseTypes;
	okStatuses?: OkStatuses;
	externalRequest?: boolean;

	body?: RequestBody;
	query?: RequestQuery;
	headers?: Dictionary<any | any[]>;
	credentials?: boolean;

	timeout?: number;
	cacheId?: string | symbol;
	cacheTTL?: number;
	offlineCache?: boolean;

	api?: {
		protocol?: string | null;
		domain3?: string | null;
		domain2?: string | null;
		zone?: string | null;
		namespace?: string | null;
	};

	middlewares?: Middlewares<T>;
	encoder?: Encoder | Encoders;
	decoder?: Decoder | Decoders;
}

export type ResolverResult =
	string |
	string[] |
	undefined;

export interface ResponseHeaders {
	readonly [name: string]: string;
}

export interface ResponseOptions {
	responseType?: ResponseTypes;
	okStatuses?: OkStatuses;
	status?: StatusCodes;
	headers?: string | Dictionary<string>;
	decoder?: Decoder | Decoders;
}

export interface GlobalOptions {
	api?: string | null | undefined;
	meta: Dictionary;
}
