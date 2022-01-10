import type Headers from 'core/request/headers';

export type BasicHeadersInit = Dictionary<string> | Array<[string, string]> | Headers;
export type HeaderName = DictionaryKey;
export type HeaderValue = string;
export type NormalizedHeaderName = HeaderName;
export type NormalizedHeaderValue = HeaderValue;
