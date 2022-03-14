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

import { sequence } from 'core/iter/combinators';

import Parser, { Token } from 'core/json/stream/parser';
import Assembler, { AssemblerOptions } from 'core/json/stream/assembler';

import {

	Pick,
	Filter,

	FilterToken,
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

	for await (const token of source) {
		const
			tokens = [...p.processToken(token)],
			lastToken = <Nullable<FilterToken>>tokens[tokens.length - 1];

		if (lastToken?.filterComplete) {
			for (let i = 0; i < tokens.length; i++) {
				const
					token = tokens[i];

				if (token === lastToken) {
					yield Object.reject(lastToken, 'filterComplete');
					return;
				}

				yield token;
			}

		} else {
			yield* Object.cast(tokens);
		}
	}
}

export function andPick(
	source: AsyncIterable<Token>,
	selector: TokenFilter,
	opts?: FilterOptions
): AsyncGenerator<Token> {
	let
		stage = 0;

	const startObject: AsyncIterableIterator<Token> = {
		[Symbol.asyncIterator]() {
			return this;
		},

		next() {
			if (stage++ === 0) {
				return Promise.resolve({
					value: {name: 'startObject'},
					done: false
				});
			}

			return Promise.resolve({
				value: undefined,
				done: true
			});
		}
	};

	return pick(sequence(startObject, source), selector, opts);
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
 *
 * @param source
 * @param [opts] - additional options
 */
export async function* streamArray<T = unknown>(
	source: AsyncIterable<Token>,
	opts?: AssemblerOptions
): AsyncGenerator<StreamedArray<T>> {
	const
		s = new ArrayStreamer<T>(opts);

	for await (const chunk of source) {
		yield* s.processToken(chunk);
	}
}

/**
 * Takes the specified iterable object of tokens representing an object and yields assembled object items
 *
 * @param source
 * @param [opts] - additional options
 */
export async function* streamObject<T = unknown>(
	source: AsyncIterable<Token>,
	opts?: AssemblerOptions
): AsyncGenerator<StreamedObject<T>> {
	const
		s = new ObjectStreamer<T>(opts);

	for await (const chunk of source) {
		yield* s.processToken(chunk);
	}
}
