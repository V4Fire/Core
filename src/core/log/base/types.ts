/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

type ExcludeProps<S, T> = Pick<S, Exclude<keyof S, keyof T>>;
type DefinedOnly<T> = T extends undefined ? never : T;
type IntersectProps<L, R> = {[K in keyof L & keyof R]: undefined extends R[K] ? DefinedOnly<L[K]> : R[K]};
export type Merge<L, R> = ExcludeProps<L, R> & ExcludeProps<R, L> & IntersectProps<L, R>;
