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

import { RangeValue, RangeType } from 'core/range/interface';
export * from 'core/range/interface';

/**
 * Class for working with some range structures
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
	reverse: boolean = false;

	/**
	 * @param start - start position
	 * @param end - end position
	 */
	constructor(start: T, end: T) {
		if (Object.isString(start)) {
			this.type = 'string';
			this.start = charCodeAt(start, 0);
			this.end = Object.isString(end) ? charCodeAt(end, end.length - 1) : Infinity;

		} else {
			this.type = Object.isDate(start) ? 'date' : 'number';
			this.start = Number(start);
			this.end = end !== undefined ? Number(end) : Infinity;
		}

		if (this.start > this.end) {
			[this.start, this.end] = [this.end, this.start];
			this.reverse = true;
		}
	}

	/**
	 * Returns true if the range is valid
	 */
	isValid(): boolean {
		return !isNaN(this.start);
	}

	/**
	 * Returns true if an element is contained inside the range
	 * (the element can be a simple value or another range)
	 *
	 * @param el
	 */
	contains(el: unknown): boolean {
		if (el instanceof Range) {
			return this.intersect(el).isValid();
		}

		const val = Object.isString(el) ? charCodeAt(el, 0) : Number(el);
		return this.start <= val && val <= this.end;
	}

	/**
	 * Returns a new range with the latest starting point as its start, and the earliest ending point as its end.
	 * If the two ranges do not intersect this will effectively produce an invalid range.
	 *
	 * @param range
	 */
	intersect(range: Range<T extends string ? string : T>): Range<T> {
		const
			start = <T>Math.max(this.start, range.start),
			end = <T>Math.min(this.end, range.end),
			newRange = start < end ? new Range(start, end) : new Range(<T>NaN, <T>NaN);

		newRange.type = this.type;
		return newRange;
	}

	/**
	 * Returns a new range with the earliest starting point as its start, and the latest ending point as its end.
	 * If the two ranges do not intersect this will effectively remove the "gap" between them.
	 *
	 * @param range
	 */
	union(range: Range<T extends string ? string : T>): Range<T> {
		const
			newRange = new Range<T>(<T>Math.min(this.start, range.start), <T>Math.max(this.end, range.end));

		newRange.type = this.type;
		return newRange;
	}

	//#if runtime has range/extended

	/**
	 * Clones the range
	 */
	clone(): Range<T> {
		const
			range = new Range(<T>this.start, <T>this.end);

		range.type = this.type;
		range.reverse = this.reverse;

		return range;
	}

	/**
	 * Clamps an element to be within the range if it falls outside
	 * @param el
	 */
	clamp(el: unknown): T {
		const
			val = Object.isString(el) ? charCodeAt(el, 0) : Number(el);

		if (!this.isValid()) {
			return this.toType(val);
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
	 * If the range is a date range, the value is in milliseconds.
	 * The span includes both the start and the end.
	 */
	span(): number {
		if (!this.isValid()) {
			return NaN;
		}

		if (!isFinite(this.end)) {
			return Infinity;
		}

		return this.end - this.start + 1;
	}

	//#endif

	/**
	 * Creates an array from the range and returns it
	 * @param [step] - iteration step value
	 */
	toArray(step?: number): T[] {
		if (!step) {
			step = this.type === 'date' ? (this.end - this.start) * 0.01 : 1;
		}

		const
			res = <any[]>[];

		if (!this.isValid()) {
			return res;
		}

		for (let i = this.start; i <= this.end; i += step) {
			res.push(this.toType(i));

			if (i >= Number.MAX_SAFE_INTEGER) {
				break;
			}
		}

		if (this.reverse) {
			res.reverse();
		}

		return res;
	}

	//#if runtime has range/extended

	/**
	 * Creates a string from the range and returns it
	 * @param [step] - iteration step value
	 */
	toString(step: number = 1): string {
		if (!this.isValid()) {
			return 'Invalid range';
		}

		const
			chunks = [this.start],
			res = <any[]>[];

		if (isFinite(this.end)) {
			chunks.push(this.end);
		}

		for (let i = 0; i < chunks.length; i += step) {
			res.push(this.toType(chunks[i]));
		}

		if (this.reverse) {
			res.reverse();
		}

		return res.length === 2 ? res.join('..') : `${res[0]}..`;
	}

	//#endif

	/**
	 * Converts a value to the real range type
	 * @param val
	 */
	protected toType(val: number): T {
		switch (this.type) {
			case 'string':
				return <T>fromCharCode(val);

			case 'date':
				return <T>new Date(val);

			default:
				return <T>val;
		}
	}
}

function charCodeAt(str: string, pos: number): number {
	const v = Object.isFunction(str.codePointAt) ? str.codePointAt(pos) : str.charCodeAt(pos);
	return isNaN(<any>v) ? NaN : <number>v;
}

function fromCharCode(code: number): string {
	return Object.isFunction(String.fromCodePoint) ? String.fromCodePoint(code) : String.fromCharCode(code);
}
