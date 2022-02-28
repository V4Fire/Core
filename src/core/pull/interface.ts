import type Pull from 'core/pull/index';

export type hook<T> = (value: T, pull: Pull<T>, args: unknown[]) => void;

export interface SpecialSettings<T> {
	maxSize: number;

	onTake(value: T, pull: Pull<T>, args: any): void;

	onFree(value: T, pull: Pull<T>, args: any): void;
}

export interface ReturnType<T> {
	free(val: T, args: any): void;

	value: T;
}
