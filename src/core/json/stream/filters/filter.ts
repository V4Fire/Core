/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Token } from 'core/json/stream/parser';

import Super from 'core/json/stream/filters/abstract-filter';
import type { TokenFilter, FilterStack } from 'core/json/stream/filters/interface';

export default class Filter extends Super {
	override readonly multiple: boolean = true;

	/**
	 * Stack for the current object that is being filtered
	 */
	protected objStack: FilterStack = [];

	public constructor(filter: TokenFilter) {
		super(filter);
	}

	override*finishTokenProcessing(): Generator<Token> {
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

	/** @inheritDoc */
	protected*checkToken(chunk: Token): Generator<Token> {
		switch (chunk.name) {
			case 'startObject':
				if (this.filter(this.stack, chunk)) {
					yield* this.finishTokenProcessing();
					yield chunk;

					this.objStack.push(null);
				}

				break;

			case 'startArray':
				if (this.filter(this.stack, chunk)) {
					yield* this.finishTokenProcessing();
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
					yield* this.finishTokenProcessing();
					yield chunk;
				}

				break;

			case 'startString':
				if (this.filter(this.stack, chunk)) {
					yield* this.finishTokenProcessing();
					yield chunk;

					this.processToken = this.passString;

				} else {
					this.processToken = this.skipString;
				}

				break;

			case 'startNumber':
				if (this.filter(this.stack, chunk)) {
					yield* this.finishTokenProcessing();
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
