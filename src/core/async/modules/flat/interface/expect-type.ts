/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

type Fn<T> = (<G>() => G extends T ? 1 : 0);

type AreEquals<A, B> = Fn<A> extends Fn<B> ? unknown : never;

/**
 * Util for checking two types equality
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function expectType<A, B extends A & AreEquals<A, B>>(): void {}
