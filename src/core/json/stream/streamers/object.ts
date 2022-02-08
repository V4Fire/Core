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
import { StreamBase } from 'core/json/stream/streamers/modules/base';

export class StreamObject extends StreamBase {
	level: number = 1;
	protected _lastKey: number | null | string | Object = null;

	*wait(chunk: JsonToken): Generator<JsonToken> {
		// First chunk should open an array
		if (chunk.name !== 'startObject') {
			throw new Error('Top-level object should be an object.');
		}

		this.processChunk = this.filter;
		yield* this.processChunk(chunk);
	}

	*push(): Generator<{key: number | null | string | Object; value: any}> {
		if (this._lastKey == null) {
			this._lastKey = (this.assembler).key;

		} else {
			yield {key: this._lastKey, value: this.assembler.current![<string>this._lastKey]};
		}
	}
}
