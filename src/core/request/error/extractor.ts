/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { ErrorDetailsExtractor, ErrorCtor } from 'core/error';
import type { RequestErrorDetailsExtractorSettings } from 'core/request/error/interface';
import RequestError from 'core/request/error';

interface SettingsPreprocessedFiltering {
	include: Set<string>;
	exclude: Set<string>;
}

export class RequestErrorDetailsExtractor implements ErrorDetailsExtractor<RequestError> {
	target: ErrorCtor<RequestError> = RequestError;

	protected headerSettings: SettingsPreprocessedFiltering;

	constructor(settings?: RequestErrorDetailsExtractorSettings) {
		this.headerSettings = {
			include: new Set(settings?.headers.include),
			exclude: new Set(settings?.headers.exclude)
		};
	}

	extract(error: RequestError): unknown {
		return {
			type: error.type,
			status: error.details.response?.status,
			method: error.details.request?.method,
			query: error.details.request?.query,
			url: error.details.request?.url,
			contentType: error.details.request?.contentType,
			withCredentials: error.details.request?.credentials,

			requestHeaders: this.prepareHeaders(error.details.request?.headers),
			requestBody: error.details.request?.body,

			responseHeaders: this.prepareHeaders(error.details.response?.headers),
			// @ts-ignore - `body` property is protected but is needed here
			responseBody: error.details.response?.body
		};
	}

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
