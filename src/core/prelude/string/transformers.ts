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

/** @see String.capitalize */
extend(String.prototype, 'capitalize', function capitalize(
	this: string,
	{lower, all, cache}: StringCapitalizeOptions = {}
): string {
	const
		str = this.toString(),
		key = `${Boolean(lower)}:${Boolean(all)}:${str}`,
		val = cache !== false ? capitalizeCache[key] : undefined;

	if (val !== undefined) {
		return val;
	}

	if (all) {
		const
			chunks = str.split(' '),
			res = <string[]>[];

		for (let i = 0; i < chunks.length; i++) {
			res.push(chunks[i].capitalize({lower}));
		}

		return capitalizeCache[str] = res.join(' ');
	}

	let res = lower ? str.toLowerCase() : str;
	res = res[0].toUpperCase() + res.slice(1);

	if (cache !== false) {
		capitalizeCache[key] = res;
	}

	return res;
});

/** @see StringConstructor.capitalize */
extend(String, 'capitalize', createStaticTransformFunction('capitalize'));

/** @see String.camelize */
extend(String.prototype, 'camelize', function camelize(
	this: string,
	upperOrOpts: boolean | StringCamelizeOptions
): string {
	const
		p = <StringCamelizeOptions>{};

	if (Object.isBoolean(upperOrOpts)) {
		p.upper = upperOrOpts;

	} else {
		Object.assign(p, upperOrOpts);
	}

	p.upper = p.upper !== false;

	const
		str = this.toString(),
		key = `${p.upper}:${str}`,
		val = p.cache !== false ? camelizeCache[key] : undefined;

	if (val !== undefined) {
		return val;
	}

	let
		res = str.trim().replace(camelizeRgxp, toCamelize);

	if (p.upper) {
		res = res[0].toUpperCase() + res.slice(1);
	}

	if (p.cache !== false) {
		camelizeCache[key] = res;
	}

	return res;
});

/** @see StringConstructor.camelize */
extend(String, 'camelize', createStaticTransformFunction('camelize'));

/** @see String.dasherize */
extend(String.prototype, 'dasherize', function dasherize(
	this: string,
	stableOrOpts?: boolean | StringDasherizeOptions
): string {
	const
		p = <StringDasherizeOptions>{};

	if (Object.isBoolean(stableOrOpts)) {
		p.stable = stableOrOpts;

	} else {
		Object.assign(p, stableOrOpts);
	}

	p.stable = p.stable === true;

	const
		str = this.toString(),
		key = `${p.stable}:${str}`,
		val = p.cache !== false ? dasherizeCache[key] : undefined;

	if (val !== undefined) {
		return val;
	}

	const res = convertToSeparatedStr(
		str.trim().replace(normalizeRgxp, toDasherize),
		'-',
		p.stable
	);

	if (p.cache !== false) {
		dasherizeCache[key] = res;
	}

	return res;
});

/** @see StringConstructor.dasherize */
extend(String, 'dasherize', createStaticTransformFunction('dasherize'));

/** @see String.underscore */
extend(String.prototype, 'underscore', function underscore(
	this: string,
	stableOrOpts?: boolean | StringUnderscoreOptions
): string {
	const
		p = <StringUnderscoreOptions>{};

	if (Object.isBoolean(stableOrOpts)) {
		p.stable = stableOrOpts;

	} else {
		Object.assign(p, stableOrOpts);
	}

	p.stable = p.stable === true;

	const
		str = this.toString(),
		key = `${p.stable}:${str}`,
		val = p.cache !== false ? underscoreCache[key] : undefined;

	if (val !== undefined) {
		return val;
	}

	const res = convertToSeparatedStr(
		str.trim().replace(normalizeRgxp, toUnderscore),
		'_',
		p.stable
	);

	if (p.cache !== false) {
		underscoreCache[key] = res;
	}

	return res;
});

/** @see StringConstructor.underscore */
extend(String, 'underscore', createStaticTransformFunction('underscore'));
