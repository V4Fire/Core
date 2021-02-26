/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Then from 'core/then';

import { StatusCodes } from 'core/status-codes';
import { DataType } from 'core/mime-type';

import { OkStatuses, WrappedDecoders, WrappedDecoder } from 'core/request/interface';
import { defaultResponseOpts } from 'core/request/response/const';

export type ResponseType = DataType | 'object';
export type ResponseTypeValue =
	string |
	object |
	ArrayBuffer |
	Buffer |
	Document |
	null |
	undefined;

export type JSONLikeValue =
	string |
	number |
	boolean |
	null |
	unknown[] |
	Dictionary;

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
	decoder?: WrappedDecoder | WrappedDecoders;
	jsonReviver?: JSONCb | false;
}

export type NormalizedResponseOptions = typeof defaultResponseOpts & ResponseOptions;
