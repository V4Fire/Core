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

import type { Parser } from 'core/json/stream/parser';
import type { JsonToken } from 'core/json/stream/interface';
import { PARSER_DONE } from 'core/json/stream/const';

export function* done(this: Parser): Generator<JsonToken> {
	this.patterns.ws.lastIndex = this.index;
					this.match = this.patterns.ws.exec(this.buffer);

					if (!this.match) {
						if (this.index < this.buffer.length) {

							throw new Error('Parser cannot parse input: unexpected characters');
						}

						return PARSER_DONE;
					}

					this.value = this.match[0];

					if (this.openNumber) {
						yield {name: 'endNumber'};

						this.openNumber = false;

						yield {name: 'numberValue', value: this.accumulator};
						this.accumulator = '';
					}

					this.index += this.value.length;
}
