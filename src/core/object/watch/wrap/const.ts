/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export const deleteMethods = {
	delete: (target: Map<any, any> | Set<any>, path, key) => {
		if (target.has(key)) {
			return [[undefined, [].concat(path ?? [], key), 'get' in target ? target.get(key) : key]];
		}

		return null;
	}
};

export const clearMethods = {
	clear: (target: Set<any>, path) => target.size !== 0 ? [[
		undefined, undefined, [].concat(path ?? [])
	]] : null
};

export const weakMapMethods = {
	...deleteMethods,

	set: (target: WeakMap<any, any>, path, key, val) => {
		const oldVal = target.get(key);
		return oldVal !== val ? [[val, oldVal, [].concat(path ?? [], key)]] : null;
	}
};

export const weakSetMethods = {
	...deleteMethods,

	add: (target: WeakMap<any, any>, path, val) => {
		if (!target.has(val)) {
			return [[val, undefined, [].concat(path ?? [], val)]];
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
			push: (target: unknown[], path, ...val) => {
				const
					res = <unknown[][]>[];

				for (let i = 0; i < val.length; i++) {
					res.push([val[i], undefined, (<number[]>[]).concat(path ?? [], target.length)]);
				}

				return res;
			},

			pop: (target: unknown[], path) => {
				const l = target.length - 1;
				return l >= 0 ? [undefined, target[l], (<any[]>[]).concat(path ?? [], l)] : null;
			},

			unshift: (target: unknown[], path, val) => {
				const
					res = <unknown[][]>[];

				for (let i = 0; i < val.length; i++) {
					res.push([val[i], i ? val[i - 1] : target[0], (<number[]>[]).concat(path ?? [], 0)]);
				}

				return res;
			},

			shift: (target: unknown[], path) =>
				target.length ? [target[1], target[0], (<number[]>[]).concat(path ?? [], 0)] : null,

			splice: (target: unknown[], path, start, deleteCount, ...args) => {
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

					res.push([args[i], range[i], (<number[]>[]).concat(path ?? [], i)]);
				}

				if (i < range.length) {
					res.push([target.length - delLength, target.length, (<string[]>[]).concat(path ?? [], 'length')]);

				} else if (i < args.length) {
					for (; i < args.length; i++) {
						res.push([args[i], undefined, (<number[]>[]).concat(path ?? [], i)]);
					}
				}

				return res;
			}
		}
	}
});
