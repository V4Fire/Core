/* eslint-disable default-case */
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

import { Assembler } from './assembler';
import type { JsonToken } from './interface';

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

export interface StreamBaseOptions {
	objectFilter?(assembler: Assembler): boolean;
	includeUndecided?: boolean;
}

export abstract class StreamBase {
	abstract _wait?(chunk: JsonToken): Generator<JsonToken>;
	abstract _push(discard?: boolean): Generator<any>;

	protected _assembler: Assembler;
	protected abstract _level: number;
	private _savedAssembler?: Assembler;
	private readonly includeUndecided?: boolean;

	constructor(options?: StreamBaseOptions) {
		if (options) {
			this.objectFilter = options.objectFilter;
			this.includeUndecided = options.includeUndecided;
		}

		if (!Object.isFunction(this.objectFilter)) {
			this._filter = this.processChunk;
		}

		this.processChunk = this._wait || this._filter;
		this._assembler = new Assembler(options);
	}

	*processChunk(chunk: JsonToken): Generator<JsonToken> {
		if (this._assembler[chunk.name]) {
			this._assembler[chunk.name](chunk.value);

			if (this._assembler.depth === this._level) {
				yield* this._push();
			}
		}
	}

	*_filter(chunk: JsonToken): Generator<JsonToken> {
		if (this._assembler[chunk.name]) {
			this._assembler[chunk.name](chunk.value);
			const result = this.objectFilter(this._assembler);

			if (result) {
				if (this._assembler.depth === this._level) {
					yield* this._push();
					this.processChunk = this._filter;
				}

				this.processChunk = this._accept;

			} else if (result === false) {
				this._savedAssembler = this._assembler;
				this._assembler = new Counter(this._savedAssembler.depth);
				this._savedAssembler.dropToLevel(this._level);

				if (this._assembler.depth === this._level) {
					this._assembler = this._savedAssembler;
					this.processChunk = this._filter;
				}

				this.processChunk = this._reject;

			} else if (this._assembler.depth === this._level) {
				yield* this._push(!this.includeUndecided);
			}
		}
	}

	*_accept(chunk: JsonToken): Generator<JsonToken> {
		if (this._assembler[chunk.name]) {
			this._assembler[chunk.name](chunk.value);

			if (this._assembler.depth === this._level) {
				yield* this._push();
				this.processChunk = this._filter;
			}
		}
	}

	_reject(chunk: JsonToken): void {
		if (this._assembler[chunk.name]) {
			this._assembler[chunk.name](chunk.value);

			if (this._assembler.depth === this._level) {
				this._assembler = this._savedAssembler;
				this.processChunk = this._filter;
			}
		}
	}

	private objectFilter?(assembler: Assembler): boolean;
}
