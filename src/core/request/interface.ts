/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import StatusCodes from 'core/statusCodes';

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

export type ResponseTypes =
	'text' |
	'json' |
	'document' |
	'arrayBuffer' |
	'blob';

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

export interface Encoder<I = any, O = any> {
	(data: I): {contentType: string; data: O};
}

export interface RequestOptions {
	url: string;
	method?: RequestMethods;
	timeout?: number;
	contentType?: string;
	responseType?: ResponseTypes;
	headers?: Dictionary<any | any[]>;
	body?: BodyType;
	withCredentials?: boolean;
	user?: string;
	password?: string;
}

export interface CreateRequestOptions<T> extends RequestOptions {
	api?: {
		protocol?: string | null;
		domain3?: string | null;
		domain2?: string | null;
		zone?: string | null;
		namespace?: string | null;
	};

	appRequest?: boolean;
	offline?: boolean;
	decoder?: string;
	encoder?: Encoder;

	method?: string;
	query?: Dictionary;
	emptyValue?: any;
	okStatus?: StatusCodes | StatusCodes[];
	responseType?: 'protobuf';
	converterPath?: string;
	cacheStrategy?: 'default' | 'forever' | 'never';
	cacheTime?: number;
	headers?: Dictionary<any | any[]>;
	suppressLogging?: boolean;
	body?: any | null;

	postProcessor?(data: any): T;
	preProcessor?(data: any): any;
}

export interface Rewriter {
	query?: Dictionary;
	subPath?: string;
}

export interface RequestContext<T> {
	isOnline: boolean;
	canCache: boolean;
	params: typeof defaultRequestOpts & CreateOptions<T>;

	rewriter?: Rewriter;
	okStatus: number[];
	query: Dictionary;
	qs: string;

	prefetch?: Then<any>;
	pendingCache?: Cache<Then<T>>;
	cache?: Cache<T> | RestrictedCache<T> | null;

	decoder?: ProtobufType;
	encoder?: ProtobufType;

	resolveAPI(base?: string): string;
	resolveURL(api?: string): string;

	saveCache(url: string): (data: T) => T;
	wrapRequest(url: string, promise: Then<T>): Then<T>;
	decodeResponse(buffer: ArrayBuffer): Dictionary | CreateOptions<any>['emptyValue'];
}

export interface ResponseHeaders {
	readonly [name: string]: string;
}

export interface Decoder<O = any> {
	(data: ArrayBuffer | null): O;
}

export interface ResponseOptions {
	type?: ResponseTypes;
	status?: StatusCodes;
	headers?: string | Dictionary<string>;
	decoder?: Decoder;
}

export interface GlobalOptions {
	api?: string;
	token?: string;
}

export interface Cache<T = any> {
	exist(key: string): boolean;
	get(key: string): T;
	set(key: string, value: T): T;
	remove(key: string): T | undefined;
}
