/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Token } from '../../../../core/json/stream/parser';
import type { AssemblerOptions } from '../../../../core/json/stream/assembler';
import Streamer, { StreamedArray } from '../../../../core/json/stream/streamers/interface';
export default class ArrayStreamer<T = unknown> extends Streamer<StreamedArray<T>> {
    /**
     * Index of the current streamed array element
     */
    protected index: number;
    constructor(opts?: AssemblerOptions);
    /** @inheritDoc */
    protected checkToken(chunk: Token): boolean;
    /** @inheritDoc */
    protected push(): Generator<StreamedArray<T>>;
}
