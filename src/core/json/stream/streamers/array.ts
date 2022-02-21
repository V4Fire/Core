/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Token } from 'core/json/stream/parser';
import { Streamer, StreamedArray } from 'core/json/stream/streamers/interface';

export default class ArrayStreamer<T = unknown> extends Streamer<StreamedArray<T>> {
	/**
	 * Index of the current streamed array element
	 */
	protected index: number = 0;

	/** @inheritDoc */
	protected checkToken(chunk: Token): boolean {
		if (chunk.name !== 'startArray') {
			throw new TypeError('The top-level object should be an array');
		}

		return true;
	}

	/** @inheritDoc */
	protected*push(): Generator<StreamedArray<T>> {
		const
			{value} = this.assembler;

		if (Object.isArray(value) && value.length > 0) {
			yield {
				index: this.index++,
				value: Object.cast(value.pop())
			};
		}
	}
}
