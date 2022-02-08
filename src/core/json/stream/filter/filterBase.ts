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

import type { JsonToken } from 'core/json/stream/interface';

export interface FilterBaseOptions {
	filter?: ((stack: FilterStack, chunk: JsonToken) => boolean) | RegExp | string;
	once?: boolean;
}

type FilterStack = Array<JsonToken['value'] | null>;

type ProcessFunction = (chunk: JsonToken) => Generator<JsonToken>;

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

	protected abstract _checkChunk(chunk: JsonToken): Generator<boolean | JsonToken>;
	protected _stack: FilterStack = [];
	protected _depth: number = 0;
	protected readonly _once?: boolean;
	protected _filter!: (stack: FilterStack, chunk: JsonToken) => boolean;

	protected readonly _passNumber: ProcessFunction = this.passValue('endNumber', 'numberValue');
	protected readonly _passString: ProcessFunction = this.passValue('endString', 'stringValue');
	protected readonly _passKey: ProcessFunction = this.passValue('endKey', 'keyValue');

	protected readonly _skipNumber: ProcessFunction = this.skipValue('endNumber', 'numberValue');
	protected readonly _skipString: ProcessFunction = this.skipValue('endString', 'stringValue');
	protected readonly _skipKey: ProcessFunction = this.skipValue('endKey', 'keyValue');

	private _previousToken: string = '';
	private readonly _separator: string = '.';
	private _expected?: string;

	constructor(options: FilterBaseOptions = {}) {
		this.processChunk = this._check;

		const {filter} = options;

		if (Object.isString(filter)) {
			this._filter = FilterBase.stringFilter(filter, this._separator);

		} else if (Object.isFunction(filter)) {
			this._filter = filter;

		} else if (Object.isRegExp(filter)) {
			this._filter = FilterBase.regExpFilter(filter, this._separator);
		}

		this._once = options.once;
	}

	*_check(chunk: JsonToken): Generator<JsonToken> {
		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
			case 'startString':
			case 'startNumber':
			case 'nullValue':
			case 'trueValue':
			case 'falseValue':
				if (Object.isNumber(this._stack[this._stack.length - 1])) {
					// Array
					++(<number>this._stack[this._stack.length - 1]);
				}

				break;

			case 'keyValue':
				this._stack[this._stack.length - 1] = chunk.value;
				break;

			case 'numberValue':
				if (this._previousToken !== 'endNumber' && Object.isNumber(this._stack[this._stack.length - 1])) {
					// Array
					++(<number>this._stack[this._stack.length - 1]);
				}

				break;

			case 'stringValue':
				if (this._previousToken !== 'endString' && Object.isNumber(this._stack[this._stack.length - 1])) {
					// Array
					++(<number>this._stack[this._stack.length - 1]);
				}

				break;
		}

		this._previousToken = chunk.name;

		const iter = this._checkChunk(chunk);
		while (true) {
			const val = iter.next();

			if (val.done && val.value === true) {
				break;

			} else if (val.done && val.value === false) {
				switch (chunk.name) {
					case 'startObject':
						this._stack.push(null);
						break;
					case 'startArray':
						this._stack.push(-1);
						break;
					case 'endObject':
					case 'endArray':
						this._stack.pop();
						break;
				}

				break;

			} else {
				yield val.value;
			}
		}
	}

	*_passObject(chunk: JsonToken): Generator<JsonToken> {
		yield chunk;

		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
				++this._depth;
				break;

			case 'endObject':
			case 'endArray':
				--this._depth;
				break;
		}

		if (this._depth === 0 && !this._once) {
			this.processChunk = this._check;
		}
	}

	*_pass(chunk: JsonToken): Generator<JsonToken> {
		yield chunk;
	}

	_skipObject(chunk: JsonToken): void {
		switch (chunk.name) {
			case 'startObject':
			case 'startArray':
				++this._depth;
				break;

			case 'endObject':
			case 'endArray':
				--this._depth;
				break;
		}

		if (this._depth !== 0) {
			this.processChunk = this._once ? this._pass : this._check;
		}
	}

	passValue(last: string, post: string): (chunk: JsonToken) => Generator<JsonToken> {
		const that = this;

		return function* passValue(chunk: JsonToken) {
			if (that._expected === undefined || that._expected === '') {
				yield chunk;

				if (chunk.name === last) {
					that._expected = post;
				}

			} else {
				const expected = that._expected;
				that._expected = '';

				if (!that._once) {
					that.processChunk = that._check;
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
			if (that._expected != null) {
				const expected = that._expected;
				that._expected = '';
				that.processChunk = that._once ? that._pass : that._check;

				if (expected !== chunk.name) {
					yield* that.processChunk(chunk);
				}

			} else if (chunk.name === last) {
					that._expected = post;
				}
		};
	}
}
