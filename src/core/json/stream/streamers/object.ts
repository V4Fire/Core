/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Token, StreamedObject } from 'core/json/stream/interface';
import { StreamBase } from 'core/json/stream/streamers/modules/base';

export class StreamObject extends StreamBase {
	/**
	 * Current level of element being streamed
	 */
	level: number = 1;

	/**
	 * Last key of assembled object property
	 */
	protected lastKey: string | null = null;

	/**
	 * Wait for start object token
	 * otherwise throw an error
	 *
	 * @param chunk
	 */
	*wait(chunk: Token): Generator<StreamedObject> {
		// First chunk should open an array
		if (chunk.name !== 'startObject') {
			throw new Error('Top-level object should be an object.');
		}

		this.processChunk = this.assembleChunk;
		yield* this.processChunk(chunk);
	}

	/**
	 * Yielding object key/value pairs
	 */
	*push(): Generator<StreamedObject> {
		if (this.lastKey == null) {
			this.lastKey = this.assembler.key;

		} else {
			yield {key: this.lastKey, value: this.assembler.item![this.lastKey]};
			this.assembler.item = {};
			this.lastKey = null;
		}
	}
}
