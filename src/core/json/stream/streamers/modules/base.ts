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

import { Assembler } from 'core/json/stream/assembler';
import type { JsonToken } from 'core/json/stream/interface';

export abstract class StreamBase {
	abstract wait?(chunk: JsonToken): Generator<JsonToken>;
	abstract push(discard?: boolean): Generator<any>;

	protected filter: (chunk: JsonToken) => Generator<JsonToken> = this.processChunk;
	protected assembler: Assembler;
	protected abstract level: number;
	protected readonly savedAssembler?: Assembler;

	constructor() {
		this.processChunk = this.wait ?? this.filter;
		this.assembler = new Assembler();
	}

	*processChunk(chunk: JsonToken): Generator<JsonToken> {
		if (Object.isFunction(this.assembler[chunk.name])) {
			this.assembler[chunk.name](chunk.value);

			if (this.assembler.depth === this.level) {
				yield* this.push();
			}
		}
	}

	*accept(chunk: JsonToken): Generator<JsonToken> {
		if (Object.isFunction(this.assembler[chunk.name])) {
			this.assembler[chunk.name](chunk.value);

			if (this.assembler.depth === this.level) {
				yield* this.push();
				this.processChunk = this.filter;
			}
		}
	}

	// eslint-disable-next-line require-yield
	*reject(chunk: JsonToken): Generator<JsonToken> {
		if (Object.isFunction(this.assembler[chunk.name])) {
			this.assembler[chunk.name](chunk.value);

			if (this.assembler.depth === this.level) {
				this.assembler = this.savedAssembler!;
				this.processChunk = this.filter;
			}
		}
	}
}
