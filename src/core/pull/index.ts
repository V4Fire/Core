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

export default class Pull<T> extends AbstractPull<T> {
	available: number;
	stack:T[]=[];

	onFree:(resources: T, pull: AbstractPull<T>, args: any)=> void;

	onTake:(resources: T, pull: AbstractPull<T>, args: any)=> void;

	size: number;
	maxSize:number;

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
	readonly objectFactory=():T => (<T>{});

	take(...args:any): ReturnType<T> {
		const value = this.stack.pop();
		if(value === undefined) {
			throw new Error('Pull is empty');
		}

		this.available--;
		this.onTake(value, this, args);
		return {free: this.free.bind(this), value};
	}

	takeOrCreate(...args:any): ReturnType<T> {
		if(this.available === 0 && this.size < this.maxSize) {
			this.size++;
			this.available++;
			this.stack.push(this.objectFactory());
		}

		return this.take(...args);
	}

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

	free(value:T, ...args:any):void {
		this.onFree(value, this, args);
		this.available++;
		this.stack.push(value);
	}
}
