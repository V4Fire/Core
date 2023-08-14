/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { FilterOptions } from '../../../core/json/stream/filters';
export interface AndPickOptions extends FilterOptions {
    /**
     * A type of parsed structure in which the picking takes place
     *
     * @default `'object'`
     *
     * @example
     * ```js
     * const tokens = intoIter(from(JSON.stringify([
     *   {user: 'Bob', age: 21},
     *   {user: 'Ben', age: 24},
     *   {user: 'Rob', age: 28}
     * ])));
     *
     * const seq = sequence(
     *   assemble(pick(tokens, '0')),
     *
     *   // 1 refers to `{user: ‘Rob’, age: 28}` because `{user: ‘Bob’, age: 21}` is already picked previously,
     *   // i.e. selector tight to the previous
     *   assemble(andPick(tokens, '1', {from: 'array'}))
     * );
     *
     * for await (const val of seq) {
     *   // {user: 'Bob', age: 21}
     *   // {user: 'Rob', age: 28}
     *   console.log(val);
     * }
     * ```
     */
    from?: 'object' | 'array';
}
