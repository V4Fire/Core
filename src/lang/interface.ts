/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type TranslationPacs = {
	[key in Locale]?: KeysetTranslations;
};

export type Translation = string | PluralTranslation;

export type PluralTranslation = [one: string, some: string, many: string, none: string];

export type Translations = Dictionary<Translation>;

export type KeysetTranslations = Dictionary<Translations>;
