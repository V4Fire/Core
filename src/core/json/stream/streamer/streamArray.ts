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
import type { Assembler } from 'core/json/stream/assembler';

export class StreamArray extends StreamBase {
	_counter: number = 0;
	_level: number = 1;

	*_wait(chunk: JsonToken): Generator<JsonToken> {
		// First chunk should open an array
		if (chunk.name !== 'startArray') {
			throw new Error('Top-level object should be an array.');
		}

		this.processChunk = this._filter;

		yield* this.processChunk(chunk);
	}

	*_push(): Generator<any> {
		if ((<string>(<Assembler>this._assembler).current!).length > 0) {
			yield {key: this._counter++, value: (<any[]>(<Assembler>this._assembler).current!).pop()};
		}
	}
}
