/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { WatchOptions, WatchHandlersSet } from '@src/core/object/watch/interface';

export interface WrapOptions {
	/**
	 * Link to the root object of watching
	 */
	root: object;

	/**
	 * Link to the top object of watching
	 * (the first level property of the root)
	 */
	top?: object;

	/**
	 * Base path to object properties
	 */
	path: unknown[];

	/**
	 * True if the property to watch is taken from a prototype
	 * @default `false`
	 */
	fromProto?: boolean;

	/**
	 * Watch options
	 */
	watchOpts: WatchOptions;
}

export interface WrapParams extends WrapOptions {
	original: Function;
	handlers: WatchHandlersSet;
}

export type WrapResult = Array<[unknown, unknown, unknown[]]>;

export interface WrapMethod {
	(target: any, opts: WrapParams, ...args: any[]): any;
}

export interface WrapMethodObject {
	type: string;
	value: WrapMethod;
}

export interface StructureWrapper {
	is(obj: unknown, opts: WrapOptions): boolean;
	methods: Dictionary<WrapMethod | WrapMethodObject>;
}

export type StructureWrappers = Dictionary<StructureWrapper>;
