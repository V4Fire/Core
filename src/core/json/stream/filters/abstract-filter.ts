/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import symbolGenerator from 'core/symbol';

import type { TokenName, TokenProcessor, TokenProcessorFn } from 'core/json/stream/parser';

import type {

	FilterToken,

	TokenFilter,
	TokenFilterFn,

	FilterStack,
	FilterOptions

} from 'core/json/stream/filters/interface';

export const
	$$ = symbolGenerator();

export default abstract class AbstractFilter implements TokenProcessor<FilterToken> {
	/**
	 * Creates a function to filter only chunks by the specified path
	 *
	 * @param path
	 * @example
	 * ```js
	 * const filter = createPathFilter('foo.bla.bar');
	 * ```
	 */
	static createPathFilter(path: string): TokenFilterFn {
		return (stack) => {
			const
				sep = '.',
				parsedPath = stack.join(sep);

			if (parsedPath.length === path.length && parsedPath === path) {
				return true;
			}

			if (parsedPath.length <= path.length || !parsedPath.startsWith(path)) {
				return false;
			}

			return parsedPath.substring(path.length, path.length + sep.length) === sep;
		};
	}

	/**
	 * Creates a function to filter only chunks with paths matched to the specified regular expression
	 *
	 * @param rgxp
	 * @example
	 * ```js
	 * const filter = createRegExpFilter(/\d+\.foo\.bar/);
	 * ```
	 */
	static createRegExpFilter(rgxp: RegExp): TokenFilterFn {
		return (stack) => rgxp.test(stack.join('.'));
	}

	/**
	 * If true the filtration will return all matched filter results, otherwise only the first match will be returned
	 */
	readonly multiple: boolean = false;

	/**
	 * Processes the passed JSON token and yields tokens
	 */
	get processToken(): TokenProcessorFn<FilterToken> {
		return this[$$.processChunk];
	}

	/**
	 * Sets a new process function to parse JSON chunk and yield tokens
	 */
	protected set processToken(val: TokenProcessorFn<FilterToken>) {
		this[$$.processChunk] = val;
	}

	/**
	 * Checks that specified token is matched for the filter
	 * @param token
	 */
	protected abstract checkToken(token: FilterToken): Generator<boolean | FilterToken>;

	/**
	 * Function to filter a sequence of parsed tokens
	 *
	 * @param stack
	 * @param chunk
	 */
	protected filter: TokenFilterFn;

	/**
	 * Stack of processed tokens
	 */
	protected stack: FilterStack = [];

	/**
	 * Depth of the current structure
	 */
	protected depth: number = 0;

	/**
	 * Name of the previous parsed token
	 */
	protected previousToken: TokenName = '';

	/**
	 * Name of the next expected token from a stream
	 */
	protected expectedToken?: TokenName;

	/**
	 * Method to pass numeric tokens
	 */
	protected readonly passNumber: TokenProcessorFn<FilterToken> = this.passValue('endNumber', 'numberValue');

	/**
	 * Method to skip numeric tokens
	 */
	protected readonly skipNumber: TokenProcessorFn<FilterToken> = this.skipValue('endNumber', 'numberValue');

	/**
	 * Method to pass string tokens
	 */
	protected readonly passString: TokenProcessorFn<FilterToken> = this.passValue('endString', 'stringValue');

	/**
	 * Method to skip string tokens
	 */
	protected readonly skipString: TokenProcessorFn<FilterToken> = this.skipValue('endString', 'stringValue');

	/**
	 * Method to pass key tokens
	 */
	protected readonly passKey: TokenProcessorFn<FilterToken> = this.passValue('endKey', 'keyValue');

	/**
	 * Method to skip key tokens
	 */
	protected readonly skipKey: TokenProcessorFn<FilterToken> = this.skipValue('endKey', 'keyValue');

	/**
	 * @param filter
	 * @param [opts] - additional filter options
	 */
	protected constructor(filter: TokenFilter, opts: FilterOptions = {}) {
		this.processToken = this.check;

		if (Object.isString(filter)) {
			this.filter = AbstractFilter.createPathFilter(filter);

		} else if (Object.isRegExp(filter)) {
			this.filter = AbstractFilter.createRegExpFilter(filter);

		} else {
			this.filter = filter;
		}

		this.multiple = opts.multiple ?? this.multiple;
	}

	/**
	 * Closes all unclosed tokens and returns a Generator of filtered tokens.
	 * The method must be called after the end of filtration.
	 */
	// eslint-disable-next-line require-yield
	*finishTokenProcessing(): Generator<FilterToken> {
		return undefined;
	}

