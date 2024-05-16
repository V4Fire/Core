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
 * Sets a new application i18n param
 *
 * @param type
 * @param [value]
 * @param [def] - if true, the param is marked as default
 * @emits `setLocale(value: string, oldValue?: string) | setRegion(value: string, oldValue?: string)`
 */
export declare function setI18NParam(type: 'locale', value: CanUndef<Language>, def?: boolean): CanUndef<Language>;
export declare function setI18NParam(type: 'region', value: CanUndef<Region>, def?: boolean): CanUndef<Region>;
export declare function setI18NParam(type: 'locale' | 'region', value: CanUndef<Language | Region>, def?: boolean): CanUndef<Language | Region>;
/**
 * @deprecated
 * @see [[setI18NParam]]
 */
export declare function setLocale(value: CanUndef<Language>, def?: boolean): CanUndef<Language>;
