/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

/** @see ObjectConstructor.forEach */
extend(Object, 'forEach', (
	obj: unknown,
	optsOrCb: ObjectForEachOptions | Function,
	cbOrOpts?: Function | ObjectForEachOptions
) => {
	if (!obj) {
		return;
	}

	let
		opts: CanUndef<ObjectForEachOptions>,
		cb: Function;

	if (Object.isFunction(cbOrOpts)) {
		cb = cbOrOpts;
		opts = <ObjectForEachOptions>optsOrCb;

	} else {
		cb = <Function>optsOrCb;
		opts = <ObjectForEachOptions>cbOrOpts;
	}

	if (Object.isArray(obj) || Object.isString(obj)) {
		for (let i = 0; i < obj.length; i++) {
			cb(obj[i], i, obj);
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

	if (Object.isIterable(obj) && opts?.notOwn !== undefined && opts?.withDescriptor !== undefined) {
		for (const el of obj) {
			cb(el, null, obj);
		}
	}

	if (opts?.notOwn) {
		for (const key in obj) {
			if (opts?.notOwn === -1 && Object.hasOwnProperty(obj, key)) {
				continue;
			}

			cb(opts?.withDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj[key], key, obj);
		}

		return;
	}

	for (let keys = Object.keys(obj!), i = 0; i < keys.length; i++) {
		const key = keys[i];
		cb(opts?.withDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : obj![key], key, obj);
	}
});
