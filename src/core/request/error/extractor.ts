/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { ErrorDetailsExtractor, ErrorCtor } from 'core/error';

import RequestError from 'core/request/error';
import Headers, { RawHeaders } from 'core/request/headers';

import type { RequestErrorDetailsExtractorOptions } from 'core/request/error/interface';

interface FilterParams {
	include: Set<string>;
	exclude: Set<string>;
}

/**
 * Extractor to get details from `RequestError`
 */
export class RequestErrorDetailsExtractor implements ErrorDetailsExtractor<RequestError> {
	/** @inheritDoc */
	target: ErrorCtor<RequestError> = RequestError;

	/**
	 * Parameters to define which header makes its way to the result
	 */
	protected headersFilterParams: FilterParams;

	constructor(opts?: RequestErrorDetailsExtractorOptions) {
		this.headersFilterParams = {
			include: new Set(opts?.headers.include),
			exclude: new Set(opts?.headers.exclude)
		};
	}

	/** @inheritDoc */
	extract(error: RequestError): unknown {
		const
			d = error.details.deref() ?? {};

		return {
			url: d.request?.url,
			type: error.type,

			status: d.response?.status,
			method: d.request?.method,
			query: d.request?.query,

			contentType: d.request?.contentType,
			withCredentials: d.request?.credentials,

			requestHeaders: this.prepareHeaders(d.request?.headers),
			requestBody: d.request?.body,

			responseHeaders: this.prepareHeaders(d.response?.headers),
			responseBody: d.response?.body
		};
	}

	/**
	 * Filters the specified headers according to settings
	 *
	 * @see headersFilterParams
	 * @param headers - headers that need to be filtered
	 */
	protected prepareHeaders(headers: CanUndef<RawHeaders>): CanUndef<Headers> {
		if (headers == null) {
			return;
		}

		const
			p = this.headersFilterParams,
			filteredHeaders = new Headers(headers);

		if (p.include.size > 0) {
			filterHeaders(filteredHeaders, (headerName) => p.include.has(headerName));

		} else if (p.exclude.size > 0) {
			filterHeaders(filteredHeaders, (headerName) => !p.exclude.has(headerName));
		}

		return filteredHeaders;

		function filterHeaders(headers: Headers, filter: (string) => boolean) {
			headers.forEach((_, name) => {
				if (!filter(name)) {
					headers.delete(name);
				}
			});
		}
	}
}
