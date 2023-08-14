/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import Assembler, { AssemblerOptions } from '../../../../core/json/stream/assembler';
import type { Token, TokenProcessor } from '../../../../core/json/stream/parser';
export interface StreamedArray<T = unknown> {
    index: number;
    value: T;
}
export interface StreamedObject<T = unknown> {
    key: string;
    value: T;
}
export default abstract class Streamer<T = unknown> implements TokenProcessor<T> {
    /**
     * Actual depth of the streamed structure
     */
    protected level: number;
    /**
     * Instance of a token assembler
     */
    protected assembler: Assembler;
    /**
     * True if the streamed structure is already checked
     */
    protected isChecked: boolean;
    /**
     * Checks that specified token is matched for the streamer type
     * @param token
     */
    protected abstract checkToken(token: Token): boolean;
    /**
     * Method to yield assembled tokens
     */
    protected abstract push(): Generator<T>;
    /**
     * @param [opts] - assembler options
     */
    protected constructor(opts?: AssemblerOptions);
    /**
     * Processes the passed JSON token and yields the assembled value
     */
    processToken(chunk: Token): Generator<T>;
}
