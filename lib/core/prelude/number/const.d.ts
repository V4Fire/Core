/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare const formatCache: Dictionary<Intl.NumberFormat>;
export declare const decPartRgxp: RegExp;
export declare const globalFormatOpts: Pick<{
    init: boolean;
    decimal: string;
    thousands: string;
}, "decimal" | "init" | "thousands">;
export declare const formatAliases: Pick<{
    $: string;
    $d: string;
    '%': string;
    '.': string;
}, "." | "$" | "$d" | "%">;
export declare const boolAliases: Pick<{
    '+': boolean;
    '-': boolean;
}, "-" | "+">;
export declare const defaultFormats: Pick<Intl.NumberFormatOptions, keyof Intl.NumberFormatOptions>;
