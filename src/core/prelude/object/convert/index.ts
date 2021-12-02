/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from '~/core/prelude/extend';
import { canParse } from '~/core/prelude/object/const';

/** @see [[ObjectConstructor.trySerialize]] */
extend(Object, 'trySerialize', (value, replacer?: JSONCb) => {
	if (Object.isFunction(value)) {
		replacer = value;
		return (value) => Object.trySerialize(value, replacer);
	}

	let
		encodedValue;

	const canSerializeToJSON =
		Object.isString(value) ||
		Object.isArray(value) ||
		Object.isDictionary(value) ||
		Object.isFunction(Object.get(value, 'toJSON'));

	if (canSerializeToJSON) {
		try {
			encodedValue = JSON.stringify(value, replacer);

		} catch {
			encodedValue = value;
		}

	} else {
		encodedValue = value;

		try {
			if (Object.isFunction(replacer)) {
				return Object.trySerialize(replacer('', encodedValue), replacer);
			}
		} catch {}
	}

	return encodedValue;
});

/** @see [[ObjectConstructor.parse]] */
extend(Object, 'parse', (value, reviver?: JSONCb) => {
	if (Object.isFunction(value)) {
		reviver = value;
		return (value) => Object.parse(value, reviver);
	}

	if (Object.isString(value)) {
		if (value === 'undefined') {
			return;
		}

		if (canParse.test(value)) {
			try {
				return JSON.parse(value, reviver);
			} catch {}
		}

		if (Object.isFunction(reviver)) {
			return reviver('', value);
		}
	}

	return value;
});
