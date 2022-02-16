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
	AssembleItem

} from 'core/json/stream/assembler/interface';

export * from 'core/json/stream/assembler/interface';

export default class Assembler implements TokenProcessor<AssembleItem> {
	/**
	 * Property key of the active assembled item
	 */
	protected key: AssembleKey = null;

	/**
	 * A value of the active assembled item.
	 * If it is a container (object or array), all new assembled values will be added to it.
	 */
	protected item: AssembleItem = null;

	/**
	 * Indicates that the active item is fully assembled
	 */
	protected isItemDone: boolean = true;

	/**
	 * List of assembled parent items to the current
	 */
	protected stack: AssembleItem[] = [];

	/**
	 * Handler to process an object start
	 */
	protected startObject: AnyFunction = this.createStartObjectHandler(Object);

	/**
	 * Handler to process an array start
	 */
	protected startArray: AnyFunction = this.createStartObjectHandler(Array);

	/**
	 * Function for transform values after assembling
	 * identical to reviver from JSON.parse
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
	 * Assemble piece of data
	 *
	 * @param chunk
	 */
	*processToken(chunk: Token): Generator<AssembleItem> {
		this[chunk.name]?.(chunk.value);

		if (this.isItemDone) {
			yield this.item;
		}
	}

	/**
	 * Creates a handler to process starting of an object or array
	 * @param Constr - constructor to create a structure
	 */
	protected createStartObjectHandler(Constr: ObjectConstructor | ArrayConstructor): AnyFunction {
		return () => {
			if (this.isItemDone) {
				this.isItemDone = false;

			} else {
				this.stack.push(this.item, this.key);
			}

			this.item = Object.cast(new Constr());
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
				{item} = this;

			this.key = Object.cast(this.stack.pop());
			this.item = this.stack.pop() ?? null;

			this.saveValue(item);

		} else {
			this.isItemDone = true;
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
	protected saveValue(item: AssembleItem): void {
		if (this.isItemDone) {
			this.item = this.reviver?.('', item) ?? item;

		} else if (Object.isArray(this.item)) {
			const
				val = this.reviver?.(String(this.item.length), item) ?? item;

			if (val !== undefined) {
				this.item.push(val);
			}

		} else if (Object.isDictionary(this.item) && Object.isString(this.key)) {
			const
				val = this.reviver?.(this.key, item) ?? item;

			if (val !== undefined) {
				this.item[this.key] = val;
			}

			this.key = null;
		}
	}
}
