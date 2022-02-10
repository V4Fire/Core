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

import { Parser } from 'core/json/stream/parser';
import { Filter, Pick } from 'core/json/stream/filters';
import { Assembler } from 'core/json/stream/assembler';
import { StreamArray, StreamObject } from 'core/json/stream/streamers';
import type { JsonToken, AssemblerOptions, FilterBaseOptions, StreamedArray, StreamedObject } from 'core/json/stream/interface';

/**
 * Iterate through async iterator of JSON pieces
 * and transform it into tokens
 *
 * @param iterable
 */
export async function* from(
	iterable: AsyncIterable<Buffer | string>
): AsyncGenerator<JsonToken> {
	const parser = new Parser();

	for await (const chunk of iterable) {
		yield* parser.processChunk(chunk.toString());
	}
}

/**
 * Iterate through async iterator of tokens
 * and transform it back into JSON
 *
 * @param iterable
 * @param options
 */
export async function* assemble(
	iterable: AsyncIterable<JsonToken>,
	options?: AssemblerOptions
): AsyncGenerator<any> {
	const assembler = new Assembler(options);

	for await (const chunk of iterable) {
		yield* assembler.processChunk(chunk);
	}
}

/**
 * Iterate through async iterator of tokens
 * and filter it by a filter in options
 *
 * @param iterable
 * @param options
 */
export async function* filter(
	iterable: AsyncIterable<JsonToken>,
	options?: FilterBaseOptions
): AsyncGenerator<JsonToken> {
	const filter = new Filter(options);

	for await (const chunk of iterable) {
		yield* filter.processChunk(chunk);
	}

	yield* filter.syncStack();
}

/**
 * Iterate through async iterator of tokens
 * and picks first filter match
 *
 * @param iterable
 * @param options
 */
export async function* pick(
	iterable: AsyncIterable<JsonToken>,
	options?: FilterBaseOptions
): AsyncGenerator<JsonToken> {
	const pick = new Pick(options);

	for await (const chunk of iterable) {
		yield* pick.processChunk(chunk);
	}
}

/**
 * Iterate through async iterator of tokens, which represent an array
 * assemble and stream all values from it during iteration
 *
 * @param iterable
 */
export async function* streamArray(
	iterable: AsyncIterable<JsonToken>
): AsyncGenerator<StreamedArray> {
	const iterArray = new StreamArray();

	for await (const chunk of iterable) {
		yield* iterArray.processChunk(chunk);
	}
}

/**
 * Iterate through async iterator of tokens, which represent an object
 * assemble and stream all key/value pairs from it during iteration
 *
 * @param iterable
 */
export async function* streamObject(
	iterable: AsyncIterable<JsonToken>
): AsyncGenerator<StreamedObject> {
	const objectStream = new StreamObject();

	for await (const chunk of iterable) {
		yield* objectStream.processChunk(chunk);
	}
}
