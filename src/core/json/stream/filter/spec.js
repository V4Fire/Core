/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Filter, Pick } from 'core/json/stream/filter';

const data = [
	{name: 'startObject'},
	{name: 'startKey'},
	{name: 'stringChunk', value: 'a'},
	{name: 'endKey'},
	{name: 'keyValue', value: 'a'},
	{name: 'startNumber'},
	{name: 'numberChunk', value: '1'},
	{name: 'endNumber'},
	{name: 'numberValue', value: '1'},
	{name: 'startKey'},
	{name: 'stringChunk', value: 'b'},
	{name: 'endKey'},
	{name: 'keyValue', value: 'b'},
	{name: 'trueValue', value: true},
	{name: 'startKey'},
	{name: 'stringChunk', value: 'c'},
	{name: 'endKey'},
	{name: 'keyValue', value: 'c'},
	{name: 'startArray'},
	{name: 'startString'},
	{name: 'stringChunk', value: 'd'},
	{name: 'endString'},
	{name: 'stringValue', value: 'd'},
	{name: 'endArray'},
	{name: 'endObject'}
];

describe('JSON stream filters', () => {
	describe('filter', () => {
		it('should filter token stream', () => {
			const filter = new Filter({filter: 'a'});
			const result = [];

			for (const chunk of data) {
				for (const el of filter.processChunk(chunk)) {
					result.push(el);
				}
			}

			for (const el of filter.syncStack()) {
				result.push(el);
			}

			expect(result).toEqual([{name: 'startObject'}, ...data.slice(1, 9), {name: 'endObject'}]);
		});

		it('should filter token stream with regexp', () => {
			const filter = new Filter({filter: /c/});
			const result = [];

			for (const chunk of data) {
				for (const el of filter.processChunk(chunk)) {
					result.push(el);
				}
			}

			for (const el of filter.syncStack()) {
				result.push(el);
			}

			expect(result).toEqual([{name: 'startObject'}, ...data.slice(14, data.length)]);
		});

		it('should filter token stream with function', () => {
			const filterFn = (stack) => stack.includes('b');

			const filter = new Filter({filter: filterFn});
			const result = [];

			for (const chunk of data) {
				for (const el of filter.processChunk(chunk)) {
					result.push(el);
				}
			}

			for (const el of filter.syncStack()) {
				result.push(el);
			}

			expect(result).toEqual([{name: 'startObject'}, ...data.slice(9, 14), {name: 'endObject'}]);
		});
	});

	describe('pick', () => {
		it('should pick from token stream', () => {
			const pick = new Pick({filter: 'a'});
			const result = [];

			for (const chunk of data) {
				for (const el of pick.processChunk(chunk)) {
					result.push(el);
				}
			}

			expect(result).toEqual(data.slice(5, 9));
		});

		it('should pick from token stream with regexp', () => {
			const pick = new Pick({filter: /c/});
			const result = [];

			for (const chunk of data) {
				for (const el of pick.processChunk(chunk)) {
					result.push(el);
				}
			}

			expect(result).toEqual(data.slice(18, data.length - 1));
		});

		it('should filter token stream with function', () => {
			const filterFn = (stack) => stack.includes('b');

			const pick = new Pick({filter: filterFn});
			const result = [];

			for (const chunk of data) {
				for (const el of pick.processChunk(chunk)) {
					result.push(el);
				}
			}

			expect(result).toEqual([{name: 'trueValue', value: true}]);
		});
	});
});
