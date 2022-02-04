/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Filter } from 'core/json/stream/filter';

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

describe('JSON stream filter', () => {
	it('should filter token stream', () => {
		const filter = new Filter({filter: 'a'});
		let result;

		for (const chunk of data) {
			for (const el of filter.processChunk(chunk)) {
				result = el;
			}
		}

		expect(result).toEqual({name: 'numberValue', value: '1'});
	});

	// todo: filter last elem of object is broken
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

		expect(result).toEqual([{name: 'startObject'}, ...data.slice(14, data.length - 2)]);
	});

	it('should filter token stream with function', () => {
		const filter = (stack, chunk) => {
			
		};

		const assembler = new Assembler({filter});
		let result;

		for (const chunk of data) {
			for (const el of assembler.processChunk(chunk)) {
				result = el;
			}
		}

		expect(result).toEqual(target);
	});
});