	/**
	 * Check the specified token for filter satisfaction
	 * @param token
	 */
	protected*check(token: FilterToken): Generator<FilterToken> {
		const
			last = this.stack.length - 1;

		switch (token.name) {
			case 'startObject':
			case 'startArray':
			case 'startString':
			case 'startNumber':
			case 'nullValue':
			case 'trueValue':
			case 'falseValue':
				if (Object.isNumber(this.stack[last])) {
					// Array
					(<number>this.stack[last])++;
				}

				break;

			case 'keyValue':
				this.stack[last] = token.value;
				break;

			case 'numberValue':
				if (this.previousToken !== 'endNumber' && Object.isNumber(this.stack[last])) {
					// Array
					(<number>this.stack[last])++;
				}

				break;

			case 'stringValue':
				if (this.previousToken !== 'endString' && Object.isNumber(this.stack[last])) {
					// Array
					(<number>this.stack[last])++;
				}

				break;

			default:
				// Do nothing
		}

		this.previousToken = token.name;

		const
			iter = this.checkToken(token);

		while (true) {
			const {
				done,
				value
			} = iter.next();

			if (done && (value === true || value === undefined)) {
				break;
			}

			if (done && value === false) {
				switch (token.name) {
					case 'startObject':
						this.stack.push(null);
						break;

					case 'startArray':
						this.stack.push(-1);
						break;

					case 'endObject':
					case 'endArray':
						this.stack.pop();
						break;

					default:
						// Do nothing
				}

				break;

			} else {
				yield value;
			}
		}
	}

	/**
	 * Passes the passed token into an output token stream
	 * @param token
	 */
	protected*pass(token: FilterToken): Generator<FilterToken> {
		yield token;
	}

	/**
	 * Skips the passed token from an output token stream
	 */
	// eslint-disable-next-line require-yield
	protected*skip(_: FilterToken): Generator<FilterToken> {
		return undefined;
	}

	/**
	 * Passes the passed object token into an output token stream
	 * @param token
	 */
	protected*passObject(token: FilterToken): Generator<FilterToken> {
		switch (token.name) {
			case 'startObject':
			case 'startArray':
				this.depth++;
				break;

			case 'endObject':
			case 'endArray':
				this.depth--;
				break;

			default:
				// Do nothing
		}

		if (this.depth === 0 && !this.multiple) {
			yield {...token, filterComplete: true};

		} else {
			yield token;
		}

		if (this.depth === 0) {
			this.processToken = this.multiple ? this.check : this.skip;
		}
	}

	/**
	 * Skips the passed object token from an output token stream
	 * @param chunk
	 */
	protected skipObject(chunk: FilterToken): void {
		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
				this.depth++;
				break;

			case 'endObject':
			case 'endArray':
				this.depth--;
				break;

			default:
				// Do nothing
		}

		if (this.depth === 0) {
			this.processToken = this.multiple ? this.check : this.pass;
		}
	}

	/**
	 * Creates a function to pass tokens into an output token stream
	 *
	 * @param currentToken
	 * @param expectedToken
	 */
	protected passValue(currentToken: TokenName, expectedToken: TokenName): TokenProcessorFn<FilterToken> {
		const that = this;

		return function* passValue(token: FilterToken) {
			if (that.expectedToken === undefined || that.expectedToken === '') {
				yield token;

				if (token.name === currentToken) {
					// eslint-disable-next-line require-atomic-updates
					that.expectedToken = expectedToken;
				}

			} else {
				const
					{expectedToken} = that;

				that.expectedToken = '';

				that.processToken = that.multiple ? that.check : that.skip;

				if (expectedToken === token.name) {
					if (that.multiple) {
						yield token;

					} else {
						yield {...token, filterComplete: true};
					}

				} else {
					yield* that.processToken(token);
				}
			}
		};
	}

	/**
	 * Creates a function to skip tokens from an output token stream
	 *
	 * @param currentToken
	 * @param expectedToken
	 */
	protected skipValue(currentToken: TokenName, expectedToken: TokenName): TokenProcessorFn<FilterToken> {
		const that = this;

		return function* skipValue(chunk: FilterToken): Generator<FilterToken> {
			if (that.expectedToken != null) {
				const
					{expectedToken} = that;

				that.expectedToken = '';

				that.processToken = that.multiple ? that.check : that.pass;

				if (expectedToken !== chunk.name) {
					yield* that.processToken(chunk);
				}

			} else if (chunk.name === currentToken) {
				that.expectedToken = expectedToken;
			}
		};
	}
}
