/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/* eslint-disable @typescript-eslint/unified-signatures */

interface ObjectConstructor {
	/**
	 * Returns a curried version of `Object.mixin` for one argument
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 */
	mixin(opts: ObjectMixinOptions | boolean): <B, O1>(base: B, obj1: O1) => B & O1;

	/**
	 * Returns a curried version of `Object.mixin` for one argument
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 */
	mixin(opts: ObjectMixinOptions | boolean): <R = unknown>(...objects: any[]) => R;

	/**
	 * Returns a curried version of `Object.mixin` for two arguments
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param target - target object
	 */
	mixin<B>(opts: ObjectMixinOptions | boolean, target: B): <O1>(obj1: O1) => B & O1;

	/**
	 * Returns a curried version of `Object.mixin` for two arguments
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param target - target object
	 */
	mixin(opts: ObjectMixinOptions | boolean, target: any): <R = unknown>(...objects: any[]) => R;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param target - target object
	 * @param obj1 - object for extending
	 */
	mixin<B, O1>(opts: ObjectMixinOptions | boolean, target: B, obj1: O1): B & O1;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param target - target object
	 * @param obj1 - object for extending
	 * @param obj2 - object for extending
	 */
	mixin<B, O1, O2>(opts: ObjectMixinOptions | boolean, target: B, obj1: O1, obj2: O2): B & O1 & O2;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param target - target object
	 * @param obj1 - object for extending
	 * @param obj2 - object for extending
	 * @param obj3 - object for extending
	 */
	mixin<B, O1, O2, O3>(opts: ObjectMixinOptions | boolean, target: B, obj1: O1, obj2: O2, obj3: O3): B & O1 & O2 & O3;

	/**
	 * Extends the specified object by another objects.
	 * If the base value is not an object, a new object will be created with a type similar to the first extension object.
	 *
	 * @param opts - if true, then properties will be copied recursively, or additional options to extend
	 * @param target - target object
	 * @param objects - objects for extending
	 */
	mixin<R = unknown>(opts: ObjectMixinOptions | boolean, target?: any, ...objects: any[]): R;
}

interface ObjectMixinOptions<V = unknown, K = unknown, D = unknown> {
	/**
	 * If true, then object properties are copied recursively.
	 * Also, this mode enables copying properties from a prototype.
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * // {a: {c: 2}}
	 * Object.mixin({deep: false}, {a: {b: 1}}, {a: {c: 2}});
	 *
	 * // {a: {b: 1, c: 2}}
	 * Object.mixin({deep: true}, {a: {b: 1}}, {a: {c: 2}});
	 *
	 * // {a: {c: 2}}
	 * Object.mixin({deep: true}, {}, {__proto__: {a: {c: 2}}});
	 * ```
	 */
	deep?: boolean;

	/**
	 * Strategy to resolve collisions of properties when merging:
	 *   1. `'all'` - all properties are merged in spite of possible collisions (by default)
	 *   2. `'new'` - properties with collisions aren't merged
	 *   3. `'exist'` - properties without collisions aren't merged
	 *
	 * @default `'all'`
	 * @example
	 * ```js
	 * // {a: 2, b: 3}
	 * Object.mixin({propsToCopy: 'all'}, {a: 1}, {a: 2, b: 3});
	 *
	 * // {a: 1, b: 3}
	 * Object.mixin({propsToCopy: 'new'}, {a: 1}, {a: 2, b: 3});
	 *
	 * // {a: 2}
	 * Object.mixin({propsToCopy: 'exist'}, {a: 1}, {a: 2, b: 3});
	 * ```
	 */
	propsToCopy?: 'new' | 'exist' | 'all';

	/**
	 * Function to filter values that shouldn't be copied
	 *
	 * @param el - element value
	 * @param key - element key
	 * @param data - element container
	 *
	 * @example
	 * ```js
	 * // {a: 1, b: 2}
	 * Object.mixin({deep: true}, {a: 1}, {b: 2});
	 *
	 * // {a: 1}
	 * Object.mixin({deep: true, filter: (el, key) => key !== 'b'}, {a: 1}, {b: 2});
	 * ```
	 */
	filter?(el: V, key: K, data: D): AnyToBoolean;

	/**
	 * Function to filter values that support deep extending
	 * (works only with the `deep` mode)
	 *
	 * @param el - element value
	 * @param key - element key
	 * @param data - element container
	 *
	 * @example
	 * ```js
	 * // {a: {a: 1, b: 2}}
	 * Object.mixin({deep: true}, {a: {a: 1}}, {a: {b: 2}});
	 *
	 * // {a: {b: 2}}
	 * Object.mixin({deep: true, extendFilter: (el) => !el.b}, {a: {a: 1}}, {a: {b: 2}});
	 * ```
	 */
	extendFilter?(el: unknown, key: K, data: V): AnyToBoolean;

