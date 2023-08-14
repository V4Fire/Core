/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare const formatCache: Dictionary<Intl.DateTimeFormat>;
export declare const dateChunkRgxp: RegExp, timeChunkRgxp: RegExp, zoneChunkRgxp: RegExp;
export declare const normalizeDateChunkRgxp: RegExp, normalizeZoneRgxp: RegExp;
export declare const isDateStr: RegExp, isFloatStr: RegExp;
export declare const createAliases: Pick<{
    now: () => Date;
    today: () => Date;
    yesterday: () => Date;
    tomorrow: () => Date;
}, "now" | "today" | "yesterday" | "tomorrow">;
export declare const formatAliases: Pick<{
    e: string;
    Y: string;
    M: string;
    d: string;
    w: string;
    h: string;
    m: string;
    s: string;
    z: string;
}, "s" | "m" | "e" | "Y" | "M" | "d" | "w" | "h" | "z">;
export declare const boolAliases: Pick<{
    '+': boolean;
    '-': boolean;
}, "-" | "+">;
export declare const defaultFormats: Pick<Intl.DateTimeFormatOptions, keyof Intl.DateTimeFormatOptions>;
