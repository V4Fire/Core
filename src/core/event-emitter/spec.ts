import EventEmitter from 'core/event-emitter';

describe('core/event-emitter', () => {
	describe('executes a listener and recieve the data', () => {
		it('every time an event is emitted', () => {
			const
				ee = new EventEmitter(),
				listener = jest.fn();

			const
				recievedValues: unknown[] = [];

			ee.on('foo', (...values) => {
				listener();
				recievedValues.push(...values);
			});

			ee.emit('foo', 1);
			ee.emit('foo', 2, 3);

			expect(listener).toBeCalledTimes(2);
			expect(recievedValues).toEqual([1, 2, 3]);
		});

		it('only once after emitting an event', () => {
			const
				ee = new EventEmitter(),
				listener = jest.fn();

			const
				recievedValues: unknown[] = [];

			ee.once('foo', (...values) => {
				listener();
				recievedValues.push(...values);
			});

			ee.emit('foo', 1);
			ee.emit('foo', 2, 3);

			expect(listener).toBeCalledTimes(1);
			expect(recievedValues).toEqual([1]);
		});
	});

	it('should not execute a listener after removing', () => {
		const
			ee = new EventEmitter(),
			listener = jest.fn();

		ee.on('foo', listener);

		ee.off('foo', listener);

		ee.emit('foo');

		expect(listener).not.toBeCalled();
	});

	describe('provides a "stream" interface via AsyncIterableIterator', () => {
		// TODO: description
		it('works asynchronously', async () => {
			const
				ee = new EventEmitter();

			const
				listener = jest.fn(),
				recievedValues: unknown[] = [],
				stream = wrapper();

			ee.emit('foo', 1);

			queueMicrotask(() => ee.emit('foo', 2, 3));

			queueMicrotask(() => ee.off('foo'));

			await stream;

			expect(listener).toBeCalledTimes(2);
			expect(recievedValues).toEqual([1, 2, 3]);

			async function wrapper(): Promise<void> {
				for await (const values of ee.on('foo')) {
					recievedValues.push(...values);
					listener();
				}
			}
		});

		it('works synchronously', async () => {
			const
				ee = new EventEmitter();

			const
				listener = jest.fn(),
				recievedValues: unknown[] = [],
				stream = wrapper();

			ee.emit('foo', 1);
			ee.emit('foo', 2, 3);

			ee.off('foo');

			await stream;

			expect(listener).toBeCalledTimes(2);
			expect(recievedValues).toEqual([1, 2, 3]);

			async function wrapper(): Promise<void> {
				for await (const values of ee.on('foo')) {
					recievedValues.push(...values);
					listener();
				}
			}
		});
	});
});
