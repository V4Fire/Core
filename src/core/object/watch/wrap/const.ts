/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { getProxyValue } from 'core/object/watch/engines/helpers';
import { WrapParams } from 'core/object/watch/wrap/interface';

export const deleteMethods = {
	delete: (target: Map<any, any> | Set<any>, opts: WrapParams, key) => {
		if (target.has(key)) {
			return [[undefined, Array.concat([], opts.path ?? [], key), 'get' in target ? target.get(key) : key]];
		}

		return null;
	}
};

export const clearMethods = {
	clear: (target: Set<any>, opts: WrapParams) => target.size !== 0 ? [[
		undefined, undefined, Array.concat([], opts.path)
	]] : null
};

export const weakMapMethods = {
	...deleteMethods,

	get: {
		type: 'get',
		value: (target: WeakMap<any, any>, opts: WrapParams, key) => {
			const val = opts.original.call(target, key);
			return getProxyValue(val, key, opts.path, opts.handlers, top, opts.watchOpts);
		}
	},

	set: (target: WeakMap<any, any>, opts: WrapParams, key, val) => {
		const oldVal = target.get(key);
		return oldVal !== val ? [[val, oldVal, Array.concat([], opts.path, key)]] : null;
	}
};

export const weakSetMethods = {
	...deleteMethods,

	add: (target: WeakMap<any, any>, opts: WrapParams, val) => {
		if (!target.has(val)) {
			return [[val, undefined, Array.concat([], opts.path, val)]];
		}

		return null;
	}
};

export const structureWrappers = Object.createDict({
	weakMap: {
		is: Object.isWeakMap,
		methods: weakMapMethods
	},

	weakSet: {
		is: Object.isWeakSet,
		args: weakSetMethods,
		methods: weakSetMethods
	},

	map: {
		is: Object.isMap,
		methods: {
			...weakMapMethods,
			...clearMethods
		}
	},

	set: {
		is: Object.isSet,
		methods: {
			...weakSetMethods,
			...clearMethods
		}
	},

	array: {
		is: Object.isArray,
		methods: {
			push: (target: unknown[], opts: WrapParams, ...val) => {
				const
					res = <unknown[][]>[];

				for (let i = 0; i < val.length; i++) {
					res.push([val[i], undefined, Array.concat([], opts.path, target.length)]);
				}

				return res;
			},

			pop: (target: unknown[], opts: WrapParams) => {
				const l = target.length - 1;
				return l >= 0 ? [undefined, target[l], Array.concat([], opts.path, l)] : null;
			},

			unshift: (target: unknown[], opts: WrapParams, val) => {
				const
					res = <unknown[][]>[];

				for (let i = 0; i < val.length; i++) {
					res.push([val[i], i ? val[i - 1] : target[0], Array.concat([], opts.path, 0)]);
				}

				return res;
			},

			shift: (target: unknown[], opts: WrapParams) =>
				target.length ? [target[1], target[0], Array.concat([], opts.path, 0)] : null,

			splice: (target: unknown[], opts: WrapParams, start, deleteCount, ...args) => {
				if (deleteCount <= 0 && !args.length) {
					return null;
				}

				start = start || 0;
				deleteCount = deleteCount || target.length;

				const
					range = target.slice(start, start + deleteCount),
					delLength = range.length - args.length,
					res = <unknown[][]>[];

				let
					i = 0;

				for (; i < range.length; i++) {
					if (i >= args.length) {
						break;
					}

					res.push([args[i], range[i], Array.concat([], opts.path, i)]);
				}

				if (i < range.length) {
					res.push([target.length - delLength, target.length, Array.concat([], opts.path, 'length')]);

				} else if (i < args.length) {
					for (; i < args.length; i++) {
						res.push([args[i], undefined, Array.concat([], opts.path, i)]);
					}
				}

				return res;
			}
		}
	}
});
