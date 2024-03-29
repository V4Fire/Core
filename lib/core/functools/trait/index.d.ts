/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/functools/trait/README.md]]
 * @packageDocumentation
 */
/**
 * Derives the provided traits to a class.
 * The function is used to organize multiple implementing interfaces with the support of default methods.
 *
 * @decorator
 * @param traits
 *
 * @example
 * ```typescript
 * abstract class Interface1 {
 *   abstract bar(): string;
 *
 *   /**
 *    * The method that have the default implementation.
 *    * The implementation is placed as a static method.
 *    *\/
 *   bla(a: number): number {
 *     return Object.throw();
 *   };
 *
 *   /**
 *    * The default implementation for `Interface1.bla`.
 *    * As the first parameter, the method is taken a context.
 *    *
 *    * @see Interface1.bla
 *    *\/
 *   static bla: AddSelf<iFoo['bla'], Baz> = (self, a) => a + 1;
 * }
 *
 * abstract class Interface2 {
 *   abstract bar2(): string;
 *
 *   bla2(a: number): string {
 *     return Object.throw();
 *   };
 *
 *   /** @see Interface2.bla2 *\/
 *   static bla2: AddSelf<iFoo2['bla2'], Baz> = (self, a) => a.toFixed();
 * }
 *
 * interface Baz extends Trait<typeof iFoo>, Trait<typeof iFoo2> {
 *
 * }
 *
 * @derive(iFoo, iFoo2)
 * class Baz implements iFoo, iFoo2 {
 *   bar() {
 *     return '1';
 *   }
 *
 *   bar2() {
 *     return '1';
 *   }
 * }
 *
 * console.log(new Baz().bla2(2.9872));
 * ```
 */
export declare function derive(...traits: Function[]): (target: Function) => void;
