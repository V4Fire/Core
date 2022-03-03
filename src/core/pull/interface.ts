/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Pull from 'core/pull/index';

export type hook<T> = (value: T, pull: Pull<T>, args: unknown[]) => void;

export interface SpecialSettings<T> {
	maxSize: number;

	onTake(value: T, pull: Pull<T>, args: any): void;

	onFree(value: T, pull: Pull<T>, args: any): void;

	hashFn(...args: unknown[]): string;

	onClear(pull: Pull<T>, ...args: unknown[]): void;

	destructor(resource: T): void;
}

export type PartialOpts<T> = Partial<SpecialSettings<T>>;

export interface ReturnType<T> {
	free(val: T, args: any): void;

	value: T;

	destroy(resource: T): void;
}
