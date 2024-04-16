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
export declare type PluralTranslation = [one: string, some: string, many: string, none: string];
export declare type Translations = Dictionary<Translation>;
export declare type KeysetTranslations = Dictionary<Translations>;
