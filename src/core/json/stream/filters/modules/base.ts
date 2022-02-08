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

import type { JsonToken, FilterStack, ProcessFunction, FilterBaseOptions } from 'core/json/stream/interface';

/* eslint-disable default-case */
export abstract class FilterBase {
	static defaultReplacement: JsonToken[] = [{name: 'nullValue', value: null}];

	static stringFilter(str: string, separator: string) {
		return (stack: FilterStack): boolean => {
			const path = stack.join(separator);

			return (path.length === str.length && path === str) ||
				(path.length > str.length &&
					path.startsWith(str) &&
					path.substring(str.length, str.length + separator.length) === separator);
		};
	}

	static regExpFilter(regExp: RegExp, separator: string) {
		return (stack: FilterStack): boolean => regExp.test(stack.join(separator));
	}

	public processChunk: (chunk: JsonToken) => Generator<JsonToken>;

	protected abstract checkChunk(chunk: JsonToken): Generator<boolean | JsonToken>;
	protected stack: FilterStack = [];
	protected depth: number = 0;
	protected readonly once?: boolean;
	protected filter!: (stack: FilterStack, chunk: JsonToken) => boolean;

	protected readonly passNumber: ProcessFunction = this.passValue('endNumber', 'numberValue');
	protected readonly passString: ProcessFunction = this.passValue('endString', 'stringValue');
	protected readonly passKey: ProcessFunction = this.passValue('endKey', 'keyValue');

	protected readonly skipNumber: ProcessFunction = this.skipValue('endNumber', 'numberValue');
	protected readonly skipString: ProcessFunction = this.skipValue('endString', 'stringValue');
	protected readonly skipKey: ProcessFunction = this.skipValue('endKey', 'keyValue');

	protected previousToken: string = '';
	protected readonly separator: string = '.';
	protected expected?: string;

	constructor(options: FilterBaseOptions = {}) {
		this.processChunk = this.check;

		const {filter} = options;

		if (Object.isString(filter)) {
			this.filter = FilterBase.stringFilter(filter, this.separator);

		} else if (Object.isFunction(filter)) {
			this.filter = filter;

		} else if (Object.isRegExp(filter)) {
			this.filter = FilterBase.regExpFilter(filter, this.separator);
		}

		this.once = options.once;
	}

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

			if (val.done && val.value === true) {
				break;

			} else if (val.done && val.value === false) {
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
				yield val.value;
			}
		}
	}

	*passObject(chunk: JsonToken): Generator<JsonToken> {
		yield chunk;

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

		if (!this.depth && !this.once) {
			this.processChunk = this.check;
		}
	}

	*pass(chunk: JsonToken): Generator<JsonToken> {
		yield chunk;
	}

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

		if (!this.depth) {
			this.processChunk = this.once ? this.pass : this.check;
		}
	}

	passValue(last: string, post: string): (chunk: JsonToken) => Generator<JsonToken> {
		const that = this;

		return function* passValue(chunk: JsonToken) {
			if (that.expected === undefined || that.expected === '') {
				yield chunk;

				if (chunk.name === last) {
					that.expected = post;
				}

			} else {
				const expected = that.expected;
				that.expected = '';

				if (!that.once) {
					that.processChunk = that.check;
				}

				if (expected === chunk.name) {
					yield chunk;

				} else {
					yield* that.processChunk(chunk);
				}
			}
		};
	}

	skipValue(last: string, post: string): (chunk: JsonToken) => Generator<JsonToken> {
		const that = this;

		return function* skipValue(chunk: JsonToken): Generator<JsonToken> {
			if (that.expected != null) {
				const {expected} = that;
				that.expected = '';
				that.processChunk = that.once ? that.pass : that.check;

				if (expected !== chunk.name) {
					yield* that.processChunk(chunk);
				}

			} else if (chunk.name === last) {
					that.expected = post;
				}
		};
	}
}
