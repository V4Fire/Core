/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export type ObjectScheme = Dictionary<
	ObjectScheme | Function | FunctionConstructor | Primitive
	>;

export interface GetHook<T extends object = object> {
	(contexts: T[]): void;
}

export interface SetHook<T extends object = object> {
	(contexts: T[], value: unknown): void;
}

export interface CallHook<T extends object = object> {
	(contexts: T[], ...args: unknown[]): void;
}

export interface Hooks<T extends object = object> {
	get?: Dictionary<GetHook<T>>;
	set?: Dictionary<SetHook<T>>;
	call?: Dictionary<CallHook<T>>;
}
