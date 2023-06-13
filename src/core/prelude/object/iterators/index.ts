/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

import {

	isFunction,
	isPlainObject,
	isString,
	isIterable,
	isMap,
	isSet,
	isArray,
	isArrayLike,
	isTruly

} from 'core/prelude/types';

/** @see [[ObjectConstructor.forEach]] */
export const forEach = extend< typeof Object.forEach>(Object, 'forEach', (
	obj: unknown,
	optsOrCb: ObjectForEachOptions | AnyFunction,
	cbOrOpts?: AnyFunction | ObjectForEachOptions
) => {
	if (obj == null) {
		return;
	}

	let
		p: ObjectForEachOptions,
		cb: AnyFunction;

	if (isFunction(cbOrOpts)) {
		cb = cbOrOpts;
		p = isPlainObject(optsOrCb) ? optsOrCb : {};

	} else {
		if (isFunction(optsOrCb)) {
			cb = optsOrCb;

		} else {
			throw new ReferenceError('A callback to iterate is not specified');
		}

		p = isPlainObject(cbOrOpts) ? cbOrOpts : {};
	}

	const
		passDescriptor = p.passDescriptor ?? p.withDescriptor;

	let
		notOwn: Nullable<boolean | -1>;

	switch (p.propsToIterate) {
		case 'all':
			notOwn = true;
			break;

		case 'own':
			notOwn = false;
			break;

		case 'inherited':
			notOwn = -1;
			break;

		default:
			notOwn = p.notOwn;
	}

	if (isString(obj)) {
		let
			i = 0;

		for (const el of obj) {
			let
				iterVal: string | PropertyDescriptor = el;

			if (passDescriptor) {
				iterVal = {
					configurable: false,
					enumerable: true,
					writable: false,
					value: el
				};
			}

			cb(iterVal, i++, obj);
		}

		return;
	}

	if (typeof obj !== 'object') {
		return;
	}

	if (!passDescriptor && notOwn == null) {
		if (isArrayLike(obj)) {
			for (let i = 0; i < obj.length; i++) {
				cb(obj[i], i, obj);
			}

			return;
		}

		if (isMap(obj) || isSet(obj)) {
			for (let o = obj.entries(), i = o.next(); !i.done; i = o.next()) {
				const [key, el] = i.value;
				cb(el, key, obj);
			}

			return;
		}

		if (isIterable(obj)) {
			let
				i = 0;

			for (const el of obj) {
				if (isArray(el) && el.length === 2) {
					cb(el[1], el[0], obj);

				} else {
					cb(el, i++, obj);
				}
			}

			return;
		}
	}

	if (isTruly(notOwn)) {
		if (notOwn === -1) {
			for (const key in obj) {
				if (Object.hasOwnProperty(obj, key)) {
					continue;
				}

				cb(passDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key], key, obj);
			}

			return;
		}

		if (p.withNonEnumerables) {
			forEach(obj, cb, {withNonEnumerables: true, passDescriptor});
			forEach(Object.getPrototypeOf(obj), cb, {propsToIterate: 'all', passDescriptor});
			return;
		}

		// eslint-disable-next-line guard-for-in
		for (const key in obj) {
			const el = passDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key];
			cb(el, key, obj);
		}

		return;
	}

	const
		keys = Object[p.withNonEnumerables ? 'getOwnPropertyNames' : 'keys'](obj);

	for (let i = 0; i < keys.length; i++) {
		const
			key = keys[i],
			el = passDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key];

		cb(el, key, obj);
	}
});
