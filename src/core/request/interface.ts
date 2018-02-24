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

export type BodyType =
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

export interface RequestOptions {
	url: string;
	method?: RequestMethods;
	timeout?: number;
	successStatus?: SuccessStatus;
	contentType?: string;
	responseType?: ResponseTypes;
	headers?: Dictionary<any | any[]>;
	body?: BodyType;
	query?: Dictionary | any[] | string;
	withCredentials?: boolean;
	user?: string;
	password?: string;
}

export interface CreateRequestOptions<T = any> extends RequestOptions {
	api?: {
		protocol?: string | null;
		domain3?: string | null;
		domain2?: string | null;
		zone?: string | null;
		namespace?: string | null;
	};

	cacheStrategy?: CacheStrategy;
	cacheTime?: number;
	externalRequest?: boolean;
	offline?: boolean;
	encoder?: Encoder | Encoder[];
	decoder?: Decoder<T> | Decoder[];
}

export interface Rewriter {
	query?: Dictionary;
	subPath?: string;
}

export interface RequestContext<T> {
	isOnline: boolean;
	canCache: boolean;
	params: typeof defaultRequestOpts & CreateRequestOptions<T>;
	rewriter?: Rewriter;
	query: CreateRequestOptions['query'];
	qs: string;
	prefetch?: Then<any>;
	pendingCache?: Cache<Then<T>>;
	cache?: Cache<T> | RestrictedCache<T> | null;
	encoders: Encoder[];
	decoders: Decoder[];
	resolveAPI(base?: string): string;
	resolveURL(api?: string): string;
	saveCache(url: string): (data: T) => T;
	wrapRequest(url: string, promise: Then<T>): Then<T>;
}

export interface ResponseHeaders {
	readonly [name: string]: string;
}

export interface ResponseOptions {
	type?: ResponseTypes;
	successStatus?: SuccessStatus;
	status?: StatusCodes;
	headers?: string | Dictionary<string>;
	decoder?: Decoder;
}

export interface GlobalOptions {
	api?: string;
	token?: string;
}
