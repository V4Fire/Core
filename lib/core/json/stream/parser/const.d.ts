/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare const MAX_PATTERN_SIZE = 16, PARSING_COMPLETE: unique symbol;
export declare const parserStates: {};
export declare const parserPatterns: {
    value1: RegExp;
    string: RegExp;
    key1: RegExp;
    colon: RegExp;
    comma: RegExp;
    ws: RegExp;
    numberStart: RegExp;
    numberFracStart: RegExp;
    numberExpStart: RegExp;
    numberDigit: RegExp;
    numberFracDigit: RegExp;
    numberExpDigit: RegExp;
    numberFraction: RegExp;
    numberExponent: RegExp;
    numberExpSign: RegExp;
};
export declare const parserStateTypes: {
    readonly VALUE: "value";
    readonly VALUE1: "value1";
    readonly STRING: "string";
    readonly OBJECT: "object";
    readonly KEY: "key";
    readonly KEY1: "key1";
    readonly ARRAY: "array";
    readonly KEY_VAL: "keyVal";
    readonly COLON: "colon";
    readonly OBJECT_STOP: "objectStop";
    readonly ARRAY_STOP: "arrayStop";
    readonly NUMBER_START: "numberStart";
    readonly NUMBER_FRACTION: "numberFraction";
    readonly NUMBER_FRACTION_START: "numberFracStart";
    readonly NUMBER_FRACTION_DIGIT: "numberFracDigit";
    readonly NUMBER_EXPONENT: "numberExponent";
    readonly NUMBER_DIGIT: "numberDigit";
    readonly NUMBER_EXP_SIGN: "numberExpSign";
    readonly NUMBER_EXP_START: "numberExpStart";
    readonly NUMBER_EXP_DIGIT: "numberExpDigit";
    readonly EMPTY: "";
    readonly DONE: "done";
};
export declare const parserExpected: {
    object: "objectStop";
    array: "arrayStop";
    "": "done";
};
export declare const parserCharCodes: {
    b: string;
    f: string;
    n: string;
    r: string;
    t: string;
    '"': string;
    '\\': string;
    '/': string;
};
