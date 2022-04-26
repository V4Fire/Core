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

export interface GetHook {
	(contexts: object[]): void;
}

export interface SetHook {
	(contexts: object[], value: unknown): void;
}

export interface CallHook {
	(contexts: object[], ...args: unknown[]): void;
}

export interface Hooks {
	get?: Dictionary<GetHook>;
	set?: Dictionary<SetHook>;
	call?: Dictionary<CallHook>;
}
