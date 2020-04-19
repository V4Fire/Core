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
	convertToSeparatedStr

} from 'core/prelude/string/helpers';

/** @see String.capitalize */
extend(String.prototype, 'capitalize', function (
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
// tslint:disable-next-line:only-arrow-functions
extend(String, 'capitalize', (value: unknown, opts?: StringCapitalizeOptions) => {
	if (value == null) {
		return undefined;
	}

	if (Object.isDictionary(value)) {
		opts = value;
		return (value) => String(value).capitalize(opts);
	}

	return String(value).capitalize(opts);
});

/** @see String.camelize */
extend(String.prototype, 'camelize', function (
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
// tslint:disable-next-line:only-arrow-functions
extend(String, 'camelize', (value: unknown, upperOrOpts: boolean | StringCamelizeOptions) => {
	if (value == null) {
		return undefined;
	}

	if (Object.isBoolean(value) || Object.isDictionary(value)) {
		upperOrOpts = value;
		return (value) => String(value).camelize(<any>upperOrOpts);
	}

	return String(value).camelize(<any>upperOrOpts);
});

/** @see String.dasherize */
extend(String.prototype, 'dasherize', function (
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
// tslint:disable-next-line:only-arrow-functions
extend(String, 'dasherize', (value: unknown, stableOrOpts: boolean | StringDasherizeOptions) => {
	if (value == null) {
		return undefined;
	}

	if (Object.isBoolean(value) || Object.isDictionary(value)) {
		stableOrOpts = value;
		return (value) => String(value).dasherize(<any>stableOrOpts);
	}

	return String(value).dasherize(<any>stableOrOpts);
});

/** @see String.underscore */
extend(String.prototype, 'underscore', function (
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
// tslint:disable-next-line:only-arrow-functions
extend(String, 'underscore', (value: unknown, stableOrOpts: boolean | StringUnderscoreOptions) => {
	if (value == null) {
		return undefined;
	}

	if (Object.isBoolean(value) || Object.isDictionary(value)) {
		stableOrOpts = value;
		return (value) => String(value).underscore(<any>stableOrOpts);
	}

	return String(value).underscore(<any>stableOrOpts);
});
