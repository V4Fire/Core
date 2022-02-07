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

class Counter {
	depth: number;

	constructor(initialDepth: number) {
		this.depth = initialDepth;
	}

	startObject() {
		++this.depth;
	}

	endObject() {
		--this.depth;
	}

	startArray() {
		++this.depth;
	}

	endArray() {
		--this.depth;
	}
}

export abstract class StreamBase {
	abstract _wait?(chunk: JsonToken): Generator<JsonToken>;
	abstract _push(discard?: boolean): Generator<any>;

	protected _filter: (chunk: JsonToken) => Generator<JsonToken> = this.processChunk;
	protected _assembler: Assembler | Counter;
	protected abstract _level: number;
	private readonly _savedAssembler?: Assembler;

	constructor() {
		this.processChunk = this._wait || this._filter;
		this._assembler = new Assembler();
	}

	*processChunk(chunk: JsonToken): Generator<JsonToken> {
		if (Object.isFunction(this._assembler[chunk.name])) {
			this._assembler[chunk.name](chunk.value);

			if (this._assembler.depth === this._level) {
				yield* this._push();
			}
		}
	}

	*_accept(chunk: JsonToken): Generator<JsonToken> {
		if (Object.isFunction(this._assembler[chunk.name])) {
			this._assembler[chunk.name](chunk.value);

			if (this._assembler.depth === this._level) {
				yield* this._push();
				this.processChunk = this._filter;
			}
		}
	}

	// eslint-disable-next-line require-yield
	*_reject(chunk: JsonToken): Generator<any> {
		if (Object.isFunction(this._assembler[chunk.name])) {
			this._assembler[chunk.name](chunk.value);

			if (this._assembler.depth === this._level) {
				this._assembler = this._savedAssembler!;
				this.processChunk = this._filter;
			}
		}
	}
}
