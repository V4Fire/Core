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

import type { RangeValue, RangeType } from 'core/range/interface';

export * from 'core/range/interface';

/**
 * Class to create a range with the specified type
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
	isReversed: boolean = false;

	/**
	 * @param [start] - start position: if it wrapped by an array, the bound won't be included to the range
	 * @param [end] - end position: if it wrapped by an array, the bound won't be included to the range
	 */
	constructor(
		start: T[] | Nullable<T> | number = -Infinity,
		end: CanArray<T> | number = Infinity
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
				type = type ?? r.type;
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

			} else {
				this.start = -Infinity;
			}

			if (Object.isString(end)) {
				this.end = codePointAt(end);

			} else if (Object.isNumber(end)) {
				if (isFinite(end)) {
					this.end = codePointAt(String.fromCodePoint(end));

				} else {
					this.end = end;
				}

			} else {
				this.end = Infinity;
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

	[Symbol.iterator](): IterableIterator<T> {
		return this.values();
	}

	/**
	 * Returns true if the range is valid
	 */
	isValid(): boolean {
		return !Number.isNaN(this.start) && !Number.isNaN(this.end);
	}

	/**
	 * Returns true if an element is contained inside the range
	 * (the element can be a simple value or another range)
	 *
	 * @param el
	 */
	contains(el: unknown): boolean {
		if (el instanceof Range) {
			return this.type === el.type && this.start <= el.start && this.end >= el.end;
		}

		const val = Object.isString(el) ? codePointAt(el) : Number(el);
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
	 * If the two ranges do not intersect this will effectively remove the "gap" between them.
	 *
	 * @param range
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
	 * Clones the range
	 */
	clone(): Range<T> {
		const
			range = new Range(<T>this.start, <T>this.end);

		range.type = this.type;
		range.isReversed = this.isReversed;

		return range;
	}

	/**
	 * Clamps an element to be within the range if it falls outside
	 * @param el
	 */
	clamp(el: unknown): T {
		const
			val = Object.isString(el) ? codePointAt(el) : Number(el);

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

		if (!isFinite(this.start) || !isFinite(this.end)) {
			return Infinity;
		}

		return this.end - this.start + 1;
	}

	/**
	 * Returns an iterable object from the range
	 * @param step
	 */
	*values(step?: number): IterableIterator<T> {
		if (!this.isValid()) {
			return;
		}

		if (step == null || step === 0) {
			if (this.type === 'date') {
				if (isFinite(this.start) && isFinite(this.end)) {
					step = (this.end - this.start) * 0.01;

				} else {
					step = (30).days();
				}

			} else {
				step = 1;
			}
		}

		if (!Number.isNatural(step)) {
			throw new TypeError('Step value can be only natural');
		}

		let
			start,
			end;

		const
			isStringRange = this.type === 'string';

		if (isFinite(this.start)) {
			start = this.start;

		} else if (isStringRange) {
			start = 0;

		} else {
			start = Number.MIN_SAFE_INTEGER;
		}

		if (isFinite(this.end)) {
			end = this.end;

		} else {
			end = Number.MAX_SAFE_INTEGER;
		}

		if (this.isReversed) {
			for (let i = end; i >= start; i -= step) {
				try {
					yield this.toType(i);

				} catch {
					break;
				}
			}

		} else {
			for (let i = start; i <= end; i += step) {
				try {
					yield this.toType(i);

				} catch {
					break;
				}
			}
		}
	}

	/**
	 * Creates an array from the range and returns it
	 * @param [step] - iteration step value
	 */
	toArray(step?: number): T[] {
		if (this.isValid() && !isFinite(this.span())) {
			throw new RangeError("Can't create an array of the infinitive range. Use an iterator instead.");
		}

		return [...this.values(step)];
	}

	/**
	 * Creates a string from the range and returns it
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
	 * @param value
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
