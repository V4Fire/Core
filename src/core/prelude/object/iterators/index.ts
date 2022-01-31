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
	if (!Object.isTruly(obj)) {
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
		notOwn;

	switch (p.propsToIterate) {
		case 'own':
			notOwn = false;
			break;

		case 'inherited':
			notOwn = -1;
			break;

		case 'all':
			notOwn = true;
			break;

		default:
			notOwn = p.notOwn;
	}

	if (Object.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			cb(obj[i], i, obj);
		}

		return;
	}

	if (Object.isString(obj)) {
		let
			i = 0;

		for (const el of obj) {
			cb(el, i++, obj);
		}

		return;
	}

	if (typeof obj !== 'object') {
		return;
	}

	if (Object.isMap(obj) || Object.isSet(obj)) {
		for (let o = obj.entries(), i = o.next(); !i.done; i = o.next()) {
			const [key, el] = i.value;
			cb(el, key, obj);
		}

		return;
	}

	if (
		Object.isIterable(obj) &&
		notOwn == null &&
		passDescriptor == null
	) {
		for (const el of obj) {
			cb(el, null, obj);
		}

		return;
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

	const
		keys = Object[p.withNonEnumerables ? 'getOwnPropertyNames' : 'keys'](obj!);

	for (let i = 0; i < keys.length; i++) {
		const
			key = keys[i],
			el = passDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj![key];

		cb(el, key, obj);
	}
});
