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

import { SyncPromise } from 'core/prelude/structures';

 interface SpecialSettings<T>{
	maxSize:number;
	onTake:(value:T,pull:Pull<T>,args:any)=>void;
	onFree:(value:T,pull:Pull<T>,args:any)=>void;
}

 interface ReturnType<T>{
	free(val:T, args:any): void;
	value:T;
}

/**
 * Simple implementation of pull with stack
 * @typeparam T - pull element
 */
export default class Pull<T>  {

	/**
	 * Amount of available now objects
	 */
	available: number;

	/**
	 * data structure that contain pull's object
	 */
	stack:T[]=[];

	/**
	 * Hook that are activated before (free) function
	 * @param value value from free(value)
	 * @param pull this pull
	 * @param args params that are given in free(value,...args)
	 */
	onFree:(value: T, pull: Pull<T>, args: any)=> void;

	/**
	 * Hook that are activated before this.take or this.takeOrCreate
	 * @param value value that are return from this.take
	 * @param pull this pull
	 * @param args params in this.take(...args)
	 */
	onTake:(value: T, pull: Pull<T>, args: any)=> void;

	/**
	 * Amount of objects that are available or busy in pull
	 */
	size: number;

	/**
	 * Max size of pull, default value infinity
	 */
	maxSize:number;

	/**
	 * constructor that can create object immediately
	 * @param objectFactory
	 * @param size amount of object that will be created at initialization
	 * @param settings settings like "max pull size" and hooks
	 */
	constructor(objectFactory:()=>T, size:number = 0,
							settings:Partial<SpecialSettings<T>> = {}) {
		this.maxSize = settings.maxSize ?? Infinity;
		this.onFree = settings.onFree ?? (() => 1);

		this.onTake = settings.onTake ?? (() => 1);

		this.objectFactory = objectFactory;
		this.size = size;
		this.available = size;

		for (let i = 0; i < size; i++)
			this.stack.push(objectFactory());

	}

	/**
	 * Factory from constructor argument
	 */
	readonly objectFactory=():T => (<T>{});

	/**
	 * Return object from pull. Throw error if pull is empty
	 * @param args params for hooks
	 */
	take(...args:any): ReturnType<T> {
		const value = this.stack.pop();
		if(value === undefined) {
			throw new Error('Pull is empty');
		}

		this.available--;
		this.onTake(value, this, args);
		return {free: this.free.bind(this), value};
	}

	/**
	 * Take but if this.take throw error create new object
	 * @param args params for hooks
	 */
	takeOrCreate(...args:any): ReturnType<T> {
		if(this.available === 0 && this.size < this.maxSize) {
			this.size++;
			this.available++;
			this.stack.push(this.objectFactory());
		}

		return this.take(...args);
	}

	/**
	 * Return a Promise
	 * @param args params for hooks
	 */
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
