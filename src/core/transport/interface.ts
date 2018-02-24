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
	encoder?: Encoder;
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
