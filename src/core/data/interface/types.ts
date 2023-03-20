/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type {

	Encoders,
	Decoders,

	CreateRequestOptions,
	RequestMethod,
	RequestQuery,
	RequestBody,

	MiddlewareParams,
	GlobalOptions

} from 'core/request/interface';

import type { ResponseTypeValue } from 'core/request/response/interface';
import type { Provider } from 'core/data/interface';

export type MockResponseValue =
	ResponseTypeValue |
	object;

export interface MockCustomResponse {
	status?: number;
	responseType?: ResponseTypeValue;
	decoders?: Decoders;
}

export interface MockResponseFunction<D = unknown> {
	(params: MiddlewareParams<D>, response: MockCustomResponse): CanPromise<MockResponseValue>;
}

export type MockResponse<D = unknown> =
	CanPromise<MockResponseValue> |
	MockResponseFunction<D>;

export interface Mock<D = unknown> {
	status?: number;
	query?: RequestQuery;
	body?: RequestBody;
	headers?: Dictionary<CanArray<unknown>>;
	decoders?: boolean;
	response: MockResponse<D>;
}

export type Mocks = CanPromise<
	{[key in RequestMethod]?: Mock[]} |
	{default: {[key in RequestMethod]?: Mock[]}}
>;

export type ModelMethod =
	'peek' |
	'get' |
	'post' |
	'add' |
	'update' |
	'delete';

export interface ProviderOptions {
	/**
	 * If true, then the provider is connected to a socket server
	 * @default `false`
	 */
	socket?: boolean;
}

export interface ExtraProviderParams<D = unknown> {
	opts: CreateRequestOptions<D>;
	globalOpts: GlobalOptions;
}

export interface ProviderConstructor {
	new(opts?: ProviderOptions): Provider;
}

export type ExtraProviderConstructor =
	string |
	Provider |
	ProviderConstructor;

export interface ExtraProvider<D = unknown> {
	provider?: ExtraProviderConstructor;
	providerOptions?: ProviderOptions;
	query?: RequestQuery;
	request?: CreateRequestOptions<D>;
	alias?: string;
}

export type ExtraProviders<D = unknown> = Dictionary<
	Nullable<ExtraProvider<D>>
>;

export type FunctionalExtraProviders<D = unknown> =
	ExtraProviders<D> |
	((params: ExtraProviderParams<D>) => CanUndef<ExtraProviders<D>>);

export type EncodersMap = Record<ModelMethod | 'def', Encoders> | {};
export type DecodersMap = Record<ModelMethod | 'def', Decoders> | {};
