/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { StreamArray, StreamObject } from 'core/json/stream/streamer';

describe('streamers for JSON stream', () => {
	const data = [
		{name: 'startArray'},
		{name: 'startObject'},
		{name: 'startKey'},
		{name: 'stringChunk', value: 'a'},
		{name: 'endKey'},
		{name: 'keyValue', value: 'a'},
		{name: 'startNumber'},
		{name: 'numberChunk', value: '1'},
		{name: 'numberChunk', value: '2'},
		{name: 'numberChunk', value: '3'},
		{name: 'endNumber'},
		{name: 'numberValue', value: '123'},
		{name: 'endObject'},
		{name: 'startObject'},
		{name: 'startKey'},
		{name: 'stringChunk', value: 'b'},
		{name: 'endKey'},
		{name: 'keyValue', value: 'b'},
		{name: 'startArray'},
		{name: 'startNumber'},
		{name: 'numberChunk', value: '1'},
		{name: 'endNumber'},
		{name: 'numberValue', value: '1'},
		{name: 'startNumber'},
		{name: 'numberChunk', value: '2'},
		{name: 'endNumber'},
		{name: 'numberValue', value: '2'},
		{name: 'startNumber'},
		{name: 'numberChunk', value: '3'},
		{name: 'endNumber'},
		{name: 'numberValue', value: '3'},
		{name: 'endArray'},
		{name: 'endObject'},
		{name: 'startObject'},
		{name: 'startKey'},
		{name: 'stringChunk', value: 'c'},
		{name: 'endKey'},
		{name: 'keyValue', value: 'c'},
		{name: 'startObject'},
		{name: 'startKey'},
		{name: 'stringChunk', value: 'd'},
		{name: 'endKey'},
		{name: 'keyValue', value: 'd'},
		{name: 'startString'},
		{name: 'stringChunk', value: 's'},
		{name: 'endString'},
		{name: 'stringValue', value: 's'},
		{name: 'endObject'},
		{name: 'endObject'},
		{name: 'startObject'},
		{name: 'startKey'},
		{name: 'stringChunk', value: 'e'},
		{name: 'endKey'},
		{name: 'keyValue', value: 'e'},
		{name: 'startString'},
		{name: 'stringChunk', value: 'd'},
		{name: 'stringChunk', value: 'a'},
		{name: 'stringChunk', value: 't'},
		{name: 'stringChunk', value: 'a'},
		{name: 'endString'},
		{name: 'stringValue', value: 'data'},
		{name: 'endObject'},
		{name: 'startObject'},
		{name: 'startKey'},
		{name: 'stringChunk', value: 'f'},
		{name: 'endKey'},
		{name: 'keyValue', value: 'f'},
		{name: 'startArray'},
		{name: 'endArray'},
		{name: 'endObject'},
		{name: 'endArray'}
	];

	const target = [
		{a: 123},
		{b: [1, 2, 3]},
		{c: {d: 's'}},
		{e: 'data'},
		{f: []}
	];

	describe('streamArray', () => {
		it('should stream array', () => {
			const streamArray = new StreamArray();
			let index = 0;

			for (const chunk of data) {
				for (const item of streamArray.processChunk(chunk)) {
					expect(item).toEqual({key: index, value: target[index]});
					index++;
				}
			}
		});

		it('should fail if element not array', () => {
			const streamArray = new StreamArray();
			const input = data.slice(1, 12);

			expect(function check() {
				for (const chunk of input) {
					// eslint-disable-next-line no-unused-vars
					for (const _ of streamArray.processChunk(chunk)) { }
				}
			}).toThrow(new Error('Top-level object should be an array.'));
		});

		it('should stream nothing if source is empty', () => {
			const streamArray = new StreamArray();
			const input = [
				{name: 'startArray'},
				{name: 'endArray'}
			];

			const fn = jasmine.createSpy();

			for (const chunk of input) {
				for (const item of streamArray.processChunk(chunk)) {
					spy(item);
				}
			}

			expect(fn).not.toHaveBeenCalled();
		});
	});

	describe('streamObject', () => {
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
			{name: 'startArray'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '1'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '1'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '2'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '2'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '3'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '3'},
			{name: 'endArray'},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'c'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'c'},
			{name: 'startObject'},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'd'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'd'},
			{name: 'startNumber'},
			{name: 'numberChunk', value: '0'},
			{name: 'endNumber'},
			{name: 'numberValue', value: '0'},
			{name: 'endObject'},
			{name: 'startKey'},
			{name: 'stringChunk', value: 'e'},
			{name: 'endKey'},
			{name: 'keyValue', value: 'e'},
			{name: 'startString'},
			{name: 'stringChunk', value: 'd'},
			{name: 'stringChunk', value: 'a'},
			{name: 'stringChunk', value: 't'},
			{name: 'stringChunk', value: 'a'},
			{name: 'endString'},
			{name: 'stringValue', value: 'data'},
			{name: 'endObject'}
		];
		const target = {
			a: 1, b: [1, 2, 3], c: {d: 0}, e: 'data'
		};

		it('should stream object', () => {
			const streamObject = new StreamObject();

			for (const chunk of data) {
				for (const item of streamObject.processChunk(chunk)) {
					expect(item).toEqual({key: item.key, value: target[item.key]});
				}
			}
		});

		it('should fail if element not object', () => {
			const input = data.slice(1);
			const streamObject = new StreamObject();

			expect(function check() {
				for (const chunk of input) {
					// eslint-disable-next-line no-unused-vars
					for (const _ of streamObject.processChunk(chunk)) {}
				}
			}).toThrow(new Error('Top-level object should be an object.'));
		});

		it('should stream nothing if source is empty', () => {
			const spy = jasmine.createSpy();
			const input = [
				{name: 'startObject'},
				{name: 'endObject'}
			];

			const streamObject = new StreamObject();

			for (const chunk of input) {
				for (const item of streamObject.processChunk(chunk)) {
					spy(item);
				}
			}

			expect(spy).not.toHaveBeenCalled();
		});
	});
});
