/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { ErrorDetailsExtractor, ErrorCtor } from 'core/error';

import RequestError from 'core/request/error';
import type { RequestErrorDetailsExtractorSettings } from 'core/request/error/interface';

/**
 * Internal filtering settings
 */
interface SettingsPreprocessedFiltering {
	include: Set<string>;
	exclude: Set<string>;
}

/**
 * Extractor that gets details from `RequestError`
 */
export class RequestErrorDetailsExtractor implements ErrorDetailsExtractor<RequestError> {
	/** @inheritDoc */
	target: ErrorCtor<RequestError> = RequestError;

	/**
	 * Settings that define which header makes its way to the result
	 */
	protected headerSettings: SettingsPreprocessedFiltering;

	constructor(settings?: RequestErrorDetailsExtractorSettings) {
		this.headerSettings = {
			include: new Set(settings?.headers.include),
			exclude: new Set(settings?.headers.exclude)
		};
	}

	/** @inheritDoc */
	extract(error: RequestError): unknown {
		return {
			url: error.details.request?.url,
			type: error.type,

			status: error.details.response?.status,
			method: error.details.request?.method,
			query: error.details.request?.query,

			contentType: error.details.request?.contentType,
			withCredentials: error.details.request?.credentials,
			externalRequest: error.details.request?.externalRequest,

			requestHeaders: this.prepareHeaders(error.details.request?.headers),
			requestBody: error.details.request?.body,

			responseHeaders: this.prepareHeaders(error.details.response?.headers),
			responseBody: Object.get(error, 'details.response.body')
		};
	}

	/**
	 * Filters the specified headers according to settings {@see headerSettings}
	 * @param headers - headers that need to be filtered
	 */
	protected prepareHeaders(headers: CanUndef<Dictionary<CanArray<string>>>): CanUndef<Dictionary<CanArray<string>>> {
		let
			filteredHeaders = headers;

		const filterHeaders = (originalHeaders, filter) =>
			Object.keys(originalHeaders)
				.filter(filter)
				.reduce((headers, headerName) => {
					headers[headerName] = originalHeaders[headerName];
					return headers;
				}, {});

		if (headers) {
			if (this.headerSettings.include.size > 0) {
				filteredHeaders = filterHeaders(headers, (headerName) => this.headerSettings.include.has(headerName));

			} else if (this.headerSettings.exclude.size > 0) {
				filteredHeaders = filterHeaders(headers, (headerName) => !this.headerSettings.exclude.has(headerName));
			}
		}

		return filteredHeaders;
	}
}
