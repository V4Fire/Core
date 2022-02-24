/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/pull/README.md]]
 * @packageDocumentation
 */
import AbstractPull, { SpecialSettings, ReturnType } from 'core/pull/interface';
import { SyncPromise } from 'core/prelude/structures';

/**
 * Simple implementation of pull with stack
 * @typeparam T - pull element
 */
export default class Pull<T> extends AbstractPull<T> {

	/** @inheritDoc  */
	available: number;

	/**
	 * data structure that contain pull's object
	 */
	stack:T[]=[];

	/** @inheritDoc  */
	onFree:(resources: T, pull: AbstractPull<T>, args: any)=> void;

	/** @inheritDoc  */
	onTake:(resources: T, pull: AbstractPull<T>, args: any)=> void;

	/** @inheritDoc  */
	size: number;

	/** @inheritDoc  */
	maxSize:number;

	/**
	 * constructor that can create object immediately
	 * @param objectFactory
	 * @param size amount of object that will be created at initialization
	 * @param settings settings like "max pull size" and hooks
	 */
	constructor(objectFactory:()=>T, size:number = 0,
							settings:Partial<SpecialSettings<T>> = {}) {
		super();
		this.maxSize = settings.maxSize ?? Infinity;
		this.onFree = settings.onFree ?? (() => 1);

		this.onTake = settings.onTake ?? (() => 1);

		this.objectFactory = objectFactory;
		this.size = size;
		this.available = size;

		for (let i = 0; i < size; i++)
			this.stack.push(objectFactory());

	}

	/** @inheritDoc  */
	readonly objectFactory=():T => (<T>{});

	/** @inheritDoc  */
	take(...args:any): ReturnType<T> {
		const value = this.stack.pop();
		if(value === undefined) {
			throw new Error('Pull is empty');
		}

		this.available--;
		this.onTake(value, this, args);
		return {free: this.free.bind(this), value};
	}

	/** @inheritDoc  */
	takeOrCreate(...args:any): ReturnType<T> {
		if(this.available === 0 && this.size < this.maxSize) {
			this.size++;
			this.available++;
			this.stack.push(this.objectFactory());
		}

		return this.take(...args);
	}

	/** @inheritDoc  */
	takeOrWait(...args:any): SyncPromise<ReturnType<T>> {
		return new SyncPromise((r) => {
			const fn = () => {
			if(this.available > 0) {
				r(this.take(...args));
			}
		};

			fn();
			setInterval(fn, 100);
		});
	}

	/**
	 * function that add value to pull
	 * @param value pull's object
	 * @param args args for hook
	 */
	free(value:T, ...args:any):void {
		this.onFree(value, this, args);
		this.available++;
		this.stack.push(value);
	}
}
