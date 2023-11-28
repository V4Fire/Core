/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ObjectConstructor {
	/**
	 * Returns size/length of the specified object
	 *
	 * @param obj
	 *
	 * @example
	 * ```js
	 * // 1
	 * Object.size({a: 1});
	 *
	 * // 2
	 * Object.size([1, 2]);
	 *
	 * // 2
	 * Object.size(new Set([1, 2]));
	 *
	 * // 2
	 * Object.size((a, b) => a + b));
	 *
	 * // 1
	 * Object.size(1);
	 *
	 * // 0
	 * Object.size(NaN);
	 * Object.size(null);
	 * Object.size(undefined);
	 * ```
	 */
	size(obj: any): number;

	/**
	 * Returns true if size/length of the specified entity is 0.
	 * The algorithm for determining whether the entity is empty depends on the type of the entity.
	 *  - For Objects: The method counts the number of enumerable properties in the object. If the count is 0, the method considers the object as empty.
	 *  - For Arrays and Strings: The method uses the length property of the array or string. If the length is 0, the method considers the array or string as empty.
	 *  - For Maps and Sets: The method uses the size property of the map or set. If the size is 0, the method considers the map or set as empty.
	 *  - For Numbers: The method uses the value of the number. If the value is 0, the method considers the number as empty.
	 *
	 * @param obj
	 *
	 * @example
	 * ```js
	 * // true
	 * Object.isEmpty({});
	 *
	 * // false
	 * Object.isEmpty({a: 1});
	 *
	 * // true
	 * Object.isEmpty(new Set());
	 *
	 * // false
	 * Object.isEmpty(new Set([1, 2]));
	 *
	 * // false
	 * Object.isEmpty(1);
	 *
	 * // true
	 * Object.isEmpty(0);
	 * Object.isEmpty(NaN);
	 * Object.isEmpty(null);
	 * Object.isEmpty(undefined);
	 * ```
	 */
	isEmpty(obj: any): boolean;
}
