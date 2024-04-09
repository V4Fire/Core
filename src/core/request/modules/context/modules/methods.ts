/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { deprecated } from 'core/functools';
import { concatURLs, fromQueryString } from 'core/url';

import { globalOpts } from 'core/request/const';
import { queryTplRgxp, resolveURLRgxp } from 'core/request/modules/context/const';
import { applyQueryForStr, getRequestKey } from 'core/request/helpers';

import Headers from 'core/request/headers';
import type { RequestAPI } from 'core/request/interface';

import Super from 'core/request/modules/context/modules/params';

export default class RequestContext<D = unknown> extends Super<D> {
	/**
	 * Generates a string cache key for specified URL and returns it
	 * @param url
	 */
	getRequestKey(url: string): string {
		const
			p = this.params,
			cacheId = p.cacheId ?? '',
			strategy = Object.isString(p.cacheStrategy) ? p.cacheStrategy : p.cacheStrategy.constructor.name;

		return [getRequestKey(url, this.params), strategy, cacheId].join();
	}

	/**
	 * Returns an absolute URL for the request API
	 * @param [apiURL] - base API URL
	 */
	resolveAPI(apiURL: Nullable<string> = globalOpts.api): string {
		interface DomainParams {
			def?: string[];
			slice?: number;
			join?: boolean;
		}

		const params = {
			ctx: this,
			globalOpts,
			opts: this.params
		};

		const
			compute = (v) => Object.isFunction(v) ? v(params) : v,
			api = <{[K in keyof RequestAPI]: Nullable<string>}>({...this.params.api});

		for (let keys = Object.keys(api), i = 0; i < keys.length; i++) {
			const key = keys[i];
			api[key] = compute(api[key]);
		}

		if (api.url != null) {
			return api.url;
		}

		if (apiURL == null) {
			const
				nm = api.namespace ?? '';

			if (api.protocol == null) {
				return nm.startsWith('/') ? nm : `/${nm}`;
			}

			return concatURLs(
				resolve('protocol') +
				resolve('auth') +
				resolveDomains().toString() +
				resolve('port'),

				nm
			);
		}

		if (!RegExp.test(resolveURLRgxp, apiURL)) {
			return concatURLs(...resolveDomains({slice: 2, join: false}), resolve('namespace'));
		}

		return apiURL.replace(resolveURLRgxp, (str, protocol, auth, domains, port, nm) => {
			domains = domains?.split('.').reverse();
			nm = resolve('namespace', nm);

			if (protocol == null) {
				return concatURLs(...resolveDomains({slice: 2, join: false}), nm);
			}

			return concatURLs(
				resolve('protocol', protocol) +
				resolve('auth', auth) +
				resolveDomains({def: domains}).toString() +
				resolve('port', port),

				nm
			);
		});

		function resolveDomains({def = [], slice = 0, join = true}: DomainParams = {}) {
			const
				list = Array.from({length: 6}, (el, i) => i + 1).slice(slice).reverse(),
				url: string[] = [];

			for (let i = 0; i < list.length; i++) {
				const
					lvl = list[i];

				let
					domain = (lvl === 1 ? api.zone : api[`domain${lvl}`]);

				if (domain == null) {
					domain = def[lvl - 1];

				} else if (domain === '') {
					domain = undefined;
				}

				if (domain != null) {
					url.push(domain);
				}
			}

			return join !== false ? url.join('.') : url;
		}

		function resolve(name: string, def?: string): string {
			const
				val = String((api[name] != null ? api[name] : def) ?? '');

			switch (name) {
				case 'auth':
					return val !== '' ? `${val}@` : '';

				case 'port':
					return val !== '' ? `:${val}` : '';

				case 'protocol':
					return val !== '' ? `${val.replace(/:\/+$/, '')}://` : '';

				default:
					return val;
			}
		}
	}

	/**
	 * Resolves request parameters and returns an absolute URL for the request
	 * @param [url] - base request URL
	 */
	resolveRequest(url?: Nullable<string>): string {
		if (url == null) {
			url = '';

		} else {
			const
				p = this.params,
				q = this.query;

			let
				data;

			if (this.withoutBody) {
				data = q;

			} else {
				data = Object.isPlainObject(p.body) ? p.body : q;
			}

			if (Object.isPlainObject(data)) {
				p.headers = new Headers(p.headers, data);
				url = applyQueryForStr(url, data, queryTplRgxp);

			} else {
				p.headers = new Headers(p.headers);
			}

			const
				urlChunks = url.split('?', 2);

			if (urlChunks.length > 1) {
				Object.assign(q, fromQueryString(url));
				url = urlChunks[0];
			}

			if (Object.size(q) > 0) {
				url = `${url}?${p.querySerializer(q)}`;
			}

			if (this.canCache) {
				this.cacheKey = this.getRequestKey(url);
			}
		}

		return this.params.url = url;
	}

	/**
	 * Returns an absolute URL for the request
	 *
	 * @see [[RequestContext.resolveRequest]]
	 * @param [url] - base request URL
	 */
	@deprecated({renamedTo: 'resolveRequest'})
	resolveURL(url?: Nullable<string>): string {
		return this.resolveRequest(url);
	}

	/**
	 * Drops the request cache
	 *
	 * @param [recursive] - if true, then the `dropCache` operation will be propagated recursively,
	 *   for example, if an engine based on a data provider is used
	 */
	dropCache(recursive?: boolean): void {
		const
			key = this.cacheKey;

		if (key != null) {
			this.cache.remove(key);
		}

		if (recursive) {
			this.params.engine.dropCache?.(recursive);
		}
	}

	/**
	 * Destroys the request context
	 */
	destroy(): void {
		if (this.destroyed) {
			return;
		}

		this.dropCache(true);
		this.params.engine.destroy?.();

		Object.keys(this.params).forEach((key) => {
			delete this.params[key];
		});

		this.destroyed = true;
	}
}
