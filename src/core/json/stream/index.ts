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

import { Parser, ParserOptions } from 'core/json/stream/parser';
import { Filter, Pick, FilterBaseOptions } from 'core/json/stream/filter';
import { Assembler, AssemblerOptions } from 'core/json/stream/assembler';
import { StreamBaseOptions, StreamArray, StreamObject } from 'core/json/stream/streamer';
import type { JsonToken } from 'core/json/stream/interface';

export async function* from(
	iterable: AsyncIterable<Buffer | string>,
	options: ParserOptions
): AsyncGenerator<JsonToken> {
	const parser = new Parser(options);

	for await (const chunk of iterable) {
		yield* parser.processChunk(chunk.toString());
	}
}

export async function* assemble(
	iter: AsyncIterable<JsonToken>,
	options?: AssemblerOptions
): AsyncGenerator<any> {
	const assembler = new Assembler(options);

	for await (const chunk of iter) {
		yield* assembler.processChunk(chunk);
	}
}

export async function* filter(
	iter: AsyncIterable<JsonToken>,
	options?: FilterBaseOptions
): AsyncGenerator<JsonToken> {
	const filter = new Filter(options);

	for await (const chunk of iter) {
		yield* filter.processChunk(chunk);
	}

	yield* filter.syncStack();
}

export async function* pick(
	iter: AsyncIterable<JsonToken>,
	options?: FilterBaseOptions
): AsyncGenerator<JsonToken> {
	const pick = new Pick(options);

	for await (const chunk of iter) {
		yield* pick.processChunk(chunk);
	}
}

export async function* streamArray(
	iter: AsyncIterable<JsonToken>,
	options?: StreamBaseOptions
): AsyncGenerator<JsonToken> {
	const iterArray = new StreamArray(options);

	for await (const chunk of iter) {
		yield* iterArray.processChunk(chunk);
	}
}

export async function* streamObject(
	iter: AsyncIterable<JsonToken>,
	options?: StreamBaseOptions
): AsyncGenerator<JsonToken> {
	const objectStream = new StreamObject(options);

	for await (const chunk of iter) {
		yield* objectStream.processChunk(chunk);
	}
}
