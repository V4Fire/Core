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

import Parser, { Token } from 'core/json/stream/parser';
import Assembler, { AssemblerOptions } from 'core/json/stream/assembler';

import {

	Pick,
	Filter,

	FilterOptions,
	TokenFilter

} from 'core/json/stream/filters';

import {

	ArrayStreamer,
	ObjectStreamer,

	StreamedArray,
	StreamedObject

} from 'core/json/stream/streamers';

/**
 * Parses the specified iterable object as a JSON stream and yields tokens via a Generator
 * @param source
 */
export function from(source: Iterable<string> | AsyncIterable<string>): AsyncGenerator<Token> {
	return Parser.from(source);
}

/**
 * Takes the specified iterable object of tokens and filters it via the specified filter
 *
 * @param source
 * @param filter
 */
export async function* filter(source: AsyncIterable<Token>, filter: TokenFilter): AsyncGenerator<Token> {
	const
		f = new Filter(filter);

	for await (const chunk of source) {
		yield* f.processToken(chunk);
	}

	yield* f.finishTokenProcessing();
}

/**
 * Takes the specified iterable object of tokens and pick from it value that matches the specified selector
 *
 * @param source
 * @param selector
 * @param [opts] - additional filter options
 */
export async function* pick(
	source: AsyncIterable<Token>,
	selector: TokenFilter,
	opts?: FilterOptions
): AsyncGenerator<Token> {
	const
		p = new Pick(selector, opts);

	for await (const chunk of source) {
		yield* p.processToken(chunk);
	}
}

/**
 * Takes the specified iterable object of tokens and yields an assembled item from it
 *
 * @param source
 * @param [opts] - additional options
 */
export async function* assemble<T = unknown>(
	source: AsyncIterable<Token>,
	opts?: AssemblerOptions
): AsyncGenerator<T> {
	const
		a = new Assembler<T>(opts);

	for await (const chunk of source) {
		yield* a.processToken(chunk);
	}
}

/**
 * Takes the specified iterable object of tokens representing an array and yields assembled array items
 * @param source
 */
export async function* streamArray<T = unknown>(source: AsyncIterable<Token>): AsyncGenerator<StreamedArray<T>> {
	const
		s = new ArrayStreamer<T>();

	for await (const chunk of source) {
		yield* s.processToken(chunk);
	}
}

/**
 * Takes the specified iterable object of tokens representing an object and yields assembled object items
 * @param source
 */
export async function* streamObject<T = unknown>(source: AsyncIterable<Token>): AsyncGenerator<StreamedObject<T>> {
	const
		s = new ObjectStreamer<T>();

	for await (const chunk of source) {
		yield* s.processToken(chunk);
	}
}
