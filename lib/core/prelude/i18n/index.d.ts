/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
export * from '../../../core/prelude/i18n/const';
export * from '../../../core/prelude/i18n/helpers';
export * from '../../../core/prelude/i18n/interface';
/**
 * Sets a new application language
 *
 * @param [value]
 * @param [def] - if true, the language is marked as default
 * @emits `setLocale(value: string, oldValue?: string)`
 */
export declare function setLocale(value: CanUndef<Language>, def?: boolean): CanUndef<Language>;
