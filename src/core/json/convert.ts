/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export function expandedStringify(_: string, value: unknown): unknown {
	const type = /^\[object (.*)]$/.exec({}.toString.call(value))![1];

	switch (type) {
		case 'Function':
			return {
				'__DATA__': `__DATA__:Function`,
				'__DATA__:Function': (<Function>value).toString()
			};

		case 'Map':
		case 'Set':
			return {
				'__DATA__': `__DATA__:${type}`,
				[`__DATA__:${type}`]: [...(<Set<any>>value)]
			};
	}

	return value;
}

export function expandedParse(key: string, value: unknown): unknown {
	if (value != null && typeof value === 'object' && '__DATA__' in value) {
		return value[value['__DATA__']];
	}

	if (/^__DATA__:/.test(key)) {
		switch (key.split(':')[1]) {
			case 'Function': return Function(`return ${value}`)();
			case 'Map': return new Map(<Iterable<any>>value);
			case 'Set': return new Set(<Iterable<any>>value);
		}
	}

	return value;
}
