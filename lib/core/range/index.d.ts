/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/range/README.md]]
 * @packageDocumentation
 */
import type { RangeValue, RangeType } from '../../core/range/interface';
export * from '../../core/range/interface';
/**
 * A class to create a range with the specified type.
 * The class supports ranges of numbers, strings, and dates.
 *
 * @typeparam T - range type value
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
    isReversed: boolean;
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
    constructor(start?: T[] | Nullable<T> | number, end?: T[] | Nullable<T> | number);
    /**
     * Returns an iterator from the range
     */
    [Symbol.iterator](): IterableIterator<T>;
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
    isValid(): boolean;
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
    contains(el: unknown): boolean;
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
    intersect(range: Range<T extends string ? string : T>): Range<T>;
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
    union(range: Range<T extends string ? string : T>): Range<T>;
    /**
     * Clones the range and returns a new
     */
    clone(): Range<T>;
    /**
     * Clones the range with reversing of element ordering and returns a new
     *
     * @example
     * ```js
     * // [3, 2, 1, 0]
     * console.log(new Range(0, 3).reverse().toArray());
     * ```
     */
    reverse(): Range<T>;
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
    clamp(el: unknown): T | null;
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
    span(): number;
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
    values(step?: number): IterableIterator<T>;
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
    indices(step?: number): IterableIterator<number>;
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
    entries(step?: number): IterableIterator<[number, T]>;
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
    toArray(step?: number): T[];
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
    toString(): string;
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
    toType(value: number): T;
}
