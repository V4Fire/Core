/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare type WarnExprType = 'api' | 'module' | 'constant' | 'function' | 'class' | 'component' | 'method' | 'property' | 'accessor';
export declare type WarnContext = 'warning' | 'deprecated' | 'unimplemented';
export interface WarnAlternativeOptions {
    /**
     * Name of an alternative function/method/etc.
     */
    name: string;
    /**
     * Source path of the alternative
     */
    source?: string;
}
export declare type WarnAlternative = string | WarnAlternativeOptions;
export interface WarnOptions {
    /**
     * Type of warn context
     * @type `'warning'`
     */
    context?: WarnContext;
    /**
     * Name of an expression to wrap
     */
    name?: string;
    /**
     * Type of expression to wrap
     */
    type?: WarnExprType;
    /**
     * Name of a function/method/etc. that need to use instead of the current
     * or an object with additional options of the alternative
     */
    alternative?: WarnAlternative;
    /**
     * Indicates that a function/method/etc. was renamed, but its interface still actual,
     * the value contains a name after renaming
     */
    renamedTo?: string;
    /**
     * Indicates that a function/method/etc. was moved to a different file, but its interface still actual,
     * the value contains a source path after moving
     */
    movedTo?: string;
    /**
     * Additional information
     */
    notice?: string;
}
export interface InlineWarnOptions extends WarnOptions {
    /** @see [[WarnOptions.name]] */
    name: string;
    /** @see [[WarnOptions.type]] */
    type: WarnExprType;
}
export interface WarnedFn<A extends unknown[] = [], R = unknown> {
    (...args: A): R;
    warning: WarnOptions | InlineWarnOptions;
    deprecated?: WarnOptions | InlineWarnOptions;
    unimplemented?: WarnOptions | InlineWarnOptions;
}
