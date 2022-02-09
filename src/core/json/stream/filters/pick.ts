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
 import { FilterBase } from 'core/json/stream/filters/modules/base';

/* eslint-disable default-case */
export class Pick extends FilterBase {
	override*checkChunk(chunk: JsonToken): Generator<boolean | JsonToken> {
		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
				if (this.filter(this.stack, chunk)) {
					yield chunk;
					this.processChunk = this.passObject;
					this.depth = 1;

					return true;
				}

				break;

			case 'startString':
				if (this.filter(this.stack, chunk)) {
					yield chunk;
					this.processChunk = this.passString;

					return true;
				}

				break;

			case 'startNumber':
				if (this.filter(this.stack, chunk)) {
					yield chunk;
					this.processChunk = this.passNumber;

					return true;
				}

				break;

			case 'nullValue':
			case 'trueValue':
			case 'falseValue':
			case 'stringValue':
			case 'numberValue':
				if (this.filter(this.stack, chunk)) {
					yield chunk;

					this.processChunk = this.multiple ? this.check : this.skip;

					return true;
				}

				break;
		}

		return false;
	}
}
