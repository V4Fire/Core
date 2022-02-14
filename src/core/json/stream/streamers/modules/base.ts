/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Assembler } from 'core/json/stream/assembler';
import type { Token } from 'core/json/stream/interface';

export abstract class StreamBase {
	/**
	 * Current chunk process function
	 *
	 * @param chunk
	 */
	processChunk: (chunk: Token) => Generator<any> = this.wait;

	/**
	 * Method for checking the correctness of
	 * stream of tokens
	 *
	 * @param chunk
	 */
	abstract wait(chunk: Token): Generator<any>;

	/**
	 * Method for yielding assembled tokens
	 */
	abstract push(): Generator<any>;

	/**
	 * Instace of the assembler for assembling
	 * streamed tokens into values
	 */
	protected assembler: Assembler = new Assembler();

	/**
	 * Current depth of the streamed structure
	 */
	protected abstract level: number;

	/**
	 * Assemble token chunk
	 *
	 * @param chunk
	 */
	*assembleChunk(chunk: Token): Generator<any> {
		if (Object.isFunction(this.assembler[chunk.name])) {
			this.assembler[chunk.name](chunk.value);

			if (this.assembler.depth === this.level) {
				yield* this.push();
			}
		}
	}
}
