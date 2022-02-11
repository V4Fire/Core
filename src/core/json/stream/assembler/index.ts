/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { JsonToken, AssemblerOptions, AssemblerItem, AssemblerKey } from 'core/json/stream/interface';

export class Assembler {
	/**
	 * Handler for processing start of an object
	 */
	startObject: () => void = this.baseStartObject(Object);

	/**
	 * Handler for processing start of an array
	 */
	startArray: () => void = this.baseStartObject(Array);

	/**
	 * Handler for processing a string value
	 *
	 * @param value
	 */
	stringValue: (value: string) => void = this.saveValue;

	/**
	 * Handler for processing end of array
	 */
	endArray: () => void = this.endObject;

	/**
	 * The current object is being assembled
	 * If it is an array, new subobjects will be added to it
	 * If it is an object, new properties will be added to it
	 * Otherwise, it can be one of primitive value
	 */
	current: AssemblerItem = null;

	/**
	 * A string for a property key
	 * used to keep a property name until
	 * a corresponding subobject is assembled
	 */
	key: AssemblerKey = null;

	/**
	 * An array of parent objects for an object in current
	 */
	protected stack: AssemblerItem[] = [];

	/**
	 * Indicates that a current object is fully assembled
	 */
	protected done: boolean = true;

	/**
	 * Function for transform values after assembling
	 * identical to reviver from JSON.parse
	 *
	 * @param key
	 * @param value
	 */
	protected readonly reviver!: ((key: string, value?: AssemblerItem) => any);

	constructor(options?: AssemblerOptions) {
		if (options) {
			if (Object.isFunction(options.reviver)) {
				this.reviver = options.reviver;
				this.stringValue = this.saveValueWithReviver;
				this.saveValue = this.saveValueWithReviver;
			}

			if (options.numberAsString) {
				this.numberValue = this.stringValue;
			}
		}
	}

	/**
	 * Returns a current object depth
	 */
	get depth(): number {
		// eslint-disable-next-line no-bitwise
		return (this.stack.length >> 1) + (this.done ? 0 : 1);
	}

	/**
	 * Returns a current stack
	 */
	get path(): Array<string | number | boolean | object> {
		const path: Array<string | number | boolean | object> = [];

		for (let i = 0; i < this.stack.length; i += 2) {
			const key = this.stack[i + 1];
			const val = key == null ? (<string>this.stack[i]).length : key;
			path.push(val);
		}

		return path;
	}

	/**
	 * Change current level of assembling process
	 *
	 * @param level
	 */
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

	/**
	 * Assemble piece of data
	 *
	 * @param chunk
	 */
	*processChunk(chunk: JsonToken): Generator<AssemblerItem> {
		this[chunk.name]?.(chunk.value);

    if (this.done) {
			yield this.current;
		}
	}

	/**
	 * Handler for processing object key value
	 *
	 * @param value
	 */
	keyValue(value: string): void {
		this.key = value;
	}

	/**
	 * Handler for processing number value
	 *
	 * @param value
	 */
	numberValue(value: string): void {
		this.saveValue(parseFloat(value));
	}

	/**
	 * Handler for processing null value
	 */
	nullValue(): void {
		this.saveValue(null);
	}

	/**
	 * Handler for processing true boolean value
	 */
	trueValue(): void {
		this.saveValue(true);
	}

	/**
	 * Handler for processing false boolean value
	 */
	falseValue(): void {
		this.saveValue(false);
	}

	/**
	 * Handler for processing end of object
	 */
	endObject(): void {
		if (this.stack.length > 0) {
			const value = this.current;
			this.key = <AssemblerKey>this.stack.pop();
			this.current = this.stack.pop()!;
			this.saveValue(value);

		} else {
			this.done = true;
		}
	}

	/**
	 * Save assembled value into internal storage
	 *
	 * @param value
	 */
	saveValue(value: AssemblerItem): void {
		if (this.done) {
			this.current = value;

		} else if (Object.isArray(this.current)) {
			this.current.push(value);

		} else {
			this.current![this.key!] = value;
			this.key = null;
		}
	}

	/**
	 * Save assembled value into
	 * internal storage with custom reviver
	 *
	 * @param value
	 */
	saveValueWithReviver(value?: AssemblerItem): void {
		if (this.done) {
			this.current = this.reviver('', value);

		} else if (Object.isArray(this.current)) {
			value = this.reviver(this.current.length.toString(), value);
			this.current.push(value!);

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

	/**
	 * Function constructor for creating
	 * handlers of start complex values (object or array)
	 *
	 * @param Type
	 */
	baseStartObject(Type: ObjectConstructor | ArrayConstructor) {
		return (): void => {
			if (this.done) {
				this.done = false;

			} else {
				this.stack.push(this.current, this.key);
			}

			this.current = <AssemblerItem>new Type();
			this.key = null;
		};
	}
}
