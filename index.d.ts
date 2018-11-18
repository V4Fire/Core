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
declare const API_URL: CanUndef<string>;
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
type Nullable<T> = T | null | undefined;
type CanPromise<T> = T | Promise<T>;
type CanUndef<T> = T | undefined;
type CanArray<T> = T | T[];

interface StrictDictionary<T = unknown> {[key: string]: T}
interface Dictionary<T> {[key: string]: CanUndef<T>}
interface Dictionary<T extends unknown = unknown> {[key: string]: T}

type DictionaryType<T extends Dictionary> = T extends Dictionary<infer V> ? NonNullable<V> : T;
type IterableType<T extends Iterable<unknown>> = T extends Iterable<infer V> ? V : T;
type PromiseType<T extends Promise<unknown>> = T extends Promise<infer V> ? V : T;

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
	mixin<D = unknown, K = unknown, V = unknown>(
		params: CollectionJS.ExtendParams<D, K, V> & CollectionJS.Async,
		target?: D,
		...source: unknown[]
	): CollectionJS.ThreadObj<D & CollectionJS.AnyRecord>;

	mixin<D = unknown, K = unknown, V = unknown>(
		deepOrParams: boolean | CollectionJS.ExtendParams<D, K, V>,
		target?: D,
		...source: unknown[]
	): D & CollectionJS.AnyRecord;

	fastClone<T = unknown>(obj: T, params?: FastCloneParams): T;
	fastCompare<T = unknown>(a: unknown, b: T): a is T;
	keys(obj: object | Dictionary): string[];

	parse<V = unknown, R = unknown>(value: V): CanUndef<R>;
	getPrototypeChain(constructor: Function): object[];
	fromArray(arr: unknown[]): Dictionary<boolean>;

	createMap<T extends object>(obj: T): T & Dictionary;
	createDict<T extends Dictionary>(fields: T): {[P in keyof T]: T[P]};
	createDict<T = unknown>(): Dictionary<T>;
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
