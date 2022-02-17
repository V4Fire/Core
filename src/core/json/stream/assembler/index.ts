/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Token, TokenProcessor } from 'core/json/stream/parser';

import type {

	AssembleReviver,
	AssemblerOptions,

	AssembleKey,
	AssembleValue

} from 'core/json/stream/assembler/interface';

export * from 'core/json/stream/assembler/interface';

export default class Assembler implements TokenProcessor<AssembleValue> {
	/**
	 * Property key of the active assembling value
	 */
	protected key: AssembleKey = null;

	/**
	 * A value of the active assembled item.
	 * If it is a container (object or array), all new assembled values will be added to it.
	 */
	protected value: AssembleValue = null;

	/**
	 * Indicates that the active value is fully assembled
	 */
	protected isValueAssembled: boolean = true;

	/**
	 * Stack of nested assembled items contained within the active assembling value
	 */
	protected stack: AssembleValue[] = [];

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
	protected readonly reviver?: AssembleReviver;

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
	*processToken(chunk: Token): Generator<AssembleValue> {
		this[chunk.name]?.(chunk.value);

		if (this.isValueAssembled) {
			yield this.value;
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

			} else {
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
		this.saveValue(value);
	}

	/**
	 * Handler to process a number value
	 * @param value
	 */
	protected numberValue(value: string): void {
		this.saveValue(parseFloat(value));
	}

	/**
	 * Handler to process nullish values
	 */
	protected nullValue(): void {
		this.saveValue(null);
	}

	/**
	 * Handler to process a truly boolean value
	 */
	protected trueValue(): void {
		this.saveValue(true);
	}

	/**
	 * Handler to process a falsy boolean value
	 */
	protected falseValue(): void {
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
	 * Saves an assembled item into the internal structure
	 * @param item
	 */
	protected saveValue(item: AssembleValue): void {
		if (this.isValueAssembled) {
			this.value = this.reviver?.('', item) ?? item;

		} else if (Object.isArray(this.value)) {
			const
				val = this.reviver?.(String(this.value.length), item) ?? item;

			if (val !== undefined) {
				this.value.push(val);
			}

		} else if (Object.isDictionary(this.value) && Object.isString(this.key)) {
			const
				val = this.reviver?.(this.key, item) ?? item;

			if (val !== undefined) {
				this.value[this.key] = val;
			}

			this.key = null;
		}
	}
}
