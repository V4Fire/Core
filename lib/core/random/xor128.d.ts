/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare class Xor128 implements IterableIterator<number> {
    protected x: number;
    protected y: number;
    protected z: number;
    protected w: number;
    constructor(seed: number);
    [Symbol.iterator](): IterableIterator<number>;
    next(): IteratorResult<number>;
}
export default function random(): number;
