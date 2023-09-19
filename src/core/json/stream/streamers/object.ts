/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Token } from 'core/json/stream/parser';
import type { AssemblerOptions } from 'core/json/stream/assembler';

import Streamer, { StreamedObject } from 'core/json/stream/streamers/interface';

export default class StreamObject<T = unknown> extends Streamer<StreamedObject<T>> {
	/**
	 * Last key of the current streamed object property
	 */
	protected key: string | null = null;

	public constructor(opts?: AssemblerOptions) {
		super(opts);
	}

	/** @inheritDoc */
	protected checkToken(chunk: Token): boolean {
		if (chunk.name !== 'startObject') {
			throw new TypeError('The top-level object should be an object');
		}

		return true;
	}

	/** @inheritDoc */
	protected *push(): Generator<StreamedObject<T>> {
		const
			{key, value} = this.assembler;

		if (this.key == null) {
			this.key = key;

		} else if (Object.isDictionary(value)) {
			yield {
				key: this.key,
				value: Object.cast(value[this.key])
			};

			this.key = null;
			this.assembler.value = {};
		}
	}
}
