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
import { Cache, RestrictedCache } from 'core/cache';
import { defaultRequestOpts } from 'core/request/const';

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

export type SuccessStatus =
	sugarjs.Range |
	StatusCodes |
	StatusCodes[];

export interface Encoder<I = any, O = any> {
	(data: I): {contentType: string; data: O};
}

export interface Decoder<I = any, O = any> {
	(this: Response, data: I): O;
}

export interface RequestResponseObject<T = any> {
	data: T | null;
	ctx: Readonly<RequestContext<T>>;
	response: Response;
	dropCache(): Promise<void>;
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
	readonly successStatus?: SuccessStatus;
	readonly contentType?: string;
	readonly responseType?: ResponseTypes;
	readonly decoder?: Decoder | Decoder[];
	readonly headers?: Dictionary<string | string[]>;
	readonly body?: RequestBody;
	readonly withCredentials?: boolean;
	readonly user?: string;
	readonly password?: string;
}

export type RequestQuery = Dictionary | any[] | string;
export interface Middleware<T = any, CTX = void> {
	(this: CTX, url: string, opts: CreateRequestOptions<T>, globalOpts: GlobalOptions): any
}

export type Middlewares<T = any, CTX = void> = Dictionary<Middleware<T, CTX>> | Iterable<Middleware<T, CTX>>;
export interface CreateRequestOptions<T = any> {
	readonly method?: RequestMethods;
	readonly cacheStrategy?: CacheStrategy;

	contentType?: string;
	responseType?: ResponseTypes;
	successStatus?: SuccessStatus;
	externalRequest?: boolean;

	body?: RequestBody;
	query?: RequestQuery;
	headers?: Dictionary<any | any[]>;
	withCredentials?: boolean;
	user?: string;
	password?: string;

	timeout?: number;
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
	encoder?: Encoder | Encoder[];
	decoder?: Decoder<T> | Decoder[];
}

export interface Rewriter {
	query?: Dictionary;
	subPath?: string;
	newPath?: string;
}

export interface RequestContext<T = any> {
	readonly canCache: boolean;
	readonly cache?: Cache<T> | RestrictedCache<T> | null;
	readonly pendingCache?: Cache<Then<T>>;
	readonly params: typeof defaultRequestOpts & CreateRequestOptions<T>;
	encoders: Encoder[];
	decoders: Decoder[];
	query: RequestQuery;
	isOnline: boolean;
	qs: string;
	cacheKey?: string;
	prefetch?: Then<any>;
	resolveAPI(base?: string | undefined): string;
	resolveURL(api?: string | undefined): string;
	saveCache(url: string): (data: RequestResponseObject<T>) => RequestResponseObject<T>;
	wrapRequest(url: string, promise: Then<T>): Then<T>;
	rewriter?(this: CreateRequestOptions<T>, ...args: any[]): Rewriter;
}

export interface ResponseHeaders {
	readonly [name: string]: string;
}

export interface ResponseOptions {
	type?: ResponseTypes;
	successStatus?: SuccessStatus;
	status?: StatusCodes;
	headers?: string | Dictionary<string>;
	decoder?: Decoder | Decoder[];
}

export interface GlobalOptions {
	api?: string;
	token?: string;
}
