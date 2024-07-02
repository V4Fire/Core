/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/// <reference types="node" />
import type AbortablePromise from '../../../core/promise/abortable';
import type { StatusCodes } from '../../../core/status-codes';
import type { DataType } from '../../../core/mime-type';
import type { Statuses, WrappedDecoder, WrappedDecoders, WrappedStreamDecoder, WrappedStreamDecoders } from '../../../core/request/interface';
import type { defaultResponseOpts } from '../../../core/request/response/const';
import type { RawHeaders } from '../../../core/request/headers';
export declare type ResponseModeType = 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';
export declare type ResponseType = DataType | 'object';
export declare type ResponseTypeValue = string | object | ArrayBuffer | Buffer | Document | FormData | null | undefined;
export declare type ResponseTypeValueP = CanPromise<ResponseTypeValue> | (() => CanPromise<ResponseTypeValue>);
export declare type JSONLikeValue = string | number | boolean | null | unknown[] | Dictionary;
export interface ResponseChunk<D> {
    loaded: number;
    total?: number;
    data?: D | null;
}
export interface ResponseOptions {
    url?: string;
    redirected?: boolean;
    type?: ResponseModeType;
    parent?: AbortablePromise;
    important?: boolean;
    status?: StatusCodes;
    statusText?: string;
    okStatuses?: Statuses;
    noContentStatuses?: Statuses;
    responseType?: ResponseType;
    forceResponseType?: boolean;
    headers?: RawHeaders;
    decoder?: WrappedDecoder | WrappedDecoders;
    streamDecoder?: WrappedStreamDecoder | WrappedStreamDecoders;
    jsonReviver?: JSONCb | false;
}
export declare type NormalizedResponseOptions = typeof defaultResponseOpts & ResponseOptions;
