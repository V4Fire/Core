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
	Set<unknown> |
	Dictionary;

export interface Params {
	/**
	 * Should provide additional parameters, such as which method called the callback
	 */
	info?: boolean;

	/**
	 * Don't call a callback to the list of specified methods
	 *   *) works only without proxy
	 */
	ignore?: string[];

	/**
	 * If true, then a callback will be called using setImmediate
	 */
	deffer?: boolean;

	/**
	 * If true, then a proxy will be used to track changes
	 *   *) ignore parameters will not be taken into account
	 *   *) tracking through a proxy makes it possible to track changes in arrays through an index
	 */
	proxy?: boolean;
}

/**
 * Creates a specified data structure which will call a specified callback on every mutation
 *
 * @param instance
 *    *) If instance is a dictionary, then a proxy will be used to track changes
 *
 * @param cb
 * @param [params]
 *
 * @example
 * wrapStructure({}, () => console.log(123));
 * wrapStructure([1, 2], () => console.log(123));
 * wrapStructure(new Map(), () => console.log(123));
 *
 * const s = wrapStructure(new Set(), () => console.log(123));
 * s.add(1);
 * // 123
 */
export function wrapStructure<T extends Instance>(
	instance: T,
	cb: Function,
	params: Params = {}
): T {
	const {
		ignore,
		info,
		deffer,
		proxy: useProxy
	} = {deffer: true, ...params};

	let immediateId;

	const wrappedCb = (...args) => {
		if (!immediateId && deffer) {
			immediateId = setImmediate(() => {
				cb(...args);
				immediateId = undefined;
			});

		} else if (!deffer) {
			cb(...args);
		}
	};

	const mutableMethodsSetMap = {
		set: true,
		add: true,
		delete: true,
		clear: true
	};

	const proxySetMap = () => new Proxy(instance, {
		get: (target, prop, receiver) => {
			const
				val = Reflect.get(target, prop, receiver),
				res = Object.isFunction(val) ? val.bind(target) : val;

			if (mutableMethodsSetMap[prop]) {
				wrappedCb('set', instance);
			}

			return res;
		}
	});

	const proxy = () => new Proxy(instance, {
		set: (...args) => {
			const res = Reflect.set(...args);
			wrappedCb('set', instance);
			return res;
		},
		deleteProperty: (...args) => {
			const res = Reflect.deleteProperty(...args);
			wrappedCb('delete', instance);
			return res;
		}
	});

	const shimTable = {
		weakMap: {is: Object.isWeakMap, methods: ['set', 'delete'], proxy: proxySetMap},
		weakSet: {is: Object.isWeakSet, methods: ['add', 'delete'], proxy: proxySetMap},
		map: {is: Object.isMap, methods: ['set', 'delete', 'clear'], proxy: proxySetMap},
		set: {is: Object.isSet, methods: ['add', 'delete', 'clear'], proxy: proxySetMap},
		array: {is: Object.isArray, methods: ['push', 'pop', 'shift', 'unshift', 'sort', 'splice'], proxy},
		object: {is: Object.isObject, proxy}
	};

	function shim<T>(ctx: unknown, method: Function, name: string, ...args: unknown[]): T {
		const
			a = info ? args.concat(name, instance) : [],
			res = method.call(ctx, ...args);

		wrappedCb(...a);
		return res;
	}

	for (let i = 0, keys = Object.keys(shimTable); i < keys.length; i++) {
		const
			k = keys[i],
			{is, methods, proxy} = shimTable[k];

		if (!is(instance)) {
			continue;
		}

		if ((!methods && proxy) || useProxy) {
			instance = proxy();
			break;
		}

		for (let j = 0; j < methods.length; j++) {
			const
				method = methods[j],
				fn = instance[method];

			if (ignore && ignore.includes(method)) {
				continue;
			}

			instance[method] = function (...args: unknown[]): unknown {
				return shim(this, fn, method, ...args);
			};
		}

		break;
	}

	return instance;
}
