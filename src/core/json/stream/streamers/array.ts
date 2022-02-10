/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { JsonToken, StreamedArray } from 'core/json/stream/interface';
import { StreamBase } from 'core/json/stream/streamers/modules/base';

export class StreamArray extends StreamBase {
	/**
	 * Current index of element being streamed
	 */
	counter: number = 0;

	/**
	 * Current level of element being streamed
	 */
	level: number = 1;

	/**
	 * Wait for start array token
	 * otherwise throw an error
	 *
	 * @param chunk
	 */
	*wait(chunk: JsonToken): Generator<StreamedArray> {
		// First chunk should open an array
		if (chunk.name !== 'startArray') {
			throw new Error('Top-level object should be an array.');
		}

		this.processChunk = this.assembleChunk;

		yield* this.processChunk(chunk);
	}

	/**
	 * Yielding array values
	 */
	*push(): Generator<StreamedArray> {
		const
			{current} = this.assembler;

		if (Object.isArray(current) && current.length > 0) {
			yield {key: this.counter++, value: current.pop()};
		}
	}
}
