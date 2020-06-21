/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

type IntersectProps<L, R> = {[K in keyof L & keyof R]: undefined extends R[K] ? NonNullable<L[K]> : R[K]};

export type Extended<L, R> = Omit<L, keyof R> & Omit<R, keyof L> & IntersectProps<L, R>;
