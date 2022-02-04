/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Assembler } from 'core/json/stream/assembler';

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
const target = {a: 1, b: true, c: ['d']};

describe('Json assemlber', () => {
	it('should assemble token stream to valid object', () => {
		const assembler = new Assembler();
		let result;

		for (const chunk of data) {
			for (const el of assembler.processChunk(chunk)) {
				result = el;
			}
		}

		expect(result).toEqual(target);
	});

	it('should assemble token stream with custom reviver', () => {
		const reviver = () => 5;
		const assembler = new Assembler({reviver});
		let result;

		for (const chunk of data) {
			for (const el of assembler.processChunk(chunk)) {
				result = el;
			}
		}

		expect(result).toEqual({a: 5, b: 5, c: 5});
	});

	it('should assemble token stream with numbers as strings', () => {
		const assembler = new Assembler({numberAsString: true});
		let result;

		for (const chunk of data) {
			for (const el of assembler.processChunk(chunk)) {
				result = el;
			}
		}

		const patchedTarget = {...target};
		patchedTarget.a = '1';

		expect(result).toEqual(patchedTarget);
	});
});
