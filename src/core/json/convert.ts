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
			__DATA__: `__DATA__:${type}`,
			[`__DATA__:${type}`]: value
		};
	}
}

export function expandedParse(key: string, value: unknown): unknown {
	if (value != null && typeof value === 'object' && '__DATA__' in value) {
		return value[value['__DATA__']];
	}

	if (isCustomSerialized.test(key)) {
		const unsafeValue = <any>value;

		switch (key.split(':')[1]) {
			case 'Date': return new Date(unsafeValue);
			case 'BigInt': return BigInt(unsafeValue);
			// eslint-disable-next-line no-new-func
			case 'Function': return Function(`return ${unsafeValue}`)();
			case 'Map': return new Map(unsafeValue);
			case 'Set': return new Set(unsafeValue);
		}
	}

	return value;
}
