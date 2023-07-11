/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Creates an interface based on the specified type or interface but every property can be edited
 *
 * @example
 * ```typescript
 * const readonlyDict: Readonly<Dictionary> = {foo: 'bar'};
 *
 * // @ts-expect-error
 * readonlyDict['foo'] = 'baz';
 *
 * const dict: Writable<typeof readonlyDict> = {foo: 'bar'};
 *
 * // Ok
 * dict['foo'] = 'bar';
 * ```
 */
type Writable<T> = {
	-readonly [K in keyof T]: T[K];
};

/**
 * Overrides properties of the specified type or interface.
 * Don't use this helper if you simply extend one type from another, i.e. without overriding properties.
 *
 * @template T - original type
 * @template U - type with the overridden properties
 *
 * @example
 * ```typescript
 * type A = {
 *   x: number;
 *   y: number;
 * };
 *
 * // {x:number; y: string}
 * type B = Overwrite<A, {y: string}>;
 * ```
 */
type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

/**
 * Returns a new non-abstract class from the specified abstract class where methods can have the default implementation.
 * The default implementations are taken from the static methods that match by names with the class's methods.
 *
 * @example
 * ```typescript
 * abstract class iFoo {
 *   static bar(self: object): string {
 *     return self.bla.toString();
 *   }
 *
 *   bar(): string {
 *     return Object.throw();
 *   }
 *
 *   abstract bar(): number;
 * }
 *
 * // class { bar(): string; }
 * Trait<typeof bFoo>
 * ```
 */
type Trait<C extends Function, I extends C['prototype'] = C['prototype']> = {
	[K in Extract<keyof C, keyof I>]: I[K];
};

