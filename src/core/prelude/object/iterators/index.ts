/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see [[ObjectConstructor.forEach]] */
extend(Object, 'forEach', (
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

	if (Object.isFunction(cbOrOpts)) {
		cb = cbOrOpts;
		p = Object.isPlainObject(optsOrCb) ? optsOrCb : {};

	} else {
		if (Object.isFunction(optsOrCb)) {
			cb = optsOrCb;

		} else {
			throw new ReferenceError('A callback to iterate is not specified');
		}

		p = Object.isPlainObject(cbOrOpts) ? cbOrOpts : {};
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

	if (Object.isString(obj)) {
		let
			i = 0;

		for (const el of obj) {
			let iterVal: string | PropertyDescriptor = el;

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
		if (Object.isArrayLike(obj)) {
			// eslint-disable-next-line vars-on-top, no-var
			for (var i = 0; i < obj.length; i++) {
				cb(obj[i], i, obj);
			}

			return;
		}

		if (Object.isMap(obj) || Object.isSet(obj)) {
			for (const [key, el] of obj.entries()) {
				cb(el, key, obj);
			}

			return;
		}

		if (Object.isIterable(obj)) {
			let i = 0;

			for (const el of obj) {
				if (Object.isArray(el) && el.length === 2) {
					cb(el[1], el[0], obj);

				} else {
					cb(el, i++, obj);
				}
			}

			return;
		}
	}

	if (Object.isTruly(notOwn)) {
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
			Object.forEach(obj, cb, {withNonEnumerables: true, passDescriptor});
			Object.forEach(Object.getPrototypeOf(obj), cb, {propsToIterate: 'all', passDescriptor});
			return;
		}

		// eslint-disable-next-line guard-for-in
		for (const key in obj) {
			const el = passDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key];
			cb(el, key, obj);
		}

		return;
	}

	const keys = p.withNonEnumerables ? Object.getOwnPropertyNames(obj) : Object.keys(obj);

	keys.forEach((key) => {
		const el = passDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key];
		cb(el, key, obj);
	});
});
