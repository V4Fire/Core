/* eslint-disable default-case */
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

 import type { JsonToken } from './interface';
 import { FilterBase } from './filterBase';

export class Pick extends FilterBase {
	override*_checkChunk(chunk: JsonToken): Generator<boolean | JsonToken> {
		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
				if (this._filter(this._stack, chunk)) {
					yield chunk;
					this.processChunk = this._passObject;
					this._depth = 1;

					return true;
				}

				break;

			case 'startString':
				if (this._filter(this._stack, chunk)) {
					yield chunk;
					this.processChunk = this._passString;

					return true;
				}

				break;

			case 'startNumber':
				if (this._filter(this._stack, chunk)) {
					yield chunk;
					this.processChunk = this._passNumber;

					return true;
				}

				break;

			case 'nullValue':
			case 'trueValue':
			case 'falseValue':
			case 'stringValue':
			case 'numberValue':
				if (this._filter(this._stack, chunk)) {
					yield chunk;

					if (!this._once) {
						this.processChunk = this._check;
					}

					return true;
				}

				break;
		}

		return false;
	}
}
