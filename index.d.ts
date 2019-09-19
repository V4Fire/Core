/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

declare const APP_NAME: string;
declare const API_URL: CanUndef<string>;
declare const IS_PROD: boolean;
declare const LOCALE: string;

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
type CanVoid<T> = T | void;
type CanArray<T> = T | T[];

interface ClassConstructor<T = unknown> {new: T}
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
	forEach<V = unknown, K = unknown, D = unknown>(
		obj: D,
		cb: (el: V, key: K, data: D) => unknown,
		params?: ObjectForEachParams
	): void;

	fastCompare<T = unknown>(a: unknown, b: T): a is T;
	fastClone<T = unknown>(obj: T, params?: FastCloneParams): T;

	mixin<B = unknown, O1 = unknown>(
		params: ObjectMixinParams | boolean,
		base?: B,
		obj1: O1
	): B & O1;

	mixin<B = unknown, O1 = unknown, O2 = unknown>(
		params: ObjectMixinParams | boolean,
		base?: B,
		obj1: O1,
		obj2: O2
	): B & O1 & O2;

	mixin<B = unknown, O1 = unknown, O2 = unknown, O3 = unknown>(
		params: ObjectMixinParams | boolean,
		base?: B,
		obj1: O1,
		obj2: O2,
		obj3: O3
	): B & O1 & O2 & O3;

	mixin<R = unknown>(
		params: ObjectMixinParams | boolean,
		base?: unknown,
		...objs: unknown[]
	): R;

	parse<V = unknown, R = unknown>(value: V): CanUndef<R>;
	getPrototypeChain(constructor: Function): object[];

	createDict<V = unknown>(): Dictionary<V>;
	createDict<D extends object>(...fields: D[]): Pick<D, keyof D>;

	createMap<D extends object, K extends keyof D>(obj: D):
		D extends Array<infer E> ? Dictionary<E | number> : D & {[I: string]: K};

	fromArray(arr: unknown[]): Dictionary<boolean>;
	convertEnumToDict<D extends object>(obj: D): {[K in keyof D]: K};

	select<D extends object>(obj: D, condition: RegExp): {[K in keyof D]?: D[K]};
	select<D extends object, C extends string>(obj: D, condition: CanArray<C>): Pick<D, Extract<keyof D, C>>;
	select<D extends object, C extends object>(obj: D, condition: C): Pick<D, Extract<keyof D, keyof C>>;

	reject<D extends object>(obj: D, condition: RegExp): {[K in keyof D]?: D[K]};
	reject<D extends object, C extends string>(obj: D, condition: CanArray<C>): Omit<D, C>;
	reject<D extends object, C extends object>(obj: D, condition: C): Omit<D, keyof C>;

	isObject(obj: unknown): obj is Dictionary;
	isSimpleObject(obj: unknown): obj is object;
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

interface Array<T> {
	union<A extends unknown[]>(...args: A): A extends (infer V)[][] ?
		Array<T | V> : A extends (infer V)[] ? Array<T | V> : T[];
}

interface String {
	capitalize(lower?: boolean, all?: boolean): string;
	camelize(upper?: boolean): string;
	dasherize(stable?: boolean): string;
	underscore(stable?: boolean): string;
}

type NumberOpts =
	'decimal' |
	'thousands';

interface NumberConstructor {
	getOption(key: NumberOpts): string;
	setOption(key: NumberOpts, value: string): string;
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

	isInteger(): boolean;
	isFloat(): boolean;
	isEven(): boolean;
	isOdd(): boolean;
	isPositive(): boolean;
	isNegative(): boolean;
	isNonNegative(): boolean;
	isNatural(): boolean;
	isBetweenZeroAndOne(): boolean;
	isPositiveBetweenZeroAndOne(): boolean;

	pad(place?: number, sign?: boolean, base?: number): string;
	format(place?: number): string;

	floor(precision?: number): number;
	round(precision?: number): number;
	ceil(precision?: number): number;
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

interface DateHTMLDateStringParams {
	month?: boolean;
	date?: boolean;
}

interface DateHTMLTimeStringParams {
	minutes?: boolean;
	seconds?: boolean;
	milliseconds?: boolean;
}

type DateHTMLStringParams =
	DateHTMLTimeStringParams &
	DateHTMLDateStringParams;

interface DateRelative {
	type: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
	value: number;
	diff: number;
}

interface Date {
	clone(): Date;

	short(local?: string): string;
	medium(local?: string): string;
	long(local?: string): string;
	format(format: string, local?: string): string;
	toHTMLDateString(params?: DateHTMLDateStringParams): string;
	toHTMLTimeString(params?: DateHTMLTimeStringParams): string;
	toHTMLString(params?: DateHTMLStringParams): string;

	add(params: DateSetParams, reset?: boolean): Date;
	set(params: DateSetParams, reset?: boolean): Date;
	rewind(params: DateSetParams, reset?: boolean): Date;

	relative(): DateRelative;
	relativeTo(date: DateCreateValue): DateRelative;

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

	daysInMonth(): number;
}

interface Function {
	name: string;
	once(): Function;
	debounce(delay?: number): Function;
	throttle(delay?: number, options?: {leading?: boolean}): Function;
}

declare namespace decoders {
	interface TextDecoder {
		readonly encoding: string;
		readonly fatal: boolean;
		readonly ignoreBOM: boolean;
		decode(buffer?: ArrayBufferView, opts?: {stream?: boolean}): string;
	}

	export interface TextDecoderConstructor {
		new (utfLabel?: string, opts?: {fatal?: boolean}): TextDecoder;
	}
}

interface Window {
	TextDecoder: decoders.TextDecoderConstructor;
}

declare const TextDecoder: decoders.TextDecoderConstructor;
