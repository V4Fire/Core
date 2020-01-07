/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';
import Range from 'core/range';
import Response from 'core/request/response';
import RequestContext from 'core/request/context';
import { StatusCodes } from 'core/status-codes';

export type RequestMethod =
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

export type ResponseType =
	'text' |
	'json' |
	'document' |
	'arrayBuffer' |
	'blob' |
	'object';

export type ResponseTypeValue =
	string |
	ArrayBuffer |
	Document |
	null |
	undefined;

export type RequestBody =
	string |
	number |
	boolean |
	Dictionary |
	FormData |
	ArrayBuffer;

export type JSONLikeValue =
	string |
	number |
	boolean |
	null |
	unknown[] |
	Dictionary;

export type OkStatuses =
	Range<number> |
	StatusCodes |
	StatusCodes[];

export interface Encoder<I = unknown, O = unknown> {
	(data: I, params: MiddlewareOptions): O;
}

export type Encoders<T = unknown> =
	Iterable<Encoder<T>>;

export interface Decoder<I = unknown, O = unknown> {
	(data: I, params: MiddlewareOptions, response: Response): O;
}

export type Decoders<T = unknown> =
	Iterable<Decoder<T>>;

export interface RequestResponseObject<T = unknown> {
	data: T | null;
	response: Response;
	ctx: Readonly<RequestContext<T>>;
	dropCache(): void;
}

export type RequestResponse<T = unknown> = Then<RequestResponseObject<T>>;
export interface RequestFunctionResponse<T = unknown, A extends unknown[] = []> {
	(...args: A extends (infer V)[] ? V[] : unknown[]): RequestResponse<T>;
}

export interface RequestOptions {
	readonly url: string;
	readonly method?: RequestMethod;
	readonly timeout?: number;
	readonly okStatuses?: OkStatuses;
	readonly contentType?: string;
	readonly responseType?: ResponseType;
	readonly decoder?: Decoder | Decoder[];
	readonly headers?: Dictionary<CanArray<string>>;
	readonly body?: RequestBody;
	readonly important?: boolean;
	readonly credentials?: boolean;
	readonly parent: Then;
}

export type RequestQuery =
	Dictionary |
	unknown[] |
	string;

export interface MiddlewareOptions<T = unknown> {
	ctx: RequestContext<T>;
	opts: CreateRequestOptions<T>;
	globalOpts: GlobalOptions;
}

export interface Middleware<T = unknown> {
	(params: MiddlewareOptions<T>): CanPromise<void | Function>;
}

export type Middlewares<T = unknown> =
	Dictionary<Middleware<T>> |
	Iterable<Middleware<T>>;

export interface RequestAPI {
	url?: Nullable<string> | (() => Nullable<string>);
	protocol?: Nullable<string> | (() => Nullable<string>);
	domain3?: Nullable<string> | (() => Nullable<string>);
	domain2?: Nullable<string> | (() => Nullable<string>);
	zone?: Nullable<string> | (() => Nullable<string>);
	namespace?: Nullable<string> | (() => Nullable<string>);
}
export interface RequestResolver<T = unknown, ARGS extends unknown[] = unknown[]> {
	(url: string, opts: MiddlewareOptions<T>, ...args: ARGS): ResolverResult;
}

export interface CreateRequestOptions<T = unknown> {
	readonly method?: RequestMethod;

	contentType?: string;
	responseType?: ResponseType;

	body?: RequestBody;
	query?: RequestQuery;
	headers?: Dictionary<CanArray<unknown>>;
	credentials?: boolean;

	api?: RequestAPI;
	okStatuses?: OkStatuses;
	timeout?: number;

	readonly cacheStrategy?: CacheStrategy;
	cacheId?: string | symbol;
	cacheMethods?: RequestMethod[];
	cacheTTL?: number;
	offlineCache?: boolean;
	offlineCacheTTL?: number;

	middlewares?: Middlewares<T>;
	encoder?: Encoder | Encoders;
	decoder?: Decoder | Decoders;

	externalRequest?: boolean;
	important?: boolean;
	meta?: Dictionary;
}

export type ResolverResult =
	string |
	string[] |
	undefined;

export interface ResponseHeaders {
	readonly [name: string]: string;
}

export interface ResponseOptions {
	parent?: Then;
	important?: boolean;
	responseType?: ResponseType;
	okStatuses?: OkStatuses;
	status?: StatusCodes;
	headers?: string | Dictionary<string>;
	decoder?: Decoder | Decoders;
}

export interface GlobalOptions {
	api?: Nullable<string>;
	meta: Dictionary;
}
