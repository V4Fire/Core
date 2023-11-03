/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';
import { canParse, isInvalidKey } from 'core/prelude/object/const';

import {

	isString,
	isArray,
	isDictionary,
	isFunction,
	isNumber

} from 'core/prelude/types';

import { test } from 'core/prelude/regexp';

import { get } from 'core/prelude/object/property';

/** @see [[ObjectConstructor.trySerialize]] */
export const trySerialize = extend(Object, 'trySerialize', (value, replacer?: JSONCb) => {
	if (isFunction(value)) {
		replacer = value;
		return (value) => trySerialize(value, replacer);
	}

	let
		encodedValue;

	const canSerializeToJSON =
		isString(value) ||
		isArray(value) ||
		isDictionary(value) ||
		isFunction(get(value, 'toJSON'));

	if (canSerializeToJSON) {
		try {
			encodedValue = JSON.stringify(value, replacer);

		} catch {
			encodedValue = value;
		}

	} else {
		encodedValue = value;

		try {
			if (isFunction(replacer)) {
				return trySerialize(replacer('', encodedValue), replacer);
			}
		} catch {}
	}

	return encodedValue;
});

/** @see [[ObjectConstructor.parse]] */
export const parse = extend<typeof Object.parse>(Object, 'parse', (value, reviver?: JSONCb) => {
	if (isFunction(value)) {
		reviver = value;
		return (value) => parse(value, wrapReviver(reviver));
	}

	if (isString(value)) {
		if (value === 'undefined') {
			return;
		}

		if (test(canParse, value)) {
			try {
				const
					parsedVal = JSON.parse(value, wrapReviver(reviver));

				if (isNumber(parsedVal)) {
					return parsedVal.isSafe() ? parsedVal : value;
				}

				return parsedVal;
			} catch {}
		}

		if (isFunction(reviver)) {
			return reviver('', value);
		}
	}

	return value;

	function wrapReviver(fn: Nullable<JSONCb>) {
		return (key, value) => {
			if (test(isInvalidKey, key)) {
				return;
			}

			if (isFunction(fn)) {
				value = fn(key, value);
			}

			return value;
		};
	}
});
