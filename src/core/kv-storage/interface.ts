/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface ClearFilter<T = unknown> {
	(el: T, key: string): unknown;
}

export interface Namespace {
	has(key: string, ...args: unknown[]): boolean;
	get<T = unknown>(key: string, ...args: unknown[]): CanUndef<T>;
	set(key: string, value: unknown, ...args: unknown[]): void;
	remove(key: string, ...args: unknown[]): void;
	clear<T = unknown>(filter?: ClearFilter<T>, ...args: unknown[]): void;
}

export interface FactoryResult extends Namespace {
	namespace(name: string): Namespace;
}

export interface AsyncNamespace {
	has(key: string, ...args: unknown[]): Promise<boolean>;
	get<T = unknown>(key: string, ...args: unknown[]): Promise<CanUndef<T>>;
	set(key: string, value: unknown, ...args: unknown[]): Promise<void>;
	remove(key: string, ...args: unknown[]): Promise<void>;
	clear<T = unknown>(filter?: ClearFilter<T>, ...args: unknown[]): Promise<void>;
}

export interface AsyncFactoryResult extends AsyncNamespace {
	namespace(name: string): AsyncNamespace;
}
