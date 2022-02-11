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

export interface ResponseHeaders {
	readonly [name: PropertyKey]: string;
}

export interface ResponseOptions {
	parent?: AbortablePromise;
	important?: boolean;
	responseType?: ResponseType;
	okStatuses?: OkStatuses;
	status?: StatusCodes;
	headers?: string | Dictionary<string>;
	decoder?: WrappedDecoder | WrappedDecoders;
	jsonReviver?: JSONCb | false;
}

export type NormalizedResponseOptions = typeof defaultResponseOpts & ResponseOptions;
