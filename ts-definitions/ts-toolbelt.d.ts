/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Set of expanded ts helpers
 */
declare namespace TB {
	type Cast<X, Y> = X extends Y ? X : Y;

	type Type<A extends any, ID extends string> = A & {
		[K in 'symbol']: ID;
	};

	type Length<T extends any[]> = T['length'];

	type Head<T extends any[]> = T extends [infer H, ...any[]] ?
		H : never;

	type Tail<T extends any[]> = T extends [any, ...infer TT] ?
		TT : [];

	type HasTail<T extends any[]> = Length<T> extends 0 | 1 ?
		false : true;

	type Last<T extends any[]> = HasTail<T> extends true ?
		Last<Tail<T>> : Head<T>;

	type Prepend<E, T extends any[]> = [E, ...T];

	type Drop<N extends number, T extends any[], I extends any[] = []> = Length<I> extends N ?
		T : Drop<N, Tail<T>, Prepend<any, I>>;

	type Pos<I extends any[]> = Length<I>;

	type Next<I extends any[]> = Prepend<any, I>;
	type Prev<I extends any[]> = Tail<I>;

	type Reverse<T extends any[], R extends any[] = [], I extends any[] = []> = Pos<I> extends Length<T> ?
		R : Reverse<T, Prepend<T[Pos<I>], R>, Next<I>>;

	type Concat<T1 extends any[], T2 extends any[]> = Reverse<Cast<Reverse<T1>, any[]>, T2>;

	type Append<E, T extends any[]> = Concat<T, [E]>;

	type __ = Type<{}, 'x'>;

	type GapOf<T1 extends any[], T2 extends any[], TN extends any[], I extends any[]> =
		T1[Pos<I>] extends __ ? Append<T2[Pos<I>], TN> : TN;

	type GapsOf<T1 extends any[], T2 extends any[], TN extends any[] = [], I extends any[] = []> =
		Pos<I> extends Length<T1> ?
			Concat<TN, Cast<Drop<Pos<I>, T2>, any[]>> :
			GapsOf<T1, T2, Cast<GapOf<T1, T2, TN, I>, any[]>, Next<I>>;

	type PartialGaps<T extends any[]> = {
		[K in keyof T]?: T[K] | __;
	};

	type CleanedGaps<T extends any[]> = {
		[K in keyof T]: NonNullable<T[K]>;
	};

	type Gaps<T extends any[]> = CleanedGaps<PartialGaps<T>> extends [...infer A] ?
		A : never;

	type Curry<F extends ((...args: any) => any)> =
		<T extends any[]>(...args: Cast<T, Gaps<Parameters<F>>>) =>
			GapsOf<T, Parameters<F>> extends [any, ...any[]] ?
				Curry<(...args: Cast<GapsOf<T, Parameters<F>>, any[]>) => ReturnType<F>> :
				ReturnType<F>;
}
