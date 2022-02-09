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
import { PARSER_DONE, PARSER_EXPECTED } from 'core/json/stream/const';

export function* numberExpDigit(this: Parser): Generator<JsonToken> {
	this.patterns.numberExpDigit.lastIndex = this.index;
					this.match = this.patterns.numberExpDigit.exec(this.buffer);
					this.value = this.match?.[0];

					if (this.value != null) {
						yield {name: 'numberChunk', value: this.value};

						this.accumulator += this.value;

						this.index += this.value.length;

					} else {
						if (this.index < this.buffer.length) {
							this.expect = PARSER_EXPECTED[this.parent];
							return;
						}

						return PARSER_DONE;
					}
}
