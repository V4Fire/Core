/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns a factory for flexible creation of unique symbols by the first touch
 * @param fields - list of predefined fields (it can be useful for shimming the Proxy API)
 */
export default function generator(fields?: string[]): StrictDictionary<symbol> {
	const
		obj = <StrictDictionary<symbol>>Object.createDict<symbol>();

	if (typeof Proxy !== 'function') {
		if (fields) {
			for (let i = 0; i < fields.length; i++) {
				const el = fields[i];
				obj[el] = Symbol(el);
			}
		}

		return obj;
	}

	return new Proxy(obj, {
		get(target: typeof obj, prop: string): symbol {
			const
				val = target[prop];

			if (val) {
				return val;
			}

			return target[prop] = typeof prop === 'symbol' ? prop : Symbol(prop);
		}
	});
}
