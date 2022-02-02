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
import { StreamBase } from './streamBase';

export class StreamObject extends StreamBase {
	_level: number = 1;
	private _lastKey: number | null | string | Object = null;

	*_wait(chunk: JsonToken): Generator<JsonToken> {
		// First chunk should open an array
		if (chunk.name !== 'startObject') {
			yield new Error('Top-level object should be an object.');
		}

		this.processChunk = this._filter;
		yield* this.processChunk(chunk);
	}

	*_push(discard: boolean): Generator<{key: number | null | string | Object; value: any}> {
		if (this._lastKey == null) {
			this._lastKey = this._assembler.key;

		} else {
			if (!discard) {
				yield {key: this._lastKey, value: this._assembler.current[this._lastKey]};
			}

			this._assembler.current = {};
			this._lastKey = null;
		}
	}
}
