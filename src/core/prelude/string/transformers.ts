/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import {

	capitalizeCache,
	camelizeCache,
	dasherizeCache,
	underscoreCache,

	camelizeRgxp,
	normalizeRgxp

} from 'core/prelude/string/const';

import {

	toCamelize,
	toDasherize,
	toUnderscore,
	convertToSeparatedStr,
	createStaticTransformFunction

} from 'core/prelude/string/helpers';

/** @see [[String.capitalize]] */
extend(String.prototype, 'capitalize', function capitalize(
	this: string,
	{lower, all, cache}: StringCapitalizeOptions = {}
): string {
	const
		str = this.toString(),
		cacheKey = cache !== false ? `${Boolean(lower)}:${Boolean(all)}:${str}` : null,
		valFromCache = cacheKey != null ? capitalizeCache[cacheKey] : null;

	if (valFromCache != null) {
		return valFromCache;
	}

	let
		res: string;

	if (all) {
		const
			chunks = str.split(' ');

		for (let i = 0; i < chunks.length; i++) {
			chunks[i] = chunks[i].capitalize({lower});
		}

		res = chunks.join(' ');

	} else {
		res = lower ? str.toLowerCase() : str;
		res = res[0].toUpperCase() + res.slice(1);
	}

	if (cacheKey != null) {
		capitalizeCache[cacheKey] = res;
	}

	return res;
});

/** @see [[StringConstructor.capitalize]] */
extend(String, 'capitalize', createStaticTransformFunction('capitalize'));

/** @see [[String.camelize]] */
extend(String.prototype, 'camelize', function camelize(
	this: string,
	upperOrOpts: boolean | StringCamelizeOptions
): string {
	const
		opts = <StringCamelizeOptions>{};

	if (Object.isBoolean(upperOrOpts)) {
		opts.upper = upperOrOpts;

	} else {
		Object.assign(opts, upperOrOpts);
	}

	opts.upper = opts.upper !== false;

	const
		str = this.toString(),
		cacheKey = opts.cache !== false ? `${opts.upper}:${str}` : null,
		valFromCache = cacheKey != null ? camelizeCache[cacheKey] : null;

	if (valFromCache != null) {
		return valFromCache;
	}

	let
		res = str.trim().replace(camelizeRgxp, toCamelize);

	if (res.length > 0) {
		res = (opts.upper ? res[0].toUpperCase() : res[0].toLowerCase()) + res.slice(1);
	}

	if (cacheKey != null) {
		camelizeCache[cacheKey] = res;
	}

	return res;
});

/** @see [[StringConstructor.camelize]] */
extend(String, 'camelize', createStaticTransformFunction('camelize'));

/** @see [[String.dasherize]] */
extend(String.prototype, 'dasherize', function dasherize(
	this: string,
	stableOrOpts?: boolean | StringDasherizeOptions
): string {
	const
		opts = <StringDasherizeOptions>{};

	if (Object.isBoolean(stableOrOpts)) {
		opts.stable = stableOrOpts;

	} else {
		Object.assign(opts, stableOrOpts);
	}

	opts.stable = opts.stable === true;

	const
		str = this.toString(),
		cacheKey = opts.cache !== false ? `${opts.stable}:${str}` : null,
		valFromCache = cacheKey != null ? dasherizeCache[cacheKey] : null;

	if (valFromCache != null) {
		return valFromCache;
	}

	const res = convertToSeparatedStr(
		str.trim().replace(normalizeRgxp, toDasherize),
		'-',
		opts.stable
	);

	if (cacheKey != null) {
		dasherizeCache[cacheKey] = res;
	}

	return res;
});

/** @see [[StringConstructor.dasherize]] */
extend(String, 'dasherize', createStaticTransformFunction('dasherize'));

/** @see [[String.underscore]] */
extend(String.prototype, 'underscore', function underscore(
	this: string,
	stableOrOpts?: boolean | StringUnderscoreOptions
): string {
	const
		opts = <StringUnderscoreOptions>{};

	if (Object.isBoolean(stableOrOpts)) {
		opts.stable = stableOrOpts;

	} else {
		Object.assign(opts, stableOrOpts);
	}

	opts.stable = opts.stable === true;

	const
		str = this.toString(),
		cacheKey = opts.cache !== false ? `${opts.stable}:${str}` : null,
		valFromCache = cacheKey != null ? underscoreCache[cacheKey] : null;

	if (valFromCache != null) {
		return valFromCache;
	}

	const res = convertToSeparatedStr(
		str.trim().replace(normalizeRgxp, toUnderscore),
		'_',
		opts.stable
	);

	if (cacheKey != null) {
		underscoreCache[cacheKey] = res;
	}

	return res;
});

/** @see [[StringConstructor.underscore]] */
extend(String, 'underscore', createStaticTransformFunction('underscore'));