	/**
	 * If true, all properties with undefined value aren't copied
	 *
	 * @default `true`
	 * @example
	 * ```js
	 * // {a: 1}
	 * Object.mixin({skipUndefs: true}, {a: 1}, {a: undefined});
	 *
	 * // {a: undefined}
	 * Object.mixin({skipUndefs: false}, {a: 1}, {a: undefined});
	 * ```
	 */
	skipUndefs?: boolean;

	/**
	 * If true, the function will merge all object properties, but not only enumerable.
	 * Non-enumerable properties from a prototype are ignored.
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * const obj = {a: 1};
	 *
	 * Object.defineProperty(obj, 'b', {value: 2});
	 *
	 * // {a: 1, b: 2}
	 * Object.mixin({withNonEnumerables: true}, {}, obj);
	 * ```
	 */
	withNonEnumerables?: boolean;

	/**
	 * Should or shouldn't copy property descriptors too.
	 * If passed `onlyAccessors`, the descriptor properties like `enumerable` or `configurable` are ignored.
	 *
	 * @default `false`
	 */
	withDescriptors?: boolean | 'onlyAccessors';

	/**
	 * If true, then merging preserve prototypes of properties
	 * (works only with the `deep` mode)
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * const proto = {
	 *   a: {
	 *     b: 2
	 *   },
	 *
	 *   c: 3
	 * };
	 *
	 * const obj = Object.create(proto);
	 * Object.mixin({deep: true, withProto: false}, obj, {c: 2, a: {d: 4}});
	 *
	 * // 2
	 * // 4
	 * // 2
	 * // true
	 * // true
	 * console.log(
	 *   obj.c,
	 *   obj.a.d,
	 *   obj.a.b,
	 *   obj.a.hasOwnProperty('d'),
	 *   obj.a.hasOwnProperty('b')
	 * );
	 *
	 * const obj2 = Object.create(proto);
	 * Object.mixin({deep: true, withProto: true}, obj2, {c: 2, a: {d: 4}});
	 *
	 * // 2
	 * // 4
	 * // 2
	 * // true
	 * // false
	 * console.log(
	 *   obj2.c,
	 *   obj2.a.d,
	 *   obj2.a.b,
	 *   obj2.a.hasOwnProperty('d'),
	 *   obj2.a.hasOwnProperty('b')
	 * );
	 * ```
	 */
	withProto?: boolean;

	/**
	 * If true, then to merge two arrays will be used a concatenation strategy (works only with the `deep` mode).
	 * Also, the parameter can be passed as a function to concatenate arrays.
	 *
	 * @default `false`
	 * @example
	 * ```js
	 * // {a: [2]}
	 * Object.mixin({deep: true, concatArrays: false}, {a: [1]}, {a: [2]});
	 *
	 * // {a: [1, 2]}
	 * Object.mixin({deep: true, concatArrays: true}, {a: [1]}, {a: [2]});
	 *
	 * // {a: [1, 1, 2]}
	 * Object.mixin({deep: true, concatArrays: true}, {a: [1]}, {a: [1, 2]});
	 *
	 * // {a: [1, 2]}
	 * Object.mixin({deep: true, concatArrays: (a, b) => a.union(b)}, {a: [1]}, {a: [1, 2]});
	 * ```
	 */
	concatArrays?: boolean | ((a: unknown[], b: unknown[], key: K) => unknown[]);

	/**
	 * @deprecated
	 * @see [[ObjectMixinOptions.concatArrays]]
	 */
	concatArray?: boolean;

	/**
	 * @deprecated
	 * @see [[ObjectMixinOptions.concatArrays]]
	 */
	concatFn?(a: unknown[], b: unknown[], key: K): unknown[];

	/**
	 * @deprecated
	 * @see [[ObjectMixinOptions.propsToCopy]]
	 */
	onlyNew?: boolean | -1;

	/**
	 * @deprecated
	 * @see [[ObjectMixinOptions.propsToCopy]]
	 */
	traits?: boolean | -1;

	/**
	 * @deprecated
	 * @see [[ObjectMixinOptions.skipUndefs]]
	 */
	withUndef?: boolean;

	/**
	 * @deprecated
	 * @see [[ObjectMixinOptions.withDescriptors]]
	 */
	withDescriptor?: boolean;

	/**
	 * @deprecated
	 * @see [[ObjectMixinOptions.withDescriptors]]
	 */
	withAccessors?: boolean;
}
