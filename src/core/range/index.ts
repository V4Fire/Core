/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/range/README.md]]
 */

import type { RangeValue, RangeType } from 'core/range/interface';

export * from 'core/range/interface';

/**
 * A class to create a range with the specified type.
 * The class supports ranges of numbers, strings, and dates.
 *
 * @typeParam T - range type value
 */
export default class Range<T extends RangeValue> {
	/**
	 * Bottom bound
	 */
	start: number;

	/**
	 * Top bound
	 */
	end: number;

	/**
	 * Range type
	 */
	type: RangeType;

	/**
	 * True if the range is reversed
	 */
	isReversed: boolean = false;

	/**
	 * @param [start] - start position:
	 *   * if it wrapped by an array, the bound won't be included to the range;
	 *   * If passed as `null`, it means `-Infinite`;
	 *
	 * @param [end] - end position:
	 *   * if it wrapped by an array, the bound won't be included to the range;
	 *   * If passed as `null`, it means `Infinite`;
	 *
	 * @example
	 * ```js
	 * // [0, 1, 2, 3]
	 * console.log(new Range(0, 3).toArray());
	 *
	 * // [0, 1, 2]
	 * console.log(new Range(0, [3]).toArray());
	 *
	 * // ['b', 'c']
	 * console.log(new Range(['a'], ['d']).toArray());
	 *
	 * // []
	 * console.log(new Range('a', ['a']).toArray());
	 *
	 * // 'Wed Oct 18 1989 00:00:00..'
	 * console.log(new Range(new Date(1989, 9, 18)).string());
	 *
	 * // '..Wed Oct 18 1989 00:00:00'
	 * console.log(new Range(null, new Date(1989, 9, 18)).string());
	 * ```
	 */
	constructor(
		start: T[] | Nullable<T> | number = -Infinity,
		end: T[] | Nullable<T> | number = Infinity
	) {
		const
			unwrap = (v) => Object.isArray(v) ? v[0] : v;

		const
			unwrappedStart = unwrap(start),
			unwrappedEnd = unwrap(end);

		let
			type;

		if (Object.isArray(start)) {
			const
				r = new Range(unwrappedStart);

			if (unwrappedStart !== unwrappedEnd) {
				start = r.toType(r.start + (unwrappedStart > unwrappedEnd ? -1 : 1));

			} else {
				start = NaN;
				type = r.type;
			}
		}

		if (Object.isArray(end)) {
			const
				r = new Range(unwrappedEnd);

			if (unwrappedStart !== unwrappedEnd) {
				end = r.toType(r.start + (unwrappedStart > unwrappedEnd ? 1 : -1));

			} else {
				end = NaN;
				type ??= r.type;
			}
		}

		if (Object.isString(start) || Object.isString(end)) {
			this.type = 'string';

			if (Object.isString(start)) {
				this.start = codePointAt(start);

			} else if (Object.isNumber(start)) {
				if (isFinite(start)) {
					this.start = codePointAt(String.fromCodePoint(start));

				} else {
					this.start = start;
				}

			} else if (start == null) {
				this.start = -Infinity;

			} else {
				this.start = NaN;
			}

			if (Object.isString(end)) {
				this.end = codePointAt(end);

			} else if (Object.isNumber(end)) {
				if (isFinite(end)) {
					this.end = codePointAt(String.fromCodePoint(end));

				} else {
					this.end = end;
				}

			} else if (end == null) {
				this.end = Infinity;

			} else {
				this.end = NaN;
			}

		} else {
			this.type = type ?? (Object.isDate(start) || Object.isDate(end) ? 'date' : 'number');
			this.start = start == null ? -Infinity : Number(start);
			this.end = Number(end);
		}

		if (this.start > this.end) {
			[this.start, this.end] = [this.end, this.start];
			this.isReversed = true;
		}
	}

	/**
	 * Returns an iterator from the range
	 */
	[Symbol.iterator](): IterableIterator<T> {
		return this.values();
	}

