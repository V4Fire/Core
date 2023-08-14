/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
import type { Token } from '../../../../core/json/stream/parser';
import Super from '../../../../core/json/stream/filters/abstract-filter';
import type { TokenFilter, FilterStack } from '../../../../core/json/stream/filters/interface';
export default class Filter extends Super {
    readonly multiple: boolean;
    /**
     * Stack for the current object that is being filtered
     */
    protected objStack: FilterStack;
    constructor(filter: TokenFilter);
    finishTokenProcessing(): Generator<Token>;
    /** @inheritDoc */
    protected checkToken(chunk: Token): Generator<Token>;
}
