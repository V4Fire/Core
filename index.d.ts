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

declare function Any(obj: unknown): any;
declare function stderr(err: unknown): void;
declare function devNull(obj: unknown): void;

declare function i18n(strings: unknown | string[], ...expr: unknown[]): string;
declare function t(strings: unknown | string[], ...expr: unknown[]): string;
declare function l(strings: unknown | string[], ...expr: unknown[]): string;

declare class IdleDeadline {
	readonly didTimeout: boolean;
	timeRemaining(): number;
}

declare function requestIdleCallback(fn: (deadline: IdleDeadline) => void, opts?: {timer?: number}): number;
declare function cancelIdleCallback(id: number): void;

type Wrap<T> = T & any;
type CanPromise<T> = T | Promise<T>;
interface Dictionary<T> {[key: string]: T | undefined}
interface Dictionary<T extends unknown = unknown> {[key: string]: T}

interface JSONCb {
	(key: string, value: unknown): unknown;
}

interface Object {
	toSource(): string;
}

interface FastCloneParams {
	replacer?: JSONCb;
	reviver?: JSONCb | false;
	freezable?: boolean;
}

interface ObjectConstructor {
	mixin<D, K, V>(
		params: CollectionJS.ExtendParams<D, K, V> & CollectionJS.Async,
		target?: D,
		...source: unknown[]
	): CollectionJS.ThreadObj<D & CollectionJS.AnyRecord>;

	mixin<D, K, V>(
		deepOrParams: boolean | CollectionJS.ExtendParams<D, K, V>,
		target?: D,
		...source: unknown[]
	): D & CollectionJS.AnyRecord;

	fastClone<T>(obj: T, params?: FastCloneParams): T;
	fastCompare<T>(a: unknown, b: T): a is T;
	keys(obj: object | Dictionary): string[];

	parse<T, R>(value: T): R | undefined;
	getPrototypeChain(constructor: Function): object[];
	fromArray(arr: unknown[]): Dictionary<boolean>;

	createMap<T extends object>(obj: T): T & Dictionary;
	createDict<T>(fields: T): {[P in keyof T]: T[P]};
	createDict<T>(): Dictionary<T>;
	createDict(...fields: unknown[]): Dictionary;

	isObject(obj: unknown): obj is object;
	isTable(obj: unknown): obj is Dictionary;
	isArray(obj: unknown): obj is unknown[];
	isFunction(obj: unknown): obj is Function;

	isString(obj: unknown): obj is string;
	isNumber(obj: unknown): obj is number;
	isBoolean(obj: unknown): obj is boolean;

	isRegExp(obj: unknown): obj is RegExp;
	isDate(obj: unknown): obj is Date;
	isPromise(obj: unknown): obj is Promise<unknown>;

	isMap(obj: unknown): obj is Map<unknown, unknown>;
	isWeakMap(obj: unknown): obj is WeakMap<object, unknown>;
	isSet(obj: unknown): obj is Set<unknown>;
	isWeakSet(obj: unknown): obj is WeakSet<object>;
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
