/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type LangPacs = {
	[key in Language]?: KeysetTranslations;
};

export type Translation = string | PluralTranslation;

export interface PluralTranslation {
	one: string;
	two?: string;
	few?: string;
	many?: string;
	zero?: string;
	other?: string;
}

export type Translations = Dictionary<Translation>;

export type KeysetTranslations = Dictionary<Translations>;
