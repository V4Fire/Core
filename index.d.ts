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

interface FastCloneOptions {
	replacer?: JSONCb;
	reviver?: JSONCb | false;
	freezable?: boolean;
}

interface ObjectMixinOptions<V = unknown, K = unknown, D = unknown> {
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

interface ObjectGetOptions {
	separator?: string;
}

interface ObjectSetOptions extends ObjectGetOptions {
	concat?: boolean;
}

interface ObjectForEachOptions {
	withDescriptor?: boolean;
	notOwn?: boolean | -1;
}

interface ObjectForEachPropertyDescriptor<V = unknown> {
	configurable?: boolean;
	enumerable?: boolean;
	value?: V;
	writable?: boolean;
	get?(): unknown;
	set?(v: unknown): void;
}

interface ObjectFromArrayOptions<T = boolean> {
	keyConverter?: Function;
	valueConverter?(el: unknown): T;
}

interface ObjectConstructor {
	get<T = unknown>(obj: unknown, path: string | unknown[], opts?: ObjectGetOptions): T;
	has(obj: object, path: string | unknown[], opts?: ObjectGetOptions): boolean;
	set<T = unknown>(obj: unknown, path: string | unknown[], value: T, opts?: ObjectSetOptions): T;

	size(obj: unknown): number;

	forEach<V = unknown>(
		obj: Dictionary<V>,
		cb: (el: ObjectForEachPropertyDescriptor<V>, key: string, data: Dictionary<V>) => any,
		opts?: ObjectForEachOptions & {withDescriptor: true}
	): void;

	forEach<V = unknown>(
		obj: Dictionary<V>,
		cb: (el: V, key: string, data: Dictionary<V>) => any,
		opts?: ObjectForEachOptions & ({notOwn: boolean | -1} | {withDescriptor: false})
	): void;

	forEach<V = unknown>(
		obj: V[],
		cb: (el: V, i: number, data: V[]) => any,
		opts?: ObjectForEachOptions
	): void;

	forEach<V = unknown>(
		obj: Set<V>,
		cb: (el: V, i: V, data: Set<V>) => any,
		opts?: ObjectForEachOptions
	): void;

	forEach<V = unknown, K = unknown>(
		obj: Map<K, V>,
		cb: (el: V, key: K, data: Map<K, V>) => any,
		opts?: ObjectForEachOptions
	): void;

	forEach<V = unknown>(
		obj: Iterable<V>,
		cb: (el: V, key: null, data: Iterable<V>) => any,
		opts?: ObjectForEachOptions
	): void;

	forEach<V = unknown>(
		obj: Dictionary<V>,
		cb: (el: V, key: string, data: Dictionary<V>) => any,
		// tslint:disable-next-line:unified-signatures
		opts?: ObjectForEachOptions
	): void;

	forEach<V = unknown, K = unknown, D = unknown>(
		obj: D,
		cb: (el: V, key: K, data: D) => any,
		opts?: ObjectForEachOptions
	): void;

	fastCompare<T = unknown>(a: unknown, b: T): a is T;
	fastClone<T = unknown>(obj: T, opts?: FastCloneOptions): T;
	fastHash(obj: unknown): string;

	mixin<B = unknown, O1 = unknown>(
		opts: ObjectMixinOptions | boolean,
		base?: B,
		obj1: O1
	): B & O1;

	mixin<B = unknown, O1 = unknown, O2 = unknown>(
		opts: ObjectMixinOptions | boolean,
		base?: B,
		obj1: O1,
		obj2: O2
	): B & O1 & O2;

	mixin<B = unknown, O1 = unknown, O2 = unknown, O3 = unknown>(
		opts: ObjectMixinOptions | boolean,
		base?: B,
		obj1: O1,
		obj2: O2,
		obj3: O3
	): B & O1 & O2 & O3;

	mixin<R = unknown>(
		opts: ObjectMixinOptions | boolean,
		base?: unknown,
		...objs: unknown[]
	): R;

	parse<V = unknown, R = unknown>(value: V): CanUndef<R>;

	createDict<V = unknown>(): Dictionary<V>;
	createDict<D extends object>(...fields: D[]): Pick<D, keyof D>;

	createMap<D extends object, K extends keyof D>(obj: D):
		D extends Array<infer E> ? Dictionary<E | number> : D & {[I: string]: K};

	fromArray<T = boolean>(arr: unknown[], opts?: ObjectFromArrayOptions<T>): Dictionary<T>;
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
	isPromiseLike(obj: unknown): obj is PromiseLike<unknown>;

	isMap(obj: unknown): obj is Map<unknown, unknown>;
	isWeakMap(obj: unknown): obj is WeakMap<object, unknown>;
	isSet(obj: unknown): obj is Set<unknown>;
	isWeakSet(obj: unknown): obj is WeakSet<object>;
}

interface Array<T> {
	union<A extends unknown[]>(...args: A): A extends (infer V)[][] ?
		Array<T | V> : A extends (infer V)[] ? Array<T | V> : T[];
}

interface StringCapitalizeOptions {
	lower?: boolean;
	all?: boolean;
}

interface String {
	capitalize(opts?: StringCapitalizeOptions): string;
	camelize(upper?: boolean): string;
	dasherize(stable?: boolean): string;
	underscore(stable?: boolean): string;
}

type NumberOption =
	'decimal' |
	'thousands';

interface NumberConstructor {
	getOption(key: NumberOption): string;
	setOption(key: NumberOption, value: string): string;
	isInteger(obj: unknown): boolean;
	isFloat(obj: unknown): boolean;
	isEven(obj: unknown): boolean;
	isOdd(obj: unknown): boolean;
	isPositive(obj: unknown): boolean;
	isNegative(obj: unknown): boolean;
	isNonNegative(obj: unknown): boolean;
	isNatural(obj: unknown): boolean;
	isBetweenZeroAndOne(obj: unknown): boolean;
	isPositiveBetweenZeroAndOne(obj: unknown): boolean;
}

interface NumberPadOptions {
	base?: number;
	sign?: boolean;
}

interface NumberFormatOptions {
	decimalLength?: boolean;
	decimal?: string;
	thousands?: string;
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

	pad(targetLength?: number, opts?: NumberPadOptions): string;
	format(place?: number): string;

	floor(precision?: number): number;
	round(precision?: number): number;
	ceil(precision?: number): number;
}

interface RegExpConstructor {
	escape(value: string): string;
}

type DateCreateValue =
	number |
	string |
	Date;

interface DateCreateOptions {

}

interface DateConstructor {
	create(pattern?: DateCreateValue, opts?: DateCreateOptions): Date;
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

interface DateHTMLDateStringOptions {
	month?: boolean;
	date?: boolean;
}

interface DateHTMLTimeStringOptions {
	minutes?: boolean;
	seconds?: boolean;
	milliseconds?: boolean;
}

type DateHTMLStringOptions =
	DateHTMLTimeStringOptions &
	DateHTMLDateStringOptions;

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
	format(pattern: string, local?: string): string;
	toHTMLDateString(opts?: DateHTMLDateStringOptions): string;
	toHTMLTimeString(opts?: DateHTMLTimeStringOptions): string;
	toHTMLString(opts?: DateHTMLStringOptions): string;

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
	throttle(delay?: number): Function;
}