	/**
	 * Returns true if the range is valid
	 *
	 * @example
	 * ```js
	 * console.log(new Range('a', {}).isValid() === false);
	 *
	 * console.log(new Range(new Date('boom!')).isValid() === false);
	 *
	 * // The empty range is not valid
	 * console.log(new Range([0], [0]).isValid() === false);
	 * ```
	 */
	isValid(): boolean {
		return !Number.isNaN(this.start) && !Number.isNaN(this.end);
	}

	/**
	 * Returns true if the specified element is contained inside the range
	 * (the element can be a simple value or another range)
	 *
	 * @param el
	 * @example
	 * ```js
	 * // true
	 * console.log(new Range(0, 10).contains(4));
	 *
	 * // false
	 * console.log(new Range(0, [10]).contains(10));
	 *
	 * // false
	 * console.log(new Range(0, 10).contains(12));
	 *
	 * // false
	 * console.log(new Range(0, 10).contains('a'));
	 *
	 * // true
	 * console.log(new Range(0, 10).contains(Range(3, 6)));
	 *
	 * // false
	 * console.log(new Range(0, 10).contains(Range(3, 16)));
	 *
	 * // false
	 * console.log(new Range(0, 10).contains(Range('a', 'b')));
	 * ```
	 */
	contains(el: unknown): boolean {
		if (el instanceof Range) {
			return this.start <= el.start && this.end >= el.end;
		}

		const val = Object.isString(el) ? codePointAt(el) : Number(el);
		return this.start <= val && val <= this.end;
	}

	/**
	 * Returns a new range with the latest starting point as its start, and the earliest ending point as its end.
	 * If the two ranges do not intersect, this will effectively produce an empty range.
	 *
	 * The method preserves element ordering of the first range.
	 * The intersection of ranges with different types will always produce an empty range.
	 *
	 * @param range
	 * @example
	 * ```js
	 * // 8..10
	 * console.log(new Range(0, 10).intersect(new Range([7], 14)).toString());
	 *
	 * // 10..7
	 * console.log(new Range(10, 0).intersect(new Range(7, 14)).toString());
	 *
	 * // 7..10
	 * console.log(new Range(0, 10).intersect(new Range(7)).toString());
	 *
	 * // 7..
	 * console.log(new Range(0).intersect(new Range(7)).toString());
	 *
	 * // ''
	 * console.log(new Range(0, 10).intersect(new Range(11, 14)).toString());
	 *
	 * // ''
	 * console.log(new Range(0, 10).intersect(new Range('a', 'z')).toString());
	 * ```
	 */
	intersect(range: Range<T extends string ? string : T>): Range<T> {
		const
			start = <T>Math.max(this.start, range.start),
			end = <T>Math.min(this.end, range.end);

		if (this.type !== range.type) {
			return new Range(<T>0, [<T>0]);
		}

		const newRange = start <= end ?
			new Range(start, end) :
			new Range(<T>0, [<T>0]);

		newRange.type = this.type;
		newRange.isReversed = this.isReversed;

		return newRange;
	}

	/**
	 * Returns a new range with the earliest starting point as its start, and the latest ending point as its end.
	 * If the two ranges do not intersect, this will effectively remove the "gap" between them.
	 *
	 * The method preserves element ordering of the first range.
	 * The union of ranges with different types will always produce an empty range.
	 *
	 * @param range
	 * @example
	 * ```js
	 * // 0..13
	 * console.log(new Range(0, 10).union(new Range(7, [14])).toString());
	 *
	 * // 14..0
	 * console.log(new Range(10, 0).union(new Range(7, 14)).toString());
	 *
	 * // 0..
	 * console.log(new Range(0, 10).union(new Range(7)).toString());
	 *
	 * // ..
	 * console.log(new Range().union(new Range(7)).toString());
	 *
	 * // ''
	 * console.log(new Range(0, 10).union(new Range('a', 'z')).toString());
	 * ```
	 */
	union(range: Range<T extends string ? string : T>): Range<T> {
		if (this.type !== range.type) {
			return new Range(<T>0, [<T>0]);
		}

		const newRange = new Range<T>(
			<T>Math.min(this.start, range.start),
			<T>Math.max(this.end, range.end)
		);

