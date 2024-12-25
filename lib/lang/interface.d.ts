/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export declare type LangPacs = {
    [key in Language]?: KeysetTranslations;
};
export declare type Translation = string | PluralTranslation;
export interface PluralTranslation {
    one: string;
    two?: string;
    few?: string;
    many?: string;
    zero?: string;
    other?: string;
}
export declare type Translations = Dictionary<Translation>;
export declare type KeysetTranslations = Dictionary<Translations>;
