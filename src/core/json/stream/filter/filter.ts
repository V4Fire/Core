/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * [[include:core/json/stream/README.md]]
 * @packageDocumentation
 */

import type { JsonToken } from 'core/json/stream/interface';
import { FilterBase } from 'core/json/stream/filter/filterBase';

/* eslint-disable default-case */
export class Filter extends FilterBase {
	syncStack: () => Generator<JsonToken> = this._syncStack.bind(this);
	private _lastStack: any[] = [];

	override*_checkChunk(chunk: JsonToken): Generator<JsonToken> {
		switch (chunk.name) {
			case 'startObject':
				if (this._filter(this._stack, chunk)) {
					yield* this._syncStack();
					yield chunk;

					this._lastStack.push(null);
				}

				break;
			case 'startArray':
				if (this._filter(this._stack, chunk)) {
					yield* this._syncStack();
					yield chunk;
					this._lastStack.push(-1);
				}

				break;
			case 'nullValue':
			case 'trueValue':
			case 'falseValue':
			case 'stringValue':
			case 'numberValue':
				if (this._filter(this._stack, chunk)) {
					yield* this._syncStack();
					yield chunk;
				}

				break;
			case 'startString':
				if (this._filter(this._stack, chunk)) {
					yield* this._syncStack();
					yield chunk;
					this.processChunk = this._passString;

				} else {
					this.processChunk = this._skipString;
				}

				break;
			case 'startNumber':
				if (this._filter(this._stack, chunk)) {
					yield* this._syncStack();
					yield chunk;
					this.processChunk = this._passNumber;

				} else {
					this.processChunk = this._skipNumber;
				}

				break;
		}

		return false;
	}

	*_syncStack(): Generator<JsonToken> {
		const stack = this._stack,
			last = this._lastStack,
			stackLength = stack.length,
			lastLength = last.length;

		// Find the common part
		let commonLength = 0;
		for (
			const n = Math.min(stackLength, lastLength);
			commonLength < n && stack[commonLength] === last[commonLength];
			++commonLength
		) { }

		// Close old objects
		for (let i = lastLength - 1; i > commonLength; --i) {
			yield {name: Object.isNumber(last[i]) ? 'endArray' : 'endObject'};
		}

		if (commonLength < lastLength) {
			if (commonLength < stackLength) {
				if (Object.isString(stack[commonLength])) {
					const key = stack[commonLength];

					yield {name: 'startKey'};
					yield {name: 'stringChunk', value: key};
					yield {name: 'endKey'};

					yield {name: 'keyValue', value: key};
				}

				++commonLength;

			} else {
				yield {name: Object.isNumber(last[commonLength]) ? 'endArray' : 'endObject'};
			}
		}

		// Open new objects
		for (let i = commonLength; i < stackLength; ++i) {
			const key = stack[i];

			if (Object.isNumber(key)) {
				if (key >= 0) {
					yield {name: 'startArray'};
				}

			} else if (Object.isString(key)) {
				yield {name: 'startObject'};

				yield {name: 'startKey'};
				yield {name: 'stringChunk', value: key};
				yield {name: 'endKey'};

				yield {name: 'keyValue', value: key};
			}
		}

		// Update the last stack
		this._lastStack = Array.prototype.concat.call(stack);
	}
}
