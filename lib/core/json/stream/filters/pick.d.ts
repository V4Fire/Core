/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Token } from '../../../../core/json/stream/parser';
import Super from '../../../../core/json/stream/filters/abstract-filter';
import type { TokenFilter, FilterOptions } from '../../../../core/json/stream/filters/interface';
export default class Pick extends Super {
    constructor(filter: TokenFilter, opts?: FilterOptions);
    /** @inheritDoc */
    protected checkToken(chunk: Token): Generator<boolean | Token>;
}
