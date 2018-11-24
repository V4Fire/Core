/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Creates a generator for symbols
 * @param fields - array of fields
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
