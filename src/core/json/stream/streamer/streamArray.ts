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
import { StreamBase } from 'core/json/stream/streamer/streamBase';

export class StreamArray extends StreamBase {
	_counter: number = 0;
	_level: number = 1;

	*_wait(chunk: JsonToken): Generator<JsonToken> {
		// First chunk should open an array
		if (chunk.name !== 'startArray') {
			yield new Error('Top-level object should be an array.');
		}

		this.processChunk = this._filter;

		yield* this.processChunk(chunk);
	}

	*_push(discard?: boolean): Generator<any> {
		if (this._assembler.current.length) {
			if (discard) {
				++this._counter;
				this._assembler.current.pop();

			} else {
				yield {key: this._counter++, value: this._assembler.current.pop()};
			}
		}
	}
}
