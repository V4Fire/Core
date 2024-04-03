/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Token } from '../../../../core/json/stream/parser';
import type { AssemblerOptions } from '../../../../core/json/stream/assembler';
import Streamer, { StreamedObject } from '../../../../core/json/stream/streamers/interface';
export default class StreamObject<T = unknown> extends Streamer<StreamedObject<T>> {
    /**
     * Last key of the current streamed object property
     */
    protected key: string | null;
    constructor(opts?: AssemblerOptions);
    /** @inheritDoc */
    protected checkToken(chunk: Token): boolean;
    /** @inheritDoc */
    protected push(): Generator<StreamedObject<T>>;
}
