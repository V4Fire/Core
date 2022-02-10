/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { Assembler } from 'core/json/stream/assembler';
import type { JsonToken } from 'core/json/stream/interface';

export abstract class StreamBase {
	/**
	 * Method for checking the correctness of
	 * stream of tokens
	 *
	 * @param chunk
	 */
	abstract wait(chunk: JsonToken): Generator<any>;

	/**
	 * Method for yielding assembled tokens
	 */
	abstract push(): Generator<any>;

	/**
	 * Instace of the assembler for assembling
	 * streamed tokens into values
	 */
	protected assembler: Assembler;

	/**
	 * Current depth of the streamed structure
	 */
	protected abstract level: number;

	constructor() {
		this.processChunk = this.wait;
		this.assembler = new Assembler();
	}

	/**
	 * Assemble token chunk
	 *
	 * @param chunk
	 */
	*assembleChunk(chunk: JsonToken): Generator<any> {
		if (Object.isFunction(this.assembler[chunk.name])) {
			this.assembler[chunk.name](chunk.value);

			if (this.assembler.depth === this.level) {
				yield* this.push();
			}
		}
	}

	protected processChunk?(chunk: JsonToken): Generator<any>;
}
