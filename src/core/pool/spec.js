/* eslint-disable max-lines, max-lines-per-function */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Pool from 'core/pool';

describe('core/pool', () => {
	describe('constructor', () => {
		it('should create a pool with a zero size', () => {
			const pool = new Pool(() => []);
			expect(pool.size).toBe(0);
		});

		it('should create a pool with the specified size', () => {
			const pool = new Pool(() => [], {size: 10});
			expect(pool.size).toBe(10);
		});

		it('should create a pool with passing the extra arguments to a resource constructor', () => {
			const pool = new Pool((...values) => [...values], (i) => [i], {
				size: 2,
				hashFn: (...args) => Object.fastHash(args)
			});

			expect(pool.size).toBe(2);
			expect(pool.take(0).value).toEqual([0]);
			expect(pool.take(1).value).toEqual([1]);
			expect(pool.take(2).value).toBeNull();
		});

		it('should create a pool with hashing of resources', () => {
			const
				pool = new Pool((...values) => [...values], [1, 2, 3], {size: 1});

			expect(pool.size).toBe(1);
			expect(pool.take().value).toEqual([1, 2, 3]);
		});

		it('should throw an exception if `maxSize` less than `size`', () => {
			let err;

			try {
				// eslint-disable-next-line no-new
				new Pool(() => [], {
					size: 2,
					maxSize: 1
				});

			} catch (e) {
				err = e;
			}

			expect(err.message).toBe('The pool contains too many resources');
		});
	});

	describe('`take`', () => {
		it('should return an available resource from the pool', () => {
			const pool = new Pool(() => [], {size: 2});

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(2);

			expect(pool.take().value).toEqual([]);

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(1);
		});

		it('should return a nullish wrapper if the pool is empty', () => {
			const
				pool = new Pool((...values) => [...values]);

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
			expect(pool.take().value).toBeNull();
		});

		it('should release a resource after invoking of `free`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.take();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			resource.free();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);
		});

		it('should release a nullish resource after invoking of `free`', () => {
			const
				pool = new Pool(() => []),
				resource = pool.take();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);

			resource.free();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should ignore more than one invoking of `free`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.take();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			resource.free();
			resource.free();
			resource.free();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);
		});

		it('should destroy a resource after invoking of `destroy`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.take();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			resource.destroy();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should destroy a nullish resource after invoking of `destroy`', () => {
			const
				pool = new Pool(() => []),
				resource = pool.take();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);

			resource.destroy();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should ignore more than one invoking of `destroy`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.take();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			resource.destroy();
			resource.destroy();
			resource.destroy();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should ignore invoking of `destroy` after `free`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.take();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			resource.free();
			resource.destroy();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);
		});

		it('should ignore invoking of `free` after `destroy`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.take();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			resource.destroy();
			resource.free();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should throw an exception if `maxSize` less than `size`', () => {
			const pool = new Pool(() => [], {
				maxSize: 2
			});

			expect(pool.maxSize).toBe(2);

			pool.takeOrCreate();
			pool.takeOrCreate();

			let
				err;

			try {
				pool.takeOrCreate();

			} catch (e) {
				err = e;
			}

			expect(err.message).toBe('The pool contains too many resources');
		});

		it('attaching the `onTake` hook handler', () => {
			const scan = [];

			const pool = new Pool(() => [], {
				size: 1,
				onTake: (...args) => {
					scan.push(args);
				}
			});

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			pool.take(1, 2, 3);

			expect(pool.available).toBe(0);

			pool.take(4, 5, 6);

			expect(scan.length).toBe(1);
			expect(scan[0][0]).toEqual([]);
			expect(scan[0][1]).toBe(pool);

			expect(scan[0].slice(2)).toEqual([1, 2, 3]);
		});

		it('attaching the `onFree` hook handler', () => {
			const scan = [];

			const pool = new Pool(() => [], {
				size: 1,
				onFree: (...args) => {
					scan.push(args);
				}
			});

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			const
				resource = pool.take();

			expect(pool.available).toBe(0);

			pool.take().free(1, 2, 3);
			resource.free(4, 5, 6);

			expect(scan.length).toBe(1);
			expect(scan[0][0]).toEqual([]);
			expect(scan[0][1]).toBe(pool);

			expect(scan[0].slice(2)).toEqual([4, 5, 6]);
		});
	});

	describe('`takeOrCreate`', () => {
		it('should return an available resource from the pool', () => {
			const pool = new Pool(() => [], {size: 2});

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(2);

			expect(pool.takeOrCreate().value).toEqual([]);

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(1);
		});

		it('should create a new resource if the pool is empty', () => {
			const
				pool = new Pool((...values) => [...values]);

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);

			const
				resource = pool.takeOrCreate(1, 2, 3);

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			expect(resource.value).toEqual([1, 2, 3]);
			resource.free();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);
		});

		it('should return an available resource from the pool matched by a hash', () => {
			const pool = new Pool((...values) => [...values], {
				hashFn: (...args) => Object.fastHash(args)
			});

			pool.takeOrCreate(1, 2, 3).free();

			const
				resource = pool.take(1, 2, 3);

			expect(resource.value).toEqual([1, 2, 3]);

			resource.free();
			expect(pool.take(1, 2).value).toBeNull();
		});

		it('attaching the `onTake` hook handler', () => {
			const scan = [];

			const pool = new Pool((...values) => [...values], {
				onTake: (...args) => {
					scan.push(args);
				}
			});

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);

			pool.takeOrCreate(1, 2, 3);

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			pool.takeOrCreate(4, 5, 6);

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(0);

			expect(scan.length).toBe(2);

			expect(scan[0][0]).toEqual([1, 2, 3]);
			expect(scan[0][1]).toBe(pool);
			expect(scan[0].slice(2)).toEqual([1, 2, 3]);

			expect(scan[1][0]).toEqual([4, 5, 6]);
			expect(scan[1][1]).toBe(pool);
			expect(scan[1].slice(2)).toEqual([4, 5, 6]);
		});

		it('attaching the `onFree` hook handler', () => {
			const scan = [];

			const pool = new Pool(() => [], {
				onFree: (...args) => {
					scan.push(args);
				}
			});

			pool.takeOrCreate().free(1, 2, 3);
			pool.takeOrCreate().destroy();
			pool.takeOrCreate().free(4, 5, 6);

			expect(scan.length).toBe(2);

			expect(scan[0][0]).toEqual([]);
			expect(scan[0][1]).toBe(pool);
			expect(scan[0].slice(2)).toEqual([1, 2, 3]);

			expect(scan[1][0]).toEqual([]);
			expect(scan[1][1]).toBe(pool);
			expect(scan[1].slice(2)).toEqual([4, 5, 6]);
		});
	});

	describe('`takeOrWait`', () => {
		it('should return an available resource from the pool', () => {
			const pool = new Pool(() => [], {size: 2});

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(2);

			let val;

			pool.takeOrWait().then(({value}) => val = value);

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(1);

			expect(val).toEqual([]);
		});

		it('should wait an available resource from the pool', async () => {
			const
				pool = new Pool((...values) => [...values], {size: 1});

			const
				resource = pool.take();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			const
				resourcePromise1 = pool.takeOrWait(),
				resourcePromise2 = pool.takeOrWait();

			resource.free();
			expect((await resourcePromise1).value).toEqual([]);

			pool.takeOrCreate(1, 2, 3).free();
			expect((await resourcePromise2).value).toEqual([1, 2, 3]);
		});

		it('attaching the `onTake` hook handler', () => {
			const scan = [];

			const pool = new Pool(() => [], {
				size: 1,
				onTake: (...args) => {
					scan.push(args);
				}
			});

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			pool.takeOrWait(1, 2, 3);

			expect(pool.available).toBe(0);

			pool.takeOrWait(4, 5, 6);
			pool.takeOrCreate().free();

			expect(scan.length).toBe(3);

			expect(scan[0][0]).toEqual([]);
			expect(scan[0][1]).toBe(pool);
			expect(scan[0].slice(2)).toEqual([1, 2, 3]);

			expect(scan[2][0]).toEqual([]);
			expect(scan[2][1]).toBe(pool);
			expect(scan[2].slice(2)).toEqual([4, 5, 6]);
		});
	});

	describe('`borrow`', () => {
		it('should borrow an available resource from the pool', () => {
			const pool = new Pool(() => [], {size: 1});

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			expect(pool.borrow().value).toEqual([]);

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);
		});

		it('should allow borrowing with multiple consumers', () => {
			const pool = new Pool(() => [], {size: 1});

			expect(pool.borrow().value).toEqual([]);
			expect(pool.borrow().value).toEqual([]);
			expect(pool.borrow().value).toEqual([]);
			expect(pool.borrow().value).toEqual([]);

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);
		});

		it('should return a nullish wrapper if the pool is empty', () => {
			const
				pool = new Pool((...values) => [...values]);

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
			expect(pool.borrow().value).toBeNull();
		});

		it('should release a resource after invoking of `free`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.borrow();

			expect(pool.take().value).toBeNull();

			resource.free();

			expect(pool.take().value).toEqual([]);
		});

		it('should release a nullish resource after invoking of `free`', () => {
			const
				pool = new Pool(() => []),
				resource = pool.borrow();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);

			resource.free();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should ignore more than one invoking of `free`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.borrow();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			resource.free();
			resource.free();
			resource.free();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);
		});

		it('should destroy a resource after invoking of `destroy`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.borrow();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			resource.destroy();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should destroy a nullish resource after invoking of `destroy`', () => {
			const
				pool = new Pool(() => []),
				resource = pool.borrow();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);

			resource.destroy();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should ignore more than one invoking of `destroy`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.borrow();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			resource.destroy();
			resource.destroy();
			resource.destroy();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should ignore invoking of `destroy` after `free`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.borrow();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			resource.free();
			resource.destroy();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);
		});

		it('should ignore invoking of `free` after `destroy`', () => {
			const
				pool = new Pool(() => [], {size: 1}),
				resource = pool.borrow();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			resource.destroy();
			resource.free();

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);
		});

		it('should throw an exception if `maxSize` less than `size`', () => {
			const pool = new Pool(() => [], {
				maxSize: 2
			});

			expect(pool.maxSize).toBe(2);

			pool.takeOrCreate();
			pool.takeOrCreate();

			let
				err;

			try {
				pool.borrowOrCreate();

			} catch (e) {
				err = e;
			}

			expect(err.message).toBe('The pool contains too many resources');
		});

		it('attaching the `onBorrow` hook handler', () => {
			const scan = [];

			const pool = new Pool(() => [], {
				size: 1,
				onBorrow: (...args) => {
					scan.push(args);
				}
			});

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			pool.borrow(1, 2, 3);

			expect(pool.available).toBe(1);

			pool.borrow(4, 5, 6);

			expect(scan.length).toBe(2);

			expect(scan[0][0]).toEqual([]);
			expect(scan[0][1]).toBe(pool);

			expect(scan[0].slice(2)).toEqual([1, 2, 3]);

			expect(scan[1][0]).toEqual([]);
			expect(scan[1][1]).toBe(pool);

			expect(scan[1].slice(2)).toEqual([4, 5, 6]);
		});

		it('attaching the `onFree` hook handler', () => {
			const scan = [];

			const pool = new Pool(() => [], {
				size: 1,
				onFree: (...args) => {
					scan.push(args);
				}
			});

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			const
				resource = pool.borrow();

			expect(pool.available).toBe(1);

			pool.borrow().free(1, 2, 3);
			resource.free(4, 5, 6);

			expect(scan.length).toBe(2);

			expect(scan[0][0]).toEqual([]);
			expect(scan[0][1]).toBe(pool);

			expect(scan[0].slice(2)).toEqual([1, 2, 3]);

			expect(scan[1][0]).toEqual([]);
			expect(scan[1][1]).toBe(pool);

			expect(scan[1].slice(2)).toEqual([4, 5, 6]);
		});
	});

	describe('`borrowOrCreate`', () => {
		it('should return an available resource from the pool', () => {
			const pool = new Pool(() => [], {size: 2});

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(2);

			expect(pool.borrowOrCreate().value).toEqual([]);

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(2);
		});

		it('should create a new resource if the pool is empty', () => {
			const
				pool = new Pool((...values) => [...values]);

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);

			const
				resource = pool.borrowOrCreate(1, 2, 3);

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			expect(resource.value).toEqual([1, 2, 3]);
			resource.free();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);
		});

		it('should return an available resource from the pool matched by a hash', () => {
			const pool = new Pool((...values) => [...values], {
				hashFn: (...args) => Object.fastHash(args)
			});

			pool.borrowOrCreate(1, 2, 3).free();

			const
				resource = pool.take(1, 2, 3);

			expect(resource.value).toEqual([1, 2, 3]);

			resource.free();
			expect(pool.borrow(1, 2).value).toBeNull();
		});

		it('attaching the `onBorrow` hook handler', () => {
			const scan = [];

			const pool = new Pool((...values) => [...values], {
				onBorrow: (...args) => {
					scan.push(args);
				}
			});

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);

			pool.borrowOrCreate(1, 2, 3);

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			pool.borrowOrCreate(4, 5, 6);

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			expect(scan.length).toBe(2);

			expect(scan[0][0]).toEqual([1, 2, 3]);
			expect(scan[0][1]).toBe(pool);
			expect(scan[0].slice(2)).toEqual([1, 2, 3]);

			expect(scan[1][0]).toEqual([1, 2, 3]);
			expect(scan[1][1]).toBe(pool);
			expect(scan[1].slice(2)).toEqual([4, 5, 6]);
		});

		it('attaching the `onFree` hook handler', () => {
			const scan = [];

			const pool = new Pool(() => [], {
				onFree: (...args) => {
					scan.push(args);
				}
			});

			pool.borrowOrCreate().free(1, 2, 3);
			pool.borrowOrCreate().destroy();
			pool.borrowOrCreate().free(4, 5, 6);

			expect(scan.length).toBe(2);

			expect(scan[0][0]).toEqual([]);
			expect(scan[0][1]).toBe(pool);
			expect(scan[0].slice(2)).toEqual([1, 2, 3]);

			expect(scan[1][0]).toEqual([]);
			expect(scan[1][1]).toBe(pool);
			expect(scan[1].slice(2)).toEqual([4, 5, 6]);
		});
	});

	describe('`borrowOrWait`', () => {
		it('should return an available resource from the pool', () => {
			const pool = new Pool(() => [], {size: 2});

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(2);

			let val;

			pool.borrowOrWait().then(({value}) => val = value);

			expect(pool.size).toBe(2);
			expect(pool.available).toBe(2);

			expect(val).toEqual([]);
		});

		it('should wait an available resource from the pool', async () => {
			const
				pool = new Pool((...values) => [...values], {size: 1});

			const
				resource = pool.take();

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			const
				resourcePromise1 = pool.borrowOrWait(),
				resourcePromise2 = pool.borrowOrWait();

			resource.free();

			expect((await resourcePromise1).value).toEqual([]);
			expect((await resourcePromise2).value).toEqual([]);
		});

		it('attaching the `onBorrow` hook handler', () => {
			const scan = [];

			const pool = new Pool(() => [], {
				size: 1,
				onBorrow: (...args) => {
					scan.push(args);
				}
			});

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(1);

			pool.borrowOrWait(1, 2, 3);

			expect(pool.available).toBe(1);

			pool.borrowOrWait(4, 5, 6);

			expect(scan.length).toBe(2);

			expect(scan[0][0]).toEqual([]);
			expect(scan[0][1]).toBe(pool);
			expect(scan[0].slice(2)).toEqual([1, 2, 3]);

			expect(scan[1][0]).toEqual([]);
			expect(scan[1][1]).toBe(pool);
			expect(scan[1].slice(2)).toEqual([4, 5, 6]);
		});
	});

	describe('`clear`', () => {
		it('should clear all available and unavailable resources', async () => {
			const
				scan = [];

			const pool = new Pool((...values) => [...values], (i) => [i], {
				size: 3,
				resourceDestructor: (resource) => {
					scan.push(resource);
				}
			});

			pool.take();
			pool.borrow();
			pool.borrow();
			pool.take();

			const
				promise = pool.takeOrWait();

			pool.clear();
			pool.takeOrCreate('boom').free();

			expect((await promise).value).toEqual(['boom']);

			expect(pool.size).toBe(1);
			expect(pool.available).toBe(0);

			expect(scan.sort(([a], [b]) => a - b)).toEqual([
				[0],
				[1],
				[2]
			]);
		});

		it('attaching the `onClear` hook handler', () => {
			const scan = [];

			const pool = new Pool(() => [], {
				size: 3,
				onClear: (...args) => {
					scan.push(args);
				}
			});

			pool.clear(1, 2, 3);

			expect(pool.size).toBe(0);
			expect(pool.available).toBe(0);

			expect(scan[0][0]).toBe(pool);
			expect(scan[0].slice(1)).toEqual([1, 2, 3]);
		});
	});
});
