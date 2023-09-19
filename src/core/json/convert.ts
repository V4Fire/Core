/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	typeRgxp = /^\[object (.*)]$/,
	isCustomSerialized = /^__DATA__:/;

export function expandedStringify(_: string, value: unknown): unknown {
	const
		type = typeRgxp.exec({}.toString.call(value))![1];

	switch (type) {
		case 'Date':
			return customSerialize((<Date>value).valueOf());

		case 'BigInt':
		case 'Function':
			return customSerialize((<{toString(): string}>value).toString());

		case 'Map':
		case 'Set':
			return customSerialize([...(<Iterable<any>>value)]);
	}

	return value;

	function customSerialize(value: unknown) {
		return {
			'__DATA__': `__DATA__:${type}`,
			[`__DATA__:${type}`]: value
		};
	}
}

export function expandedParse(key: string, value: unknown): unknown {
	if (value != null && typeof value === 'object' && '__DATA__' in value) {
		return value[value['__DATA__']];
	}

	if (isCustomSerialized.test(key)) {
		switch (key.split(':')[1]) {
			case 'Date': return new Date(<number>value);
			case 'BigInt': return BigInt(<string>value);
			case 'Function': return Function(`return ${value}`)();
			case 'Map': return new Map(<Iterable<any>>value);
			case 'Set': return new Set(<Iterable<any>>value);
		}
	}

	return value;
}
