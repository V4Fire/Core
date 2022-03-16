/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Async from 'core/async';

export type Label = string | symbol;
export type Group = string;
export type Join = boolean | 'replace';

/**
 * Reason why a task can be marked
 */
export type MarkReason =
	'id' |
	'label' |
	'group' |
	'rgxp' |
	'all';

/**
 * Reason why a task can be killed (cleared)
 */
export type ClearReason =
	MarkReason |
	'muting'|
	'collision';

export interface IdObject {
	__id__: unknown;
}

export interface AsyncOptions {
	/**
	 * Label of a task (the previous task with the same label will be canceled)
	 */
	label?: Label;

	/**
	 * Group name of a task
	 */
	group?: Group;

	/**
	 * Strategy to join competitive tasks (with the same labels):
	 *   1. `true` - all tasks are joined to the first;
	 *   1. `'replace'` - all tasks are joined (replaced) to the last (only for promises).
	 */
	join?: Join;
}

export interface AsyncCbOptions<CTX extends object = Async> extends AsyncOptions {
	/**
	 * If true, then a task namespace is marked as promisified
	 * @default `false`
	 */
	promise?: boolean;

	/**
	 * Handler/s of task clearing
	 */
	onClear?: CanArray<AsyncCb<CTX>>;

	/**
	 * Handler/s of task merging: a task should merge to another task with the same label and with "join: true" strategy
	 */
	onMerge?: CanArray<AsyncCb<CTX>>;

	/**
	 * Handler/s of muted task calling.
	 * These handlers are invoked when occurring calling the task if it is muted.
	 */
	onMutedCall?: CanArray<AsyncCb<CTX>>;
}

export interface AsyncCbOptionsSingle<CTX extends object = Async> extends AsyncCbOptions<CTX> {
	/**
	 * If false, then the proxy supports multiple callings
	 * @default `true`
	 */
	single?: boolean;
}

export interface AsyncProxyOptions<CTX extends object = Async> extends AsyncCbOptionsSingle<CTX> {
	/**
	 * Namespace of the proxy
	 */
	name?: string;

	/**
	 * Function to clear memory of the proxy
	 */
	clearFn?: ClearFn<CTX>;
}

export interface ClearOptions {
	/**
	 * Label of the task to clear
	 */
	label?: Label;

	/**
	 * Group name of the task to clear
	 */
	group?: Group | RegExp;

	/**
	 * If true, then a cleanup handler of the task is prevented
	 */
	preventDefault?: boolean;
}

export interface ClearOptionsId<ID = any> extends ClearOptions {
	/**
	 * Identifier of the task to clear
	 */
	id?: ID;
}

export interface ClearProxyOptions<ID = any> extends ClearOptionsId<ID> {
	/**
	 * Namespace of the proxy to clear
	 */
	name?: string;
}

export type StrictClearOptions =
	Omit<ClearOptions, 'label'> |
	Overwrite<ClearOptions, {label: Label; group: Group | RegExp}>;

export type StrictClearOptionsId<ID = any> =
	Omit<ClearOptionsId<ID>, 'label'> |
	Overwrite<ClearOptionsId<ID>, {label: Label; group: Group | RegExp}>;

export type ProxyCb<
	A = unknown,
	R = unknown,
	CTX extends object = Async
> = A extends never ?
	((this: CTX) => R) : A extends any[] ?
		((this: CTX, ...args: A) => R) : ((this: CTX, e: A) => R) | Function;

export type AsyncCb<CTX extends object = Async> =
	ProxyCb<TaskCtx<CTX>, void, CTX>;

/**
 * Registered task object
 */
export interface Task<CTX extends object = Async> {
	/**
	 * Task unique identifier
	 */
	id: unknown;

	/**
	 * Raw task object
	 */
	obj: unknown;

	/**
	 * Name of the raw task object
	 */
	objName?: string;

	/**
	 * Group name the task
	 */
	group?: string;

	/**
	 * Label of the task
	 */
	label?: Label;

	/**
	 * True if the task is paused
	 */
	paused: boolean;

	/**
	 * True if the task is muted
	 */
	muted: boolean;

	/**
	 * Queue of pending handlers
	 * (if the task is paused)
	 */
	queue: Function[];

	/**
	 * List of complete handlers:
	 *
	 * [0] - onFulfilled
	 * [1] - onRejected
	 */
	onComplete: Array<Array<BoundFn<CTX>>>;

	/**
	 * List of clear handlers
	 */
	onClear: Array<AsyncCb<CTX>>;

	/**
	 * Unregisters the task
	 */
	unregister: Function;

	/**
	 * Function to clear the task
	 */
	clearFn?: ClearFn;
}

/**
 * Context of a task
 */
export type TaskCtx<CTX extends object = Async> = {
	/**
	 * Task type
	 */
	type: string;

	/**
	 * Link to the registered task
	 */
	link: Task<CTX>;

	/**
	 * Link to a new task that replaces the current
	 */
	replacedBy?: Task<CTX>;

	/**
	 * Reason to clear the task
	 */
	reason?: ClearReason;
} & AsyncOptions & ClearOptionsId<unknown>;

export interface ClearFn<CTX extends object = Async> extends Function {
	(id: any, ctx: TaskCtx<CTX>): void;
}

export interface BoundFn<CTX extends object = Async> extends Function {
	(this: CTX, ...args: any[]): void;
}

export interface LocalCache {
	labels: Record<Label, any>;
	links: Map<object, Task<any>>;
}

export interface GlobalCache {
	root: LocalCache;
	groups: Dictionary<LocalCache>;
}
