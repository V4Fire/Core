/**
 * Dictionary with all translations
 */
export type LangsDict = {
	[key in Language]?: TranslateDictionary;
};

/**
 * Translation format
 */
export type TranslateValue = string | PluralTranslateValue;

/**
 * The format of pluralized translations
 * [one, some, many, none]
 */
export type PluralTranslateValue = [string, string, string, string];

/**
 * Dictionary with translations into a specific language
 * Format:
 * {
 *   [keysetName]: {
 *     [key]: value
 *   }
 * }
 */
export type TranslateDictionary = Dictionary<Dictionary<TranslateValue>>;
