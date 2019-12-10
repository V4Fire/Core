/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import extend from 'core/prelude/extend';

//#if runtime has prelude/object/getPrototypeChain

const
	protoChains = new WeakMap<Function, object[]>();

/**
 * Returns a prototype chain from the specified constructor
 * @param constructor
 */
extend(Object, 'getPrototypeChain', (constructor: Function) => {
	const
		val = protoChains.get(constructor);

	if (val) {
		return val.slice();
	}

	const
		chain: object[] = [];

	let
		proto = constructor.prototype;

	while (proto?.constructor !== Object) {
		chain.push(proto);
		proto = Object.getPrototypeOf(proto);
	}

	protoChains.set(constructor, chain.reverse());
	return chain.slice();
});

//#endif
