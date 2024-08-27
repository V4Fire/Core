/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Namespaces } from 'core/async/const';

import type Async from 'core/async';

export type Label = string | symbol;
export type Group = string;
export type Join = boolean | 'replace';

export type Marker = 'muted' | '!muted' | 'paused' | '!paused';

/**
 * The reason why a task can be marked
 */
export type MarkReason = 'id' | 'label' | 'group' | 'rgxp' | 'all';

/**
 * The reason why a task can be killed (cleared)
 */
export type ClearReason = MarkReason | 'muting'| 'collision';

export interface IdObject {
	__id__: unknown;
}

export interface AsyncOptions {
	/**
	 * A label of the task.
	 * Any previous task with the same label will be canceled.
	 */
	label?: Label;

	/**
	 * A group name of the task
	 */
	group?: Group;

	/**
	 * Strategy to join competitive tasks (tasks with the same labels):
	 *   1. `true` - all following tasks are joined to the first task;
	 *   2. `'replace'` - all following tasks are joined (replaced) to the last one (only for promises).
	 */
	join?: Join;
}

export interface AsyncCbOptions<CTX extends object = Async> extends AsyncOptions {
	/**
	 * The task namespace for operations when they are used as promisified
	 * @default `false`
	 */
	promise?: Namespaces;

	/**
	 * Handler(s) responsible for task clearing
	 */
	onClear?: CanArray<AsyncCb<CTX>>;

	/**
	 * Handler(s) of task merging: a task should merge with another task that has
	 * the same label and a `join: true` strategy
	 */
	onMerge?: CanArray<AsyncCb<CTX>>;

	/**
	 * Handler(s) of muted task calling.
	 * These handlers are invoked when a muted task is called.
	 */
	onMutedCall?: CanArray<AsyncCb<CTX>>;
}

export interface AsyncCbOptionsSingle<CTX extends object = Async> extends AsyncCbOptions<CTX> {
	/**
	 * If set to false, the proxy supports multiple calls
	 * @default `true`
	 */
	single?: boolean;
}

export interface AsyncProxyOptions<CTX extends object = Async> extends AsyncCbOptionsSingle<CTX> {
	/**
	 * The proxy namespace
	 */
	namespace?: Namespaces;

	/**
	 * A function to clear proxy memory
	 */
	clearFn?: ClearFn<CTX>;
}

export interface ClearOptions {
	/**
	 * A label of the task to clear.
	 */
	label?: Label;

	/**
	 * A group name of the task to clear
	 */
	group?: Group | RegExp;

	/**
	 * If set to true, the cleanup handler of the task is prevented
	 */
	preventDefault?: boolean;
}

export interface ClearOptionsId<ID = any> extends ClearOptions {
	/**
	 * An identifier of the task to clear
	 */
	id?: ID;
}

export interface ClearProxyOptions<ID = any> extends ClearOptionsId<ID> {
	/**
	 * A namespace of the proxy to clear
	 */
	namespace?: Namespaces;
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
 * The registered task object
 */
export interface Task<CTX extends object = Async> {
	/**
	 * Task unique identifier
	 */
	id: unknown;

	/**
	 * Raw task object
	 */
	task: unknown;

	/**
	 * The name of the raw task object
	 */
	name?: string;

	/**
	 * The group name associated with the task
	 */
	group?: string;

	/**
	 * The label associated with the task
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
	 * A queue of pending handlers in case the task is paused
	 */
	queue: Function[];

	/**
	 * A list of complete handlers: `[onFulfilled, onRejected][]`
	 */
	onComplete: Array<Array<BoundFn<CTX>>>;

	/**
	 * A list of clear handlers
	 */
	onClear: Array<AsyncCb<CTX>>;

	/**
	 * A function to clear the task
	 */
	clearFn: CanNull<ClearFn<CTX>>;

	/**
	 * Unregisters the task
	 */
	unregister(): void;
}

/**
 * The context of a task
 */
export type TaskCtx<CTX extends object = Async> = {
	/**
	 * The task type
	 */
	type: string;

	/**
	 * A link to the registered task
	 */
	link: Task<CTX>;

	/**
	 * A link to a new task that replaces the current one
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
	labels: CanNull<Record<Label, any>>;
	links: Map<object, Task<any>>;
}

export interface GlobalCache {
	root: LocalCache;
	groups: CanNull<Dictionary<LocalCache>>;
}
