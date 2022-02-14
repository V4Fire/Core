/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { JsonToken } from 'core/json/stream/interface';

import Super from 'core/json/stream/filters/modules/base';
import type { FilterStack } from 'core/json/stream/filters/interface';

export default class Filter extends Super {
	/**
	 * Filter can work only in a multiple mode
	 */
	override readonly multiple: boolean = true;

	/**
	 * Stack for the current object that is being filtered
	 */
	protected objStack: FilterStack = [];

	/**
	 * Closes all unclosed tokens and returns a Generator of filtered tokens.
	 * The method must be called after the end of filtration.
	 */
	*syncStack(): Generator<JsonToken> {
		const
			{stack, objStack} = this;

		const
			stackLength = stack.length,
			objStackLength = objStack.length;

		let
			commonLength = 0;

		// Find the common part
		for (
			const n = Math.min(stackLength, objStackLength);
			commonLength < n && stack[commonLength] === objStack[commonLength];
			commonLength++
		) { }

		// Close old objects
		for (let i = objStackLength - 1; i > commonLength; i--) {
			yield {name: Object.isNumber(objStack[i]) ? 'endArray' : 'endObject'};
		}

		if (commonLength < objStackLength) {
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
				yield {name: Object.isNumber(objStack[commonLength]) ? 'endArray' : 'endObject'};
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
		this.objStack = Array.prototype.concat.call(stack);
	}

	protected override*checkChunk(chunk: JsonToken): Generator<JsonToken> {
		switch (chunk.name) {
			case 'startObject':
				if (this.filter(this.stack, chunk)) {
					yield* this.syncStack();
					yield chunk;

					this.objStack.push(null);
				}

				break;

			case 'startArray':
				if (this.filter(this.stack, chunk)) {
					yield* this.syncStack();
					yield chunk;

					this.objStack.push(-1);
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

					this.processToken = this.passString;

				} else {
					this.processToken = this.skipString;
				}

				break;

			case 'startNumber':
				if (this.filter(this.stack, chunk)) {
					yield* this.syncStack();
					yield chunk;

					this.processToken = this.passNumber;

				} else {
					this.processToken = this.skipNumber;
				}

				break;

			default:
				// Do nothing
		}

		return false;
	}
}
