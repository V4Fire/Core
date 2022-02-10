/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { FilterStack, JsonToken } from 'core/json/stream/interface';
import { FilterBase } from 'core/json/stream/filters/modules/base';

/* eslint-disable default-case */
export class Filter extends FilterBase {
	/**
	 * Filter can work only in multiple mode
	 */
	override multiple: boolean = true;

	/**
	 * Stack for the current object that is being filtered
	 */
	protected lastStack: FilterStack = [];

	/**
	 * Check is chunk matched specified filter
	 *
	 * @param chunk
	 */
	override*checkChunk(chunk: JsonToken): Generator<JsonToken> {
		switch (chunk.name) {
			case 'startObject':
				if (this.filter(this.stack, chunk)) {
					yield* this.syncStack();
					yield chunk;

					this.lastStack.push(null);
				}

				break;

			case 'startArray':
				if (this.filter(this.stack, chunk)) {
					yield* this.syncStack();
					yield chunk;
					this.lastStack.push(-1);
				}

				break;

			case 'nullValue':
			case 'trueValue':
			case 'falseValue':
			case 'stringValue':
			case 'numberValue':
				if (this.filter(this.stack, chunk)) {
					yield* this.syncStack();
					yield chunk;
				}

				break;

			case 'startString':
				if (this.filter(this.stack, chunk)) {
					yield* this.syncStack();
					yield chunk;
					this.processChunk = this.passString;

				} else {
					this.processChunk = this.skipString;
				}

				break;

			case 'startNumber':
				if (this.filter(this.stack, chunk)) {
					yield* this.syncStack();
					yield chunk;
					this.processChunk = this.passNumber;

				} else {
					this.processChunk = this.skipNumber;
				}

				break;
		}

		return false;
	}

	/**
	 * Close all unclosed tokens
	 * must be called after the end of the filtration
	 */
	*syncStack(): Generator<JsonToken> {
		const {stack} = this,
			last = this.lastStack,
			stackLength = stack.length,
			lastLength = last.length;

		// Find the common part
		let commonLength = 0;
		for (
			const n = Math.min(stackLength, lastLength);
			commonLength < n && stack[commonLength] === last[commonLength];
			commonLength++
		) { }

		// Close old objects
		for (let i = lastLength - 1; i > commonLength; i--) {
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

				commonLength++;

			} else {
				yield {name: Object.isNumber(last[commonLength]) ? 'endArray' : 'endObject'};
			}
		}

		// Open new objects
		for (let i = commonLength; i < stackLength; i++) {
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
		this.lastStack = Array.prototype.concat.call(stack);
	}
}
