/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/// <reference types="collection.js"/>
/// <reference types="sugar/sugar-extended"/>
/// <reference types="typescript/lib/lib.dom"/>
/// <reference types="typescript/lib/lib.esnext"/>

declare const APP_NAME: string;
declare const API_URL: string | undefined;
declare const IS_PROD: boolean;
declare const LANG: string;

declare function Any(obj: any): any;
declare function stderr(err: any): void;
declare function devNull(obj: any): void;

declare function i18n(strings: any | string[], ...expr: any[]): string;
declare function t(strings: any | string[], ...expr: any[]): string;
declare function l(strings: any | string[], ...expr: any[]): string;

declare class IdleDeadline {
	readonly didTimeout: boolean;
	timeRemaining(): number;
}

declare function requestIdleCallback(fn: (deadline: IdleDeadline) => void, opts?: {timer?: number}): number;
declare function cancelIdleCallback(id: number): void;

type Wrap<T> = T & any;
type CanPromise<T> = T | Promise<T>;
interface Dictionary<T = any> {[key: string]: T}

interface JSONCb {
	(key: string, value: any): any;
}

interface Object {
	toSource(): string;
}

interface ObjectConstructor {
	mixin<D, K, V>(
		params: CollectionJS.ExtendParams<D, K, V> & CollectionJS.Async,
		target?: D,
		...source: any[]
	): CollectionJS.ThreadObj<D & CollectionJS.AnyRecord>;

	mixin<D, K, V>(
		deepOrParams: boolean | CollectionJS.ExtendParams<D, K, V>,
		target?: D,
		...source: any[]
	): D & CollectionJS.AnyRecord;

	fastClone<T>(
		obj: T,
		params?: {replacer?: JSONCb; reviver?: JSONCb | false; freezable?: boolean}
	): T;

	keys(obj: object | Dictionary): string[];
	fastCompare<T>(a: any, b: T): a is T;
	parse(value: any): any;
	createMap<T extends Object>(obj: T): T & Dictionary;
	createDict<T>(fields: T): {[P in keyof T]: T[P]};
	createDict<T = any>(): Dictionary<T>;
	createDict(...fields: any[]): Dictionary;
	getPrototypeChain(constructor: Function): object[];
	fromArray(arr: any[]): Dictionary<boolean>;
	isArray(obj: any): obj is any[];
	isFunction(obj: any): obj is Function;
	isString(obj: any): obj is string;
	isNumber(obj: any): obj is number;
	isBoolean(obj: any): obj is boolean;
	isRegExp(obj: any): obj is RegExp;
	isDate(obj: any): obj is Date;
	isDate(obj: any): obj is Date;
	isWeakMap(obj: any): obj is WeakMap<any, any>;
	isWeakSet(obj: any): obj is WeakSet<any>;
	isPromise(obj: any): obj is Promise<any>;
	isTable(obj: any): obj is Dictionary;
}

interface DateConstructor {
	getWeekDays(): string[];
}

declare namespace decoders {
	interface TextDecoder {
		readonly encoding: string;
		readonly fatal: boolean;
		readonly ignoreBOM: boolean;
		decode(buffer?: ArrayBufferView, options?: {stream?: boolean}): string;
	}

	export interface TextDecoderConstructor {
		new (utfLabel?: string, options?: {fatal?: boolean}): TextDecoder;
	}
}

interface Window {
	TextDecoder: decoders.TextDecoderConstructor;
}

declare const TextDecoder: decoders.TextDecoderConstructor;
