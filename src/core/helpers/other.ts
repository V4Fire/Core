/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Returns true if the specified value is empty
 * @param value
 */
export function isEmptyValue(value: any): boolean {
	return !value;
}

/**
 * Set the descriptor parameters to configurable parameters
 * (and, if it is not a getter / setter, writable) to true
 *
 * @param descriptor
 */
export function configurableAndWritable(descriptor: PropertyDescriptor): PropertyDescriptor {
	descriptor.configurable = true;

	if (!descriptor.get && !descriptor.set) {
		descriptor.writable = true;
	}

	return descriptor;
}
