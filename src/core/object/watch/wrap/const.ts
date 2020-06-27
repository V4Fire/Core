/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { getProxyValue } from 'core/object/watch/engines/helpers';
import { WrapParams, WrapResult, StructureWrappers } from 'core/object/watch/wrap/interface';

export const deleteMethods = {
	delete: (
		target: Map<any, any> | Set<any>,
		opts: WrapParams,
		key: unknown
	): Nullable<WrapResult> => {
		if (target.has(key)) {
			return [[undefined, 'get' in target ? target.get(key) : key, [...opts.path, key]]];
		}

		return null;
	}
};

export const clearMethods = {
	clear: (target: Set<any>, opts: WrapParams): Nullable<WrapResult> => {
		if (target.size !== 0) {
			return [[undefined, undefined, opts.path]];
		}

		return null;
	}
};

export const weakMapMethods = {
	...deleteMethods,

	get: {
		type: 'get',
		value: (target: WeakMap<any, any>, opts: WrapParams, key: unknown): unknown => {
			const val = opts.original.call(target, key);
			return getProxyValue(val, key, opts.path, opts.handlers, top, opts.watchOpts);
		}
	},

	set: (target: WeakMap<any, any>, opts: WrapParams, key: unknown, value: unknown): Nullable<WrapResult> => {
		const oldVal = target.get(key);
		return oldVal !== value ? [[value, oldVal, [...opts.path, key]]] : null;
	}
};

export const weakSetMethods = {
	...deleteMethods,

	add: (target: WeakMap<any, any>, opts: WrapParams, value: unknown): Nullable<WrapResult> => {
		if (!target.has(value)) {
			return [[value, undefined, [...opts.path, value]]];
		}

		return null;
	}
};

export const structureWrappers = Object.createDict<StructureWrappers>({
	weakMap: {
		is: Object.isWeakMap.bind(Object),
		methods: weakMapMethods
	},

	weakSet: {
		is: Object.isWeakSet.bind(Object),
		methods: weakSetMethods
	},

	map: {
		is: Object.isMap.bind(Object),
		methods: {
			...weakMapMethods,
			...clearMethods
		}
	},

	set: {
		is: Object.isSet.bind(Object),
		methods: {
			...weakSetMethods,
			...clearMethods
		}
	},

	array: {
		is: Object.isArray.bind(Object),
		methods: {
			push: (target: unknown[], opts: WrapParams, ...value: unknown[]): Nullable<WrapResult> => {
				const
					res = <WrapResult>[];

				for (let i = 0; i < value.length; i++) {
					res.push([value[i], undefined, [...opts.path, target.length + i]]);
				}

				return res;
			},

			pop: (target: unknown[], opts: WrapParams): Nullable<WrapResult> => {
				const l = target.length;
				return l > 0 ? [[l - 1, l, [...opts.path, 'length']]] : null;
			},

			unshift: (target: unknown[], opts: WrapParams, ...value: unknown[]): Nullable<WrapResult> => {
				const
					res = <WrapResult>[];

				for (let i = target.length - 1; i >= 0; i--) {
					res.push([target[i], target[i + value.length], [...opts.path, i + value.length]]);
				}

				for (let i = 0; i < value.length; i++) {
					res.push([value[i], target[i], [...opts.path, i]]);
				}

				return res;
			},

			shift: (target: unknown[], opts: WrapParams): Nullable<WrapResult> => {
				if (target.length > 0) {
					const
						l = target.length,
						res = <WrapResult>[];

					for (let i = 1; i < l; i++) {
						res.push([target[i], target[i - 1], [...opts.path, i - 1]]);
					}

					res.push([l - 1, l, [...opts.path, 'length']]);
					return res;
				}

				return null;
			},

			splice: (
				target: unknown[],
				opts: WrapParams,
				start?: number,
				deleteNumber?: number,
				...newEls: unknown[]
			): Nullable<WrapResult> => {
				const
					targetLength = target.length;

				if (start == null || start >= targetLength) {
					return null;
				}

				deleteNumber = deleteNumber ?? target.length;

				if (deleteNumber <= 0 && newEls.length === 0) {
					return null;
				}

				const
					newLength = targetLength + newEls.length - deleteNumber;

				const
					res = <WrapResult>[];

				const rightBorder = start + deleteNumber >= targetLength ?
					target.length - 1 :
					start + deleteNumber;

				if (newLength > targetLength) {
					const
						diff = newLength - targetLength;

					for (let i = targetLength - 1; i >= rightBorder; i--) {
						res.push([target[i], undefined, [...opts.path, i + diff]]);
					}

				} else {
					for (let i = rightBorder; i < targetLength; i++) {
						const newI = i - deleteNumber + 1;
						res.push([target[i], target[newI], [...opts.path, newI]]);
					}
				}

				for (let i = start, j = 0; j < newEls.length; i++, j++) {
					res.push([newEls[j], target[i], [...opts.path, i]]);
				}

				if (newLength < targetLength) {
					res.push([newLength, targetLength, [...opts.path, 'length']]);
				}

				return res;
			}
		}
	}
});
