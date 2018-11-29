/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

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

declare function setImmediate(fn: Function): number;
declare function clearImmediate(id: number): void;

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

interface ArrayLike<T = unknown> {
	[i: number]: T;
	length: number;
}

interface JSONCb {
	(key: string, value: unknown): unknown;
}

interface FastCloneParams {
	replacer?: JSONCb;
	reviver?: JSONCb | false;
	freezable?: boolean;
}

interface ObjectMixinParams<V = unknown, K = unknown, D = unknown> {
	deep?: boolean;
	traits?: boolean | -1;
	withUndef?: boolean;
	withDescriptor?: boolean;
	withAccessors?: boolean;
	withProto?: boolean;
	concatArray?: boolean;
	concatFn?(a: V, b: unknown[], key: K): unknown[];
	extendFilter?(a: V, b: unknown, key: K): unknown;
	filter?(el: V, key: K, data: D): unknown;
}

interface ObjectForEachParams {
	withDescriptor?: boolean;
	notOwn?: boolean | -1;
}

interface ObjectGetParams {
	separator?: string;
}

interface ObjectSetParams extends ObjectGetParams {
	concat?: boolean;
}

interface ObjectConstructor {
	get<T = unknown>(obj: unknown, path: string | unknown[], params?: ObjectGetParams): T;
	has(obj: object, path: string | unknown[], params?: ObjectGetParams): boolean;
	set<T = unknown>(obj: unknown, path: string | unknown[], value: T, params?: ObjectSetParams): T;

	size(obj: unknown): number;
	keys(obj: object | Dictionary): string[];
	forEach<V = unknown, K = unknown, D = unknown>(
		obj: D,
		cb: (el: V, key: K, data: D) => unknown,
		params?: ObjectForEachParams
	): void;

	fastCompare<T = unknown>(a: unknown, b: T): a is T;
	fastClone<T = unknown>(obj: T, params?: FastCloneParams): T;
	mixin<R = unknown, D = unknown, K = unknown, V = unknown>(
		params: ObjectMixinParams | boolean,
		base?: D,
		...objs: unknown[]
	): R;

	parse<V = unknown, R = unknown>(value: V): CanUndef<R>;
	getPrototypeChain(constructor: Function): object[];

	createDict<T extends Dictionary>(fields: T): {[P in keyof T]: T[P]};
	createDict<T = unknown>(): Dictionary<T>;
	createDict(...fields: unknown[]): Dictionary;

	createMap<T extends object>(obj: T): T & Dictionary;
	fromArray(arr: unknown[]): Dictionary<boolean>;
	convertEnumToDict(obj: Dictionary): Dictionary<string>;

	select<T extends Dictionary = Dictionary>(obj: Dictionary, condition: CanArray<string> | Dictionary | RegExp): T;
	reject<T extends Dictionary = Dictionary>(obj: Dictionary, condition: CanArray<string> | Dictionary | RegExp): T;

	isObject(obj: unknown): obj is object;
	isTable(obj: unknown): obj is Dictionary;
	isArray(obj: unknown): obj is unknown[];
	isArrayLike(obj: unknown): obj is ArrayLike;

	isFunction(obj: unknown): obj is Function;
	isGenerator(obj: unknown): obj is GeneratorFunction;
	isIterator(obj: unknown): obj is Iterator;

	isString(obj: unknown): obj is string;
	isNumber(obj: unknown): obj is number;
	isBoolean(obj: unknown): obj is boolean;
	isSymbol(obj: unknown): obj is symbol;

	isRegExp(obj: unknown): obj is RegExp;
	isDate(obj: unknown): obj is Date;
	isPromise(obj: unknown): obj is Promise<unknown>;

	isMap(obj: unknown): obj is Map<unknown, unknown>;
	isWeakMap(obj: unknown): obj is WeakMap<object, unknown>;
	isSet(obj: unknown): obj is Set<unknown>;
	isWeakSet(obj: unknown): obj is WeakSet<object>;
}

interface Object {
	toSource(): string;
}

interface Array<T> {
	union<A extends unknown[]>(...args: A): A extends (infer V)[][] ?
		Array<T | V> : A extends (infer V)[] ? Array<T | V> : T[];
}

interface String {
	camelize(upper?: boolean): string;
	dasherize(): string;
	underscore(): string;
}

type NumberOptions =
	'decimal' |
	'thousands';

interface NumberConstructor {
	getOption(key: NumberOptions): string;
	setOption(key: NumberOptions, value: string): string;
}

interface Number {
	em: string;
	ex: string;
	rem: string;
	px: string;
	per: string;
	vh: string;
	vw: string;
	vmin: string;
	vmax: string;

	second(): number;
	seconds(): number;
	minute(): number;
	minutes(): number;
	hour(): number;
	hours(): number;
	day(): number;
	days(): number;
	week(): number;
	weeks(): number;

	pad(place?: number, sign?: boolean, base?: number): string;
	format(place?: number): string;

	floor(precision?: number): string;
	round(precision?: number): string;
	ceil(precision?: number): string;
}

interface RegExpConstructor {
	escape(pattern: string): string;
}

type DateCreateValue =
	number |
	string |
	Date;

interface DateCreateParams {

}

interface DateConstructor {
	create(pattern?: DateCreateValue, params?: DateCreateParams): Date;
	getWeekDays(): string[];
}

interface DateSetParams {
	millisecond?: number;
	milliseconds?: number;
	second?: number;
	seconds?: number;
	minute?: number;
	minutes?: number;
	hour?: number;
	hours?: number;
	day?: number;
	days?: number;
	month?: number;
	months?: number;
	year?: number;
	years?: number;
}

interface Date {
	clone(): Date;

	add(params: DateSetParams, reset?: boolean): Date;
	set(params: DateSetParams, reset?: boolean): Date;
	rewind(params: DateSetParams, reset?: boolean): Date;

	is(date: DateCreateValue, margin?: number): boolean;
	isAfter(date: DateCreateValue, margin?: number): boolean;
	isBefore(date: DateCreateValue, margin?: number): boolean;
	isBetween(start: DateCreateValue, end: DateCreateValue, margin?: number): boolean;

	isFuture(): boolean;
	isPast(): boolean;

	beginningOfDay(): Date;
	beginningOfWeek(): Date;
	beginningOfMonth(): Date;
	beginningOfYear(): Date;

	endOfDay(): Date;
	endOfWeek(): Date;
	endOfMonth(): Date;
	endOfYear(): Date;
}

interface Function {
	name: string;
	once(): Function;
	debounce(delay?: number): Function;
	throttle(delay?: number): Function;
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
