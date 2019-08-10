
/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type Instance = Array<unknown> |
						WeakMap<object, unknown> |
						WeakSet<object> |
						Map<unknown, unknown> |
						Set<unknown>;

export interface CallbackStructureParams {
	/**
	 * Should provide additional parameters, such as which method called the callback
	 */
	info?: boolean;

	/**
	 * Don't call a callback to the list of specified methods
	 */
	ignore?: string[];

	/**
	 * If true, then a callback will be called using setImmediate
	 */
	deffer?: boolean;

	/**
	 * If true, then a proxy will be used to track changes
	 *   *) callback will be called using setImmediate (if deffer is not set to false)
	 *   *) ignore parameters will not be taken into account
	 *   *) tracking through a proxy makes it possible to track changes in arrays through an index
	 */
	proxy?: boolean;
}

/**
 * Creates a specified data structure which will call a specified callback on every mutation
 *
 * @param instance
 * @param cb
 * @param [params]
 */
export function wrapStructure<T extends Instance>(
	instance: T,
	cb: Function,
	params: CallbackStructureParams = {}
): T {
	const {
		ignore,
		info
	} = params;

	let immediateId;

	const shimTable = {
		weakMap: [Object.isWeakMap, ['set', 'delete']],
		weakSet: [Object.isWeakSet, ['add', 'delete']],
		array: [Object.isArray, []],
		map: [Object.isMap, ['set', 'delete', 'clear']],
		set: [Object.isSet, ['add', 'delete', 'clear']]
	};

	const mapProxyHandler = {
		get: (target, prop, receiver) => {
			let res = Reflect.get(target, prop, receiver);

			if (Object.isFunction(res)) {
				res = res.bind(target);
			}

			return res;
		}
	}

	const proxyHandler = {
		array: (arr: Array<unknown>) => new Proxy(arr, {
			get: (target, property) => target[property],
			set: (target, property, value) => {
				target[property] = value;

				if (!immediateId) {
					immediateId = setImmediate(() => {
						cb('set', instance);
						immediateId = undefined;
					});
				}

				return true;
			}
		})
	};

	function caller<T>(ctx: unknown, method: Function, name: string, ...args: unknown[]): T {
		const
			a = info ? args.concat(name, instance) : [],
			res = method.call(ctx, ...args);

		cb(...a);
		return res;
	}

	for (let i = 0, keys = Object.keys(shimTable); i < keys.length; i++) {
		const
			k = keys[i],
			is = shimTable[k][0],
			methods = shimTable[k][1];

		if (!is(instance)) {
			continue;
		}

		for (let j = 0; j < methods.length; j++) {
			const
				method = methods[j],
				fn = instance[method];

			if (ignore && ignore.includes(method)) {
				continue;
			}

			instance[method] = function (...args: unknown[]): unknown {
				return caller(this, fn, method, ...args);
			};
		}

		if (wrapProxy[k]) {
			instance = wrapProxy[k](instance);
		}

		break;
	}

	return instance;
}
