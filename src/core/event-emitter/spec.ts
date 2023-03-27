import EventEmitter from 'core/event-emitter';

describe('core/event-emitter', () => {
	describe('subscribes to an event and recieves the emitted data', () => {
		describe('subscribing by a callback', () => {
			it('until the callback is unsubscribed explicitly', () => {
				const
					emitter = new EventEmitter(),
					e = 'event';

				const
					listener = jest.fn(),
					recievedValues: unknown[] = [];

				emitter.on(e, (...values) => {
					recievedValues.push(...values);
					listener();
				});

				emitter.emit(e, 1);
				emitter.emit(e, 2, 3);

				expect(listener).toBeCalledTimes(2);
				expect(recievedValues).toEqual([1, 2, 3]);

				emitter.off(e);

				emitter.emit(e, 4, 5);

				expect(listener).toBeCalledTimes(2);
				expect(recievedValues).toEqual([1, 2, 3]);
			});

			it('until the event is emitted only once', () => {
				const
					emitter = new EventEmitter(),
					e = 'event';

				const
					listener = jest.fn(),
					recievedValues: unknown[] = [];

				emitter.once(e, (...values) => {
					recievedValues.push(...values);
					listener();
				});

				emitter.emit(e, 1);
				emitter.emit(e, 2, 3);

				expect(listener).toBeCalledTimes(1);
				expect(recievedValues).toEqual([1]);
			});
		});

		describe('subscribing via stream', () => {
			it('until all listeners to the event are unsubscribed', async () => {
				const
					emitter = new EventEmitter(),
					e = 'event';

				const
					stream = createStream(),
					listener = jest.fn(),
					recievedValues: unknown[] = [];

				emitter.emit(e, 1);
				emitter.emit(e, 2);

				queueMicrotask(() => emitter.emit(e, 3));
				queueMicrotask(() => emitter.off(e));

				await stream;

				expect(recievedValues).toEqual([1, 2, 3]);
				expect(listener).toBeCalledTimes(3);

				async function createStream(): Promise<void> {
					for await (const values of emitter.on(e)) {
						recievedValues.push(...values);
						listener();
					}
				}
			});

			it('until the event is emitted only once', async () => {
				const
					emitter = new EventEmitter(),
					e = 'event';

				const
					stream = createStream(),
					listener = jest.fn(),
					recievedValues: unknown[] = [];

				emitter.emit(e, 1);
				emitter.emit(e, 2);

				queueMicrotask(() => emitter.emit(e, 3));
				queueMicrotask(() => emitter.off(e));

				await stream;

				expect(recievedValues).toEqual([1]);
				expect(listener).toBeCalledTimes(1);

				async function createStream(): Promise<void> {
					for await (const values of emitter.once(e)) {
						recievedValues.push(...values);
						listener();
					}
				}
			});
		});
	});

	it.only('foo', async () => {
		const
			ee = new EventEmitter(),
			stream = createStream();

		ee.emit('foo', 'foo');

		queueMicrotask(() => ee.emit('bar', 'bar'));

		await stream;

		console.log('yoo');

		async function createStream(): Promise<void> {
			for await (const data of ee.once(['foo', 'bar'])) {
				console.log(data);
			}
		}
	});
});
