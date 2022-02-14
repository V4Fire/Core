/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import symbolGenerator from 'core/symbol';

import type { Token, TokenName } from 'core/json/stream/interface';
import type { TokenProcessor, TokenFilter, FilterStack, FilterOptions } from 'core/json/stream/filters/interface';

export const
	$$ = symbolGenerator();

export default abstract class AbstractFilter {
	/**
	 * Creates a function to filter only chunks by the specified path
	 *
	 * @param path
	 * @example
	 * ```js
	 * const filter = createPathFilter('foo.bla.bar');
	 * ```
	 */
	static createPathFilter(path: string): TokenFilter {
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
	static createRegExpFilter(rgxp: RegExp): TokenFilter {
		return (stack) => rgxp.test(stack.join('.'));
	}

	/**
	 * Processes the passed JSON token and yields tokens
	 */
	get processToken(): TokenProcessor {
		return this[$$.processChunk];
	}

	/**
	 * Sets a new process function the passed JSON chunk and yields tokens
	 */
	set processToken(val: TokenProcessor) {
		this[$$.processChunk] = val;
	}

	/**
	 * If true the filtration will return all matched filter results, otherwise only the first match will be returned
	 */
	readonly multiple: boolean = false;

	/**
	 * Checks that specified token is matched for the filter
	 * @param chunk
	 */
	protected abstract checkToken(chunk: Token): Generator<boolean | Token>;

	/**
	 * Stack of processed tokens
	 */
	protected stack: FilterStack = [];

	/**
	 * Depth of the current structure
	 */
	protected depth: number = 0;

	/**
	 * Function to filter a sequence of parsed tokens
	 *
	 * @param stack
	 * @param chunk
	 */
	protected filter: TokenFilter;

	/**
	 * Method to pass numeric tokens
	 */
	protected readonly passNumber: TokenProcessor = this.passValue('endNumber', 'numberValue');

	/**
	 * Method to skip numeric tokens
	 */
	protected readonly skipNumber: TokenProcessor = this.skipValue('endNumber', 'numberValue');

	/**
	 * Method to pass string tokens
	 */
	protected readonly passString: TokenProcessor = this.passValue('endString', 'stringValue');

	/**
	 * Method to skip string tokens
	 */
	protected readonly skipString: TokenProcessor = this.skipValue('endString', 'stringValue');

	/**
	 * Method to pass key tokens
	 */
	protected readonly passKey: TokenProcessor = this.passValue('endKey', 'keyValue');

	/**
	 * Method to skip key tokens
	 */
	protected readonly skipKey: TokenProcessor = this.skipValue('endKey', 'keyValue');

	/**
	 * Name of the previous parsed token
	 */
	protected previousToken: TokenName = '';

	/**
	 * Name of the next expected token from a stream
	 */
	protected expectedToken?: TokenName;

	protected constructor(filter: TokenFilter, opts: FilterOptions = {}) {
		// eslint-disable-next-line @typescript-eslint/unbound-method
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
	*syncStack(): Generator<Token> {
		return undefined;
	}

	/**
	 * Check the specified token for filter satisfaction
	 * @param token
	 */
	protected*check(token: Token): Generator<Token> {
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
	protected*pass(token: Token): Generator<Token> {
		yield token;
	}

	/**
	 * Skips the passed token from an output token stream
	 */
	// eslint-disable-next-line require-yield
	protected*skip(_: Token): Generator<Token> {
		return undefined;
	}

	/**
	 * Passes the passed object token into an output token stream
	 * @param token
	 */
	protected*passObject(token: Token): Generator<Token> {
		yield token;

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

		if (this.depth === 0) {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			this.processToken = this.multiple ? this.check : this.skip;
		}
	}

	/**
	 * Skips the passed object token from an output token stream
	 * @param chunk
	 */
	protected skipObject(chunk: Token): void {
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
			// eslint-disable-next-line @typescript-eslint/unbound-method
			this.processToken = this.multiple ? this.check : this.pass;
		}
	}

	/**
	 * Creates a function to pass tokens into an output token stream
	 *
	 * @param currentToken
	 * @param expectedToken
	 */
	protected passValue(currentToken: TokenName, expectedToken: TokenName): TokenProcessor {
		const that = this;

		return function* passValue(chunk: Token) {
			if (that.expectedToken === undefined || that.expectedToken === '') {
				yield chunk;

				if (chunk.name === currentToken) {
					// eslint-disable-next-line require-atomic-updates
					that.expectedToken = expectedToken;
				}

			} else {
				const
					{expectedToken} = that;

				that.expectedToken = '';

				// eslint-disable-next-line @typescript-eslint/unbound-method
				that.processToken = that.multiple ? that.check : that.skip;

				if (expectedToken === chunk.name) {
					yield chunk;

				} else {
					yield* that.processToken(chunk);
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
	protected skipValue(currentToken: TokenName, expectedToken: TokenName): TokenProcessor {
		const that = this;

		return function* skipValue(chunk: Token): Generator<Token> {
			if (that.expectedToken != null) {
				const
					{expectedToken} = that;

				that.expectedToken = '';

				// eslint-disable-next-line @typescript-eslint/unbound-method
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
