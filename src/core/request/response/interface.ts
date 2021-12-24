/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type AbortablePromise from 'core/promise/abortable';

import type { StatusCodes } from 'core/status-codes';
import type { DataType } from 'core/mime-type';

import type { OkStatuses, WrappedDecoders, WrappedDecoder } from 'core/request/interface';
import type { defaultResponseOpts } from 'core/request/response/const';

import type Headers from 'core/request/headers';
import type { HeaderName, HeaderValue } from 'core/request/headers/interface';

import type StreamController from 'core/request/simple-stream-controller';

export type ResponseType =
	DataType |
	'object';

export type ResponseTypeValue =
	string |
	object |
	ArrayBuffer |
	Buffer |
	Document |
	null |
	undefined;

export type ResponseTypeValueP =
	CanPromise<ResponseTypeValue> |
	(() => CanPromise<ResponseTypeValue>);

export type JSONLikeValue =
	string |
	number |
	boolean |
	null |
	unknown[] |
	Dictionary;

export type HeadersLikeDictionary = Omit<{
	readonly [name: HeaderName]: CanUndef<HeaderValue>;
}, keyof Headers>;

export type ResponseHeaders = Headers & HeadersLikeDictionary;

export interface ListenerFn {
	(...values: any[]): void;
}

export interface ResponseEventEmitter {
	emit(event: string, ...values: any[]): boolean;
	on(event: string, listener: ListenerFn): this;
	once(event: string, listener: ListenerFn): this;
	off(event: string, listener: ListenerFn): this;
}

export interface ResponseOptions {
	parent?: AbortablePromise;
	important?: boolean;
	redirected?: boolean;
	url?: string;
	responseType?: ResponseType;
	okStatuses?: OkStatuses;
	status?: StatusCodes;
	statusText?: string;
	headers?: string | Dictionary<string>;
	decoder?: WrappedDecoder | WrappedDecoders;
	jsonReviver?: JSONCb | false;
	streamController?: StreamController;
	eventEmitter?: ResponseEventEmitter;
}

export type NormalizedResponseOptions = typeof defaultResponseOpts & ResponseOptions;
