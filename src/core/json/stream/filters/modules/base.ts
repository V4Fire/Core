/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { JsonToken, FilterStack, ProcessFunction, FilterBaseOptions } from 'core/json/stream/interface';

/* eslint-disable default-case */
export abstract class FilterBase {
	/**
	 * Create string filter
	 *
	 * @param str
	 * @param separator
	 */
	static stringFilter(str: string, separator: string) {
		return (stack: FilterStack): boolean => {
			const path = stack.join(separator);

			return (path.length === str.length && path === str) ||
				(path.length > str.length &&
					path.startsWith(str) &&
					path.substring(str.length, str.length + separator.length) === separator);
		};
	}

	/**
	 * Create regExp filter
	 *
	 * @param str
	 * @param separator
	 */
	static regExpFilter(regExp: RegExp, separator: string) {
		return (stack: FilterStack): boolean => regExp.test(stack.join(separator));
	}

	/**
	 * Current chunks process method
	 */
	public processChunk: (chunk: JsonToken) => Generator<JsonToken>;

	/**
	 * Method for check chunk filter matching
	 */
	protected abstract checkChunk(chunk: JsonToken): Generator<boolean | JsonToken>;

	/**
	 * Stack of processed tokens
	 */
	protected stack: FilterStack = [];

	/**
	 * Depth of current structure
	 */
	protected depth: number = 0;

	/**
	 * If true filtration will return all matched filter reults,
	 * otherwise only the first match will be returned
	 */
	protected multiple: boolean = false;

	/**
	 * Filter function from options
	 */
	protected filter!: (stack: FilterStack, chunk: JsonToken) => boolean;

	/**
	 * Function for pass number
	 */
	protected readonly passNumber: ProcessFunction = this.passValue('endNumber', 'numberValue');

	/**
	 * Function for pass string
	 */
	protected readonly passString: ProcessFunction = this.passValue('endString', 'stringValue');

	/**
	 * Function for pass key
	 */
	protected readonly passKey: ProcessFunction = this.passValue('endKey', 'keyValue');

	/**
	 * Function for skip number
	 */
	protected readonly skipNumber: ProcessFunction = this.skipValue('endNumber', 'numberValue');

	/**
	 * Function for skip string
	 */
	protected readonly skipString: ProcessFunction = this.skipValue('endString', 'stringValue');

	/**
	 * Function for skip key
	 */
	protected readonly skipKey: ProcessFunction = this.skipValue('endKey', 'keyValue');

	/**
	 * Previous token in stream
	 */
	protected previousToken: string = '';

	/**
	 * Separator for stack
	 */
	protected readonly separator: string = '.';

	/**
	 * Next expected token
	 */
	protected expected?: string;

	constructor(options: FilterBaseOptions = {}) {
		this.processChunk = this.check;

		const {filter, multiple} = options;

		if (Object.isString(filter)) {
			this.filter = FilterBase.stringFilter(filter, this.separator);

		} else if (Object.isFunction(filter)) {
			this.filter = filter;

		} else if (Object.isRegExp(filter)) {
			this.filter = FilterBase.regExpFilter(filter, this.separator);
		}

		if (multiple) {
			this.multiple = multiple;
		}
	}

	/**
	 * Check current chunk token for filter satisfaction
	 *
	 * @param chunk
	 */
	*check(chunk: JsonToken): Generator<JsonToken> {
		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
			case 'startString':
			case 'startNumber':
			case 'nullValue':
			case 'trueValue':
			case 'falseValue':
				if (Object.isNumber(this.stack[this.stack.length - 1])) {
					// Array
					(<number>this.stack[this.stack.length - 1])++;
				}

				break;

			case 'keyValue':
				this.stack[this.stack.length - 1] = chunk.value;
				break;

			case 'numberValue':
				if (this.previousToken !== 'endNumber' && Object.isNumber(this.stack[this.stack.length - 1])) {
					// Array
					(<number>this.stack[this.stack.length - 1])++;
				}

				break;

			case 'stringValue':
				if (this.previousToken !== 'endString' && Object.isNumber(this.stack[this.stack.length - 1])) {
					// Array
					(<number>this.stack[this.stack.length - 1])++;
				}

				break;
		}

		this.previousToken = chunk.name;

		const iter = this.checkChunk(chunk);
		while (true) {
			const val = iter.next();
			const {done, value} = val;

			if (done && (value === true || value === undefined)) {
				break;

			} else if (done && value === false) {
				switch (chunk.name) {
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
				}

				break;

			} else {
				yield value;
			}
		}
	}

	/**
	 * Pass entire object entity in token stream
	 *
	 * @param chunk
	 */
	*passObject(chunk: JsonToken): Generator<JsonToken> {
		yield chunk;

		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
				this.depth++;
				break;

			case 'endObject':
			case 'endArray':
				this.depth--;
				break;
		}

		if (this.depth === 0) {
			this.processChunk = this.multiple ? this.check : this.skip;
		}
	}

	/**
	 * Pass one token in token stream
	 *
	 * @param chunk
	 */
	*pass(chunk: JsonToken): Generator<JsonToken> {
		yield chunk;
	}

	/**
	 * Skip entire object in token stream
	 *
	 * @param chunk
	 */
	skipObject(chunk: JsonToken): void {
		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
				this.depth++;
				break;

			case 'endObject':
			case 'endArray':
				--this.depth;
				break;
		}

		if (this.depth === 0) {
			this.processChunk = this.multiple ? this.check : this.pass;
		}
	}

	/**
	 * Skip all tokens
	 *
	 * @param chunk
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	*skip(): Generator<JsonToken> {}

	/**
	 * Function constructor for creating pass functions for primitives
	 *
	 * @param last
	 * @param post
	 */
	passValue(last: string, post: string): (chunk: JsonToken) => Generator<JsonToken> {
		const that = this;

		return function* passValue(chunk: JsonToken) {
			if (that.expected === undefined || that.expected === '') {
				yield chunk;

				if (chunk.name === last) {
					that.expected = post;
				}

			} else {
				const {expected} = that;
				that.expected = '';

				that.processChunk = that.multiple ? that.check : that.skip;

				if (expected === chunk.name) {
					yield chunk;

				} else {
					yield* that.processChunk(chunk);
				}
			}
		};
	}

	/**
	 * Function constructor for creating skip functions for primitives
	 *
	 * @param last
	 * @param post
	 */
	skipValue(last: string, post: string): (chunk: JsonToken) => Generator<JsonToken> {
		const that = this;

		return function* skipValue(chunk: JsonToken): Generator<JsonToken> {
			if (that.expected != null) {
				const {expected} = that;
				that.expected = '';
				that.processChunk = that.multiple ? that.check : that.pass;

				if (expected !== chunk.name) {
					yield* that.processChunk(chunk);
				}

			} else if (chunk.name === last) {
					that.expected = post;
				}
		};
	}
}
