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

export interface AssemblerOptions {
	reviver?(key: string, value: any): any;
	numberAsString?: boolean;
}

type AssemblerItem = string | number | boolean | object | any[] | null;
type AssemblerKey = string | null;

export class Assembler {
	startObject: () => void = this.baseStartObject(Object);
	startArray: () => void = this.baseStartObject(Array);
	stringValue: (value: string) => void = this._saveValue;
	endArray: () => void = this.endObject;

	current: AssemblerItem = null;
	key: AssemblerKey = null;

	private stack: AssemblerItem[] = [];
	private done: boolean = true;
	private readonly reviver!: ((key: string, value: any) => any);

	constructor(options?: AssemblerOptions) {
		if (options) {

			if (Object.isFunction(options.reviver)) {
				this.reviver = options.reviver;
				this.stringValue = this._saveValueWithReviver;
				this._saveValue = this._saveValueWithReviver;
			}

			if (options.numberAsString) {
				this.numberValue = this.stringValue;
			}
		}
	}

	get depth(): number {
		// eslint-disable-next-line no-bitwise
		return (this.stack.length >> 1) + (this.done ? 0 : 1);
	}

	get path(): Array<string | number | boolean | object> {
		const path: Array<string | number | boolean | object> = [];

		for (let i = 0; i < this.stack.length; i += 2) {
			const key = this.stack[i + 1];
			const val = key == null ? (<string>this.stack[i]).length : key;
			path.push(val);
		}

		return path;
	}

	dropToLevel(level: number): this {
		if (level < this.depth) {
			if (level > 0) {
				// eslint-disable-next-line no-bitwise
				const index = (level - 1) << 1;
				this.current = this.stack[index];
				this.key = <AssemblerKey>this.stack[index + 1];
				this.stack.splice(index);

			} else {
				this.stack = [];
				this.current = null;
				this.key = null;
				this.done = true;
			}
		}

		return this;
	}

	*processChunk(chunk: JsonToken): Generator<any> {
		this[chunk.name]?.(chunk.value);

    if (this.done) {
			yield this.current;
		}
	}

	keyValue(value: string): void {
		this.key = value;
	}

	numberValue(value: string): void {
		this._saveValue(parseFloat(value));
	}

	nullValue(): void {
		this._saveValue(null);
	}

	trueValue(): void {
		this._saveValue(true);
	}

	falseValue(): void {
		this._saveValue(false);
	}

	endObject(): void {
		if (this.stack.length > 0) {
			const value = this.current;
			this.key = <AssemblerKey>this.stack.pop();
			this.current = this.stack.pop()!;
			this._saveValue(value);

		} else {
			this.done = true;
		}
	}

	_saveValue(value: AssemblerItem): void {
		if (this.done) {
			this.current = value;

		} else if (Object.isArray(this.current)) {
			this.current.push(value);

		} else {
			this.current![this.key!] = value;
			this.key = null;
		}
	}

	_saveValueWithReviver(value?: AssemblerItem): void {
		if (this.done) {
			this.current = this.reviver('', value);

		} else if (Object.isArray(this.current)) {
			value = this.reviver(this.current.length.toString(), value);
			this.current.push(value);

			if (value === undefined) {
				delete this.current[this.current.length - 1];
			}

		} else {
			value = this.reviver(this.key!, value);

			if (value !== undefined) {
				this.current![this.key!] = value;
			}

			this.key = null;
		}
	}

	baseStartObject(Type: ObjectConstructor | ArrayConstructor) {
		return (): void => {
			if (this.done) {
				this.done = false;

			} else {
				this.stack.push(this.current, this.key);
			}

			this.current = new Type();
			this.key = null;
		};
	}
}
