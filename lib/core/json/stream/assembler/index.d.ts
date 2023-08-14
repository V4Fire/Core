/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Token, TokenProcessor } from '../../../../core/json/stream/parser';
import type { AssemblerOptions } from '../../../../core/json/stream/assembler/interface';
export * from '../../../../core/json/stream/assembler/interface';
export declare const $$: StrictDictionary<symbol>;
export default class Assembler<T = unknown> implements TokenProcessor<T> {
    /**
     * Property key of the active assembling value
     */
    key: string | null;
    /**
     * A value of the active assembled item.
     * If it is a container (object or array), all new assembled values will be added to it.
     */
    value: unknown;
    /**
     * Indicates that the active value is fully assembled
     */
    get isValueAssembled(): boolean;
    /**
     * Sets the value assembling status
     * @param value
     */
    protected set isValueAssembled(value: boolean);
    /**
     * Depth of the assembling structure
     */
    get depth(): number;
    /**
     * Stack of nested assembled items and keys contained within the active assembling value
     */
    protected stack: unknown[];
    /**
     * Handler to process an object start
     */
    protected startObject: AnyFunction;
    /**
     * Handler to process an array start
     */
    protected startArray: AnyFunction;
    /**
     * Function to transform a value after assembling.
     * Its API is identical to the reviver from `JSON.parse`.
     *
     * @param key
     * @param value
     */
    protected readonly reviver?: JSONCb;
    /**
     * @param [opts] - additional options
     */
    constructor(opts?: AssemblerOptions);
    /**
     * Processes the passed JSON token and yields the assembled values
     */
    processToken(chunk: Token): Generator<T>;
    /**
     * Creates a handler to process starting of an object or array
     * @param Constr - constructor to create a structure
     */
    protected createStartObjectHandler(Constr: ObjectConstructor | ArrayConstructor): AnyFunction;
    /**
     * Handler to process an object key value
     * @param value
     */
    protected keyValue(value: string): void;
    /**
     * Handler to process a string value
     * @param value
     */
    protected stringValue(value: string): void;
    /**
     * Handler to process a number value
     * @param value
     */
    protected numberValue(value: string): void;
    /**
     * Handler to process nullish values
     */
    protected nullValue(): void;
    /**
     * Handler to process a truly boolean value
     */
    protected trueValue(): void;
    /**
     * Handler to process a falsy boolean value
     */
    protected falseValue(): void;
    /**
     * Handler to process an object end
     */
    protected endObject(): void;
    /**
     * Handler to process an array end
     */
    protected endArray(): void;
    /**
     * Handler to process ending of primitive values
     */
    protected endPrimitive(): void;
    /**
     * Saves an assembled value into the internal structure
     * @param value
     */
    protected saveValue(value: unknown): void;
}
