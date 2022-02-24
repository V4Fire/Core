import type SyncPromise from 'core/promise/sync';

export type hookParams<T> =(value:T, pull:AbstractPull<T>, ...args:any)=>void;

export interface SpecialSettings<T>{
	maxSize:number;
	onTake:hookParams<T>;
	onFree:hookParams<T>;
}

export interface ReturnType<T>{
	free(val:T, args:any): void;
	value:T;
}

/**
 * Abstract class for a pull of object
 * @typeparam T - type of object in pull
 */
export default abstract class AbstractPull<T> {

	/**
	 * Amount of available now objects
	 */
	abstract available:number;

	/**
	 * Factory from constructor argument
	 */
	abstract readonly objectFactory:()=>T;

	/**
	 * Hook that are activated before (free) function
	 */
	abstract onFree:hookParams<T>;

	/**
	 * Hook that are activated before this.take or this.takeOrCreate
	 */
	abstract onTake:hookParams<T>;

	/**
	 * Max size of pull, default value infinity
	 */
	abstract maxSize:number;

	/**
	 * Amount of objects that are available or busy in pull
	 */
	abstract size: number;

	/**
	 * Take but if this.take throw error create new object
	 * @param args params for hooks
	 */
	abstract takeOrCreate(...args:any):ReturnType<T>;

	/**
	 * Return a Promise
	 * @param args params for hooks
	 */
	abstract takeOrWait(...args:any):SyncPromise<ReturnType<T>>;

	/**
	 * Return object from pull. Throw error if pull is empty
	 * @param args params for hooks
	 */
	abstract take(...args:any): ReturnType<T>;
}
