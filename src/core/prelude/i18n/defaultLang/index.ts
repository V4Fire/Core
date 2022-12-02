import type { Language } from 'lang';

/**
 * Calculates the value of the default language, used if the translation was not found in the desired
 * @returns Lang
 */
export function selectDefaultLang(): Language {
	return 'en';
}
