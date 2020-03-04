/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import {

	Encoders,
	Decoders,

	CreateRequestOptions,
	RequestMethod,
	RequestQuery,
	RequestBody,

	MiddlewareParams,
	GlobalOptions

} from 'core/request/interface';

import {

	ResponseType,
	ResponseTypeValue

} from 'core/request/response/interface';

import Provider from 'core/data/interface';

export type MockResponseType =
	ResponseType |
	object;

export interface MockCustomResponse {
	status?: number;
	responseType?: ResponseTypeValue;
	decoders?: Decoders;
}

export interface MockResponseFunction {
	(params: MiddlewareParams, response: MockCustomResponse): CanPromise<MockResponseType>;
}

export type MockResponse =
	CanPromise<MockResponseType> |
	MockResponseFunction;

export interface Mock {
	status?: number;
	query?: RequestQuery;
	body?: RequestBody;
	headers?: Dictionary<CanArray<unknown>>;
	decoders?: boolean;
	response: MockResponse;
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
	'upd' |
	'del';

export interface DataEvent {
	event: string;
	data: EventData;
}

export interface EventDataObject<T = unknown> extends Dictionary {
	data: Dictionary<T>;
}

export type EventData<T = unknown> =
	(() => Dictionary<T>) |
	EventDataObject<T>;

export interface ProviderOptions {
	/**
	 * @see [[CreateRequestOptions.externalRequest]]
	 * @default `false`
	 */
	externalRequest?: boolean;

	/**
	 * If true, then the provider is connected to a socket server
	 * @default `false`
	 */
	socket?: boolean;

	/**
	 * If true, then all emitting events, which is emitted by the provider,
	 * that have a similar hash wil be collapsed to one
	 *
	 * @default `false`
	 */
	collapseEvents?: boolean;
}

export interface ExtraProviderParams<T = unknown> {
	opts: CreateRequestOptions<T>;
	globalOpts: GlobalOptions;
}

export type ExtraProviderConstructor =
	string |
	Provider |
	{new(opts?: ProviderOptions): Provider};

export interface ExtraProvider {
	provider?: ExtraProviderConstructor;
	providerOptions?: ProviderOptions;
	query?: RequestQuery;
	request?: CreateRequestOptions;
	alias?: string;
}

export type ExtraProviders = Dictionary<Nullable<ExtraProvider>>;
export type FunctionalExtraProviders = ExtraProviders | ((params: ExtraProviderParams) => CanUndef<ExtraProviders>);

export type EncodersMap = Record<ModelMethod | 'def', Encoders> | {};
export type DecodersMap = Record<ModelMethod | 'def', Decoders> | {};