		newRange.type = this.type;
		newRange.isReversed = this.isReversed;

		return newRange;
	}

	/**
	 * Clones the range and returns a new
	 */
	clone(): Range<T> {
		const
			range = new Range(<T>this.start, <T>this.end);

		range.type = this.type;
		range.isReversed = this.isReversed;

		return range;
	}

	/**
	 * Clones the range with reversing of element ordering and returns a new
	 *
	 * @example
	 * ```js
	 * // [3, 2, 1, 0]
	 * console.log(new Range(0, 3).reverse().toArray());
	 * ```
	 */
	reverse(): Range<T> {
		const range = new Range(<T>this.end, <T>this.start);
		range.type = this.type;
		return range;
	}

	/**
	 * Clamps an element to be within the range if it falls outside.
	 * If the range is invalid or empty, the method always returns `null`.
	 *
	 * @param el
	 * @example
	 * ```js
	 * // 3
	 * console.log(new Range(0, 10).clamp(3));
	 *
	 * // 'd'
	 * console.log(new Range('a', 'd').clamp('z'));
	 *
	 * // null
	 * console.log(new Range(0, [0]).clamp(10));
	 * ```
	 */
	clamp(el: unknown): T | null {
		const
			val = Object.isString(el) ? codePointAt(el) : Number(el);

		if (!this.isValid()) {
			return null;
		}

		if (this.end < val) {
			return this.toType(this.end);
		}

		if (this.start > val) {
			return this.toType(this.start);
		}

		return this.toType(val);
	}

	/**
	 * Returns a span of the range.
	 * The span includes both the start and the end.
	 *
	 * If the range is a date range, the value is in milliseconds.
	 * If the range is invalid or empty, the method always returns `0`.
	 *
	 * @example
	 * ```js
	 * // 4
	 * console.log(new Range(7, 10).span());
	 *
	 * // 0
	 * console.log(new Range(0, [0]).span());
	 * ```
	 */
	span(): number {
		if (!this.isValid()) {
			return 0;
		}

		if (!isFinite(this.start) || !isFinite(this.end)) {
			return Infinity;
		}

		return this.end - this.start + 1;
	}

	/**
	 * Returns an iterator from the range
	 *
	 * @param [step] - step to iterate elements (for date ranges, it means milliseconds to shift)
	 * @example
	 * ```js
	 * for (const el of new Range(0, 3).values()) {
	 *   // 0 1 2 3
	 *   console.log(el);
	 * }
	 *
	 * for (const el of new Range(0, 3).values(2)) {
	 *   // 0 2
	 *   console.log(el);
	 * }
	 * ```
	 */
	values(step?: number): IterableIterator<T> {
		const
			that = this,
			iter = createIter();

		return {
			[Symbol.iterator]() {
				return this;
			},

			next: iter.next.bind(iter)
		};

		function* createIter() {
			if (!that.isValid()) {
				return;
			}

			if (step == null || step === 0) {
				if (that.type === 'date') {
					if (isFinite(that.start) && isFinite(that.end)) {
						step = (that.end - that.start) * 0.01;

					} else {
						step = (30).days();
					}

				} else {
					step = 1;
				}
			}

			if (!Number.isNatural(step)) {
				throw new TypeError('Step value can be only a natural number');
			}

			let
				start,
				end;

			const
				isStringRange = that.type === 'string';

			if (isFinite(that.start)) {
				start = that.start;

			} else if (isStringRange) {
				start = 0;

			} else {
				start = Number.MIN_SAFE_INTEGER;
			}

			if (isFinite(that.end)) {
				end = that.end;

			} else {
				end = Number.MAX_SAFE_INTEGER;
			}

			if (that.isReversed) {
				for (let i = end; i >= start; i -= step) {
					try {
						yield that.toType(i);

					} catch {
						break;
					}
				}

			} else {
				for (let i = start; i <= end; i += step) {
					try {
						yield that.toType(i);

					} catch {
						break;
					}
				}
			}
		}
	}

