/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Token, TokenProcessor } from 'core/json/stream/parser';

import { NULL } from 'core/json/stream/assembler/const';
import type { AssemblerOptions } from 'core/json/stream/assembler/interface';

export * from 'core/json/stream/assembler/interface';

export default class Assembler<T = unknown> implements TokenProcessor<T> {
	/**
	 * A value of the active assembled item.
	 * If it is a container (object or array), all new assembled values will be added to it.
	 */
	value: unknown = NULL;

	/**
	 * Indicates that the active value is fully assembled
	 */
	isValueAssembled: boolean = false;

	/**
	 * Depth of the assembling structure
	 */
	get depth(): number {
		// To ignore keys from the stack divide length by two
		return (Math.floor(this.stack.length / 2)) + (this.isValueAssembled ? 0 : 1);
	}

	/**
	 * Property key of the active assembling value
	 */
	protected key: string | null = null;

	/**
	 * Stack of nested assembled items and keys contained within the active assembling value
	 */
	protected stack: unknown[] = [];

	/**
	 * Handler to process an object start
	 */
	protected startObject: AnyFunction = this.createStartObjectHandler(Object);

	/**
	 * Handler to process an array start
	 */
	protected startArray: AnyFunction = this.createStartObjectHandler(Array);

	/**
	 * Function to transform a value after assembling.
	 * Its API is identical to the reviver from `JSON.parse`.
	 *
	 * @param key
	 * @param value
	 */
	protected readonly reviver?: JSONCb;

	constructor(opts: AssemblerOptions = {}) {
		if (Object.isFunction(opts.reviver)) {
			this.reviver = opts.reviver;
		}

		if (opts.numberAsString) {
			// eslint-disable-next-line @typescript-eslint/unbound-method
			this.numberValue = this.stringValue;
		}
	}

	/**
	 * Processes the passed JSON token and yields the assembled value
	 */
	*processToken(chunk: Token): Generator<T> {
		this[chunk.name]?.(chunk.value);

		if (this.isValueAssembled) {
			yield Object.cast(this.value);
		}
	}

	/**
	 * Creates a handler to process starting of an object or array
	 * @param Constr - constructor to create a structure
	 */
	protected createStartObjectHandler(Constr: ObjectConstructor | ArrayConstructor): AnyFunction {
		return () => {
			if (this.isValueAssembled) {
				this.isValueAssembled = false;
			}

			if (this.value !== NULL) {
				this.stack.push(this.value, this.key);
			}

			this.value = Object.cast(new Constr());
			this.key = null;
		};
	}

	/**
	 * Handler to process an object key value
	 * @param value
	 */
	protected keyValue(value: string): void {
		this.key = value;
	}

	/**
	 * Handler to process a string value
	 * @param value
	 */
	protected stringValue(value: string): void {
		this.endPrimitive();
		this.saveValue(value);
	}

	/**
	 * Handler to process a number value
	 * @param value
	 */
	protected numberValue(value: string): void {
		this.endPrimitive();
		this.saveValue(parseFloat(value));
	}

	/**
	 * Handler to process nullish values
	 */
	protected nullValue(): void {
		this.endPrimitive();
		this.saveValue(null);
	}

	/**
	 * Handler to process a truly boolean value
	 */
	protected trueValue(): void {
		this.endPrimitive();
		this.saveValue(true);
	}

	/**
	 * Handler to process a falsy boolean value
	 */
	protected falseValue(): void {
		this.endPrimitive();
		this.saveValue(false);
	}

	/**
	 * Handler to process an object end
	 */
	protected endObject(): void {
		if (this.stack.length > 0) {
			const
				{value} = this;

			this.key = Object.cast(this.stack.pop());
			this.value = this.stack.pop() ?? null;
			this.saveValue(value);

		} else {
			this.isValueAssembled = true;
		}
	}

	/**
	 * Handler to process an array end
	 */
	protected endArray(): void {
		this.endObject();
	}

	/**
	 * Handler to process ending of primitive values
	 */
	protected endPrimitive(): void {
		if (this.value === NULL) {
			this.isValueAssembled = true;
		}
	}

	/**
	 * Saves an assembled value into the internal structure
	 * @param value
	 */
	protected saveValue(value: unknown): void {
		if (this.isValueAssembled) {
			this.value = this.reviver?.('', value) ?? value;

		} else if (Object.isArray(this.value)) {
			const
				val = this.reviver?.(String(this.value.length), value) ?? value;

			if (val !== undefined) {
				this.value.push(val);
			}

		} else if (Object.isDictionary(this.value) && Object.isString(this.key)) {
			const
				val = this.reviver?.(this.key, value) ?? value;

			if (val !== undefined) {
				this.value[this.key] = val;
			}

			this.key = null;
		}
	}
}
