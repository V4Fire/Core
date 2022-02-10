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
	counter: number = 0;
	level: number = 1;

	*wait(chunk: JsonToken): Generator<StreamedArray> {
		// First chunk should open an array
		if (chunk.name !== 'startArray') {
			throw new Error('Top-level object should be an array.');
		}

		this.processChunk = this.filter;

		yield* this.processChunk(chunk);
	}

	*push(): Generator<StreamedArray> {
		const
			{current} = this.assembler;

		if (Object.isArray(current) && current.length > 0) {
			yield {key: this.counter++, value: current.pop()};
		}
	}
}