	/**
	 * Returns an iterator from the range that produces iteration indices
	 *
	 * @param [step] - step to iterate elements (for date ranges, it means milliseconds to shift)
	 * @example
	 * ```js
	 * for (const el of new Range(3, 1).indices()) {
	 *   // 0 1 2
	 *   console.log(el);
	 * }
	 *
	 * for (const el of new Range(0, 3).indices(2)) {
	 *   // 0 1
	 *   console.log(el);
	 * }
	 * ```
	 */
	indices(step?: number): IterableIterator<number> {
		const
			that = this,
			iter = createIter();

		return {
			[Symbol.iterator]() {
				return this;
			},

			next: iter.next.bind(iter)
		};

		function* createIter() {
			const
				iter = that.values(step);

			for (let el = iter.next(), i = 0; !el.done; el = iter.next(), i++) {
				yield i;
			}
		}
	}

	/**
	 * Returns an iterator from the range that produces pairs of iteration indices and values
	 *
	 * @param [step] - step to iterate elements (for date ranges, it means milliseconds to shift)
	 * @example
	 * ```js
	 * for (const el of new Range(3, 1).entries()) {
	 *   // [0, 3] [1, 2] [2 3]
	 *   console.log(el);
	 * }
	 *
	 * for (const el of new Range(0, 3).entries(2)) {
	 *   // [0, 0] [1, 2]
	 *   console.log(el);
	 * }
	 * ```
	 */
	entries(step?: number): IterableIterator<[number, T]> {
		const
			that = this,
			iter = createIter();

		return {
			[Symbol.iterator]() {
				return this;
			},

			next: iter.next.bind(iter)
		};

		function* createIter() {
			const
				iter = that.values(step);

			for (let el = iter.next(), i = 0; !el.done; el = iter.next(), i++) {
				yield [i, el.value];
			}
		}
	}

	/**
	 * Creates an array from the range and returns it.
	 * Mind, you can't transform infinite ranges to arrays, but you free to use iterators.
	 *
	 * @param [step] - step to iterate elements (for date ranges, it means milliseconds to shift)
	 * @example
	 * ```js
	 * // [0, 3, 6, 9]
	 * console.log(new Range(0, 10).toArray(3));
	 *
	 * // ['a', 'b']
	 * console.log(new Range('a', ['c']).toArray());
	 *
	 * // []
	 * console.log(new Range(0, [0]).toArray());
	 * ```
	 */
	toArray(step?: number): T[] {
		if (this.isValid() && !isFinite(this.span())) {
			throw new RangeError("Can't create an array of the infinitive range. Use an iterator instead.");
		}

		return [...this.values(step)];
	}

	/**
	 * Creates a string from the range and returns it.
	 * If the range invalid or empty, the method always returns an empty string.
	 *
	 * @example
	 * ```js
	 * // 0..10
	 * console.log(new Range(0, 10).toString());
	 *
	 * // 0..9
	 * console.log(new Range(0, [10]).toString());
	 *
	 * // 0..
	 * console.log(new Range(0).toString());
	 *
	 * // ..z
	 * console.log(new Range(null, 'z').toString());
	 *
	 * // ''
	 * console.log(new Range(0, [0]).toString());
	 * ```
	 */
	toString(): string {
		if (!this.isValid()) {
			return '';
		}

		const
			res = <Array<T | string>>[];

		if (isFinite(this.start)) {
			res.push(this.toType(this.start));

		} else {
			res.push('');
		}

		if (isFinite(this.end)) {
			res.push(this.toType(this.end));

		} else {
			res.push('');
		}

		if (this.isReversed) {
			res.reverse();
		}

		return res.join('..');
	}

	/**
	 * Converts a value to the real range type
	 *
	 * @param value
	 * @example
	 * ```js
	 * // j
	 * console.log(new Range('a', 'z).toType(106));
	 * ```
	 */
	toType(value: number): T {
		switch (this.type) {
			case 'string':
				return <T>String.fromCodePoint(value);

			case 'date':
				return <T>new Date(value);

			default:
				return <T>value;
		}
	}
}

function codePointAt(str: string, pos: number = 0): number {
	const v = str.codePointAt(pos);
	return v == null || Number.isNaN(v) ? NaN : v;
}
