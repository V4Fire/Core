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

import type { RawHeaders } from 'core/request/headers';

export type ResponseType =
	DataType |
	'object';

export type ResponseTypeValue =
	string |
	object |
	ArrayBuffer |
	Buffer |
	Document |
	FormData |
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

export interface ResponseOptions {
	url?: string;
	redirected?: boolean;

	parent?: AbortablePromise;
	important?: boolean;

	status?: StatusCodes;
	statusText?: string;
	okStatuses?: OkStatuses;

	responseType?: ResponseType;
	headers?: RawHeaders;

	decoder?: WrappedDecoder | WrappedDecoders;
	jsonReviver?: JSONCb | false;
}

export type NormalizedResponseOptions = typeof defaultResponseOpts & ResponseOptions;
