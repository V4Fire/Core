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
		opts: ObjectForEachOptions,
		cb: AnyFunction;

	if (Object.isFunction(cbOrOpts)) {
		cb = cbOrOpts;
		opts = Object.isPlainObject(optsOrCb) ? optsOrCb : {};

	} else {
		if (Object.isFunction(optsOrCb)) {
			cb = optsOrCb;

		} else {
			throw new ReferenceError('A callback to iterate is not specified');
		}

		opts = Object.isPlainObject(cbOrOpts) ? cbOrOpts : {};
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
		opts.notOwn == null &&
		opts.withDescriptor == null
	) {
		for (const el of obj) {
			cb(el, null, obj);
		}

		return;
	}

	if (Object.isTruly(opts.notOwn)) {
		for (const key in obj) {
			if (opts.notOwn === -1 && Object.hasOwnProperty(obj, key)) {
				continue;
			}

			cb(opts.withDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key], key, obj);
		}

		return;
	}

	for (let keys = Object.keys(obj!), i = 0; i < keys.length; i++) {
		const key = keys[i];
		cb(opts.withDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj![key], key, obj);
	}
});
