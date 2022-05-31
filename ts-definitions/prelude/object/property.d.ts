/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

interface ObjectConstructor {
	/**
	 * Returns a value from the passed object by the specified path.
	 * Returns undefined if the specified path doesn't exist in the object.
	 * The method can access properties through promises.
	 *
	 * @param obj
	 * @param path
	 * @param [opts] - additional options
	 */
	get<T = unknown>(obj: any, path: ObjectPropertyPath, opts?: ObjectGetOptions): CanUndef<T>;

	/**
	 * Returns a function that returns a value from the passed object, which the function takes, by the specified path.
	 * The function returns undefined if the specified path doesn't exist in the object.
	 *
	 * @param path
	 * @param [opts] - additional options
	 */
	get<T = unknown>(path: ObjectPropertyPath, opts?: ObjectGetOptions): (obj: any) => CanUndef<T>;

	/**
	 * Returns a function that returns a value from the specified object by a path that the function takes.
	 * The function returns undefined if the specified path doesn't exist in the object.
	 *
	 * @param obj
	 * @param [opts] - additional options
	 */
	get<T = unknown>(obj: any, opts?: ObjectGetOptions): (path: ObjectPropertyPath) => CanUndef<T>;

	/**
	 * Returns true if an object has a property by the specified path
	 *
	 * @param obj
	 * @param path
	 * @param [opts] - additional options
	 */
	has(obj: any, path: ObjectPropertyPath, opts?: ObjectGetOptions): boolean;

	/**
	 * Returns a function that returns true if an object, which the function takes, has a value by the specified path
	 *
	 * @param path
	 * @param [opts] - additional options
	 */
	has(path: ObjectPropertyPath, opts?: ObjectGetOptions): (obj: any) => boolean;

	/**
	 * Returns a function that returns true if the specified object has a value by a path that the function takes
	 *
	 * @param obj
	 * @param [opts] - additional options
	 */
	has(obj: any, opts?: ObjectGetOptions): (path: ObjectPropertyPath) => boolean;

	/**
	 * Returns a function that returns true if the passed object, which the function takes,
	 * has own property by the specified key
	 *
	 * @param key
	 */
	hasOwnProperty(key: PropertyKey): (obj: any) => boolean;

	/**
	 * Returns a function that returns true if the specified object has own property by a key that the function takes
	 * @param obj
	 */
	hasOwnProperty(obj: any): (key: PropertyKey) => boolean;

	/**
	 * Returns true if the passed object has an own property by the specified key
	 *
	 * @param obj
	 * @param key
	 */
	hasOwnProperty(obj: any, key: PropertyKey): boolean;

	/**
	 * Sets a value to the passed object by the specified path.
	 * The final function returns a value that was added.
	 *
	 * @param obj
	 * @param path
	 * @param value
	 * @param [opts] - additional options
	 */
	set<T>(obj: any, path: ObjectPropertyPath, value: T, opts?: ObjectSetOptions): CanUndef<T>;

	/**
	 * Returns a function that sets a value to an object, which the function takes, by the specified path.
	 * The final function returns a link to the object.
	 *
	 * @param path
	 * @param [opts] - additional options
	 * @param [value]
	 */
	set(path: ObjectPropertyPath, opts?: ObjectSetOptions, value?: any): <T>(obj: T, value?: any) => CanUndef<T>;

	/**
	 * Returns a function that sets a value to the specified object by a path that the function takes.
	 * The final function returns a link to the object.
	 *
	 * @param obj
	 * @param [opts] - additional options
	 * @param [value]
	 */
	set<T>(obj: T, opts?: ObjectSetOptions, value?: any): (path: ObjectPropertyPath, value?: any) => CanUndef<T>;

	/**
	 * Deletes a value from an object by the specified path
	 *
	 * @param obj
	 * @param path
	 * @param [opts] - additional options
	 */
	delete(obj: any, path: ObjectPropertyPath, opts?: ObjectGetOptions): boolean;

	/**
	 * Returns a function that deletes a value from an object, which the function takes, by the specified path
	 *
	 * @param path
	 * @param [opts] - additional options
	 */
	delete(path: ObjectPropertyPath, opts?: ObjectGetOptions): (obj: any) => boolean;

	/**
	 * Returns a function that deletes a value from the specified object by a path that the function takes
	 *
	 * @param obj
	 * @param [opts] - additional options
	 */
	delete(obj: any, opts?: ObjectGetOptions): (path: ObjectPropertyPath) => boolean;
}

type ObjectPropertyPath =
	string |
	any[];

interface ObjectPropertyFilter<K = string, V = unknown> {
	(key: K, el: V): AnyToBoolean;
}

interface ObjectGetOptions {
	/**
	 * Character to declare the path
	 *
	 * @example
	 * ```js
	 * Object.get({a: {b: 1}}, 'a:b', {separator: ':'})
	 * ```
	 */
	separator?: string;
}

interface ObjectSetOptions extends ObjectGetOptions {
	/**
	 * If true, then a new value will be concatenated with the old
	 *
	 * @example
	 * ```js
	 * const obj = {a: {b: 1}};
	 * Object.set(obj, 'a.b', 2, {concat: true})
	 * console.log(obj); // [1, 2]
	 * ```
	 */
	concat?: boolean;

	/**
	 * Function to set a value
	 *
	 * @param obj
	 * @param key
	 * @param value
	 */
	setter?(obj: unknown, key: unknown, value: unknown);
}
