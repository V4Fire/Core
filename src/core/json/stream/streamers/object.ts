/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { JsonToken, StreamedObject } from 'core/json/stream/interface';
import { StreamBase } from 'core/json/stream/streamers/modules/base';

export class StreamObject extends StreamBase {
	level: number = 1;
	protected _lastKey: string | null = null;

	*wait(chunk: JsonToken): Generator<StreamedObject> {
		// First chunk should open an array
		if (chunk.name !== 'startObject') {
			throw new Error('Top-level object should be an object.');
		}

		this.processChunk = this.filter;
		yield* this.processChunk(chunk);
	}

	*push(): Generator<StreamedObject> {
		if (this._lastKey == null) {
			this._lastKey = (this.assembler).key;

		} else {
			yield {key: this._lastKey, value: this.assembler.current![this._lastKey]};
		}
	}
}
