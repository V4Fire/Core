import EventEmitter from 'core/event-emitter';

describe('core/event-emitter', () => {
	describe('subscribes to an event and recieves the emitted data', () => {
		describe('until all events are emitted only once', () => {
			it('via callback', () => {
				const
					emitter = new EventEmitter(),
					events = ['foo', 'bar'];

				const
					listener = jest.fn(),
					recievedValues: unknown[] = [];

				emitter.once(events, (...values) => {
					recievedValues.push(...values);
					listener();
				});

				emitter.emit('foo', 1);
				expect(listener).toBeCalledTimes(1);
				expect(recievedValues).toEqual([1]);

				emitter.emit('bar', 2, 3);
				expect(listener).toBeCalledTimes(2);
				expect(recievedValues).toEqual([1, 2, 3]);

				emitter.emit('foo', 4);
				emitter.emit('bar', 5, 6);

				expect(listener).toBeCalledTimes(2);
				expect(recievedValues).toEqual([1, 2, 3]);
			});

			it('via stream', async () => {
				const
					emitter = new EventEmitter(),
					events = ['foo', 'bar'];

				const
					stream = createStream(),
					listener = jest.fn(),
					recievedValues: unknown[] = [];

				emitter.emit('foo', 1);
				emitter.emit('foo', 2);

				queueMicrotask(() => emitter.emit('bar', 3));
				queueMicrotask(() => emitter.emit('bar', 4));

				await stream;

				expect(listener).toBeCalledTimes(2);
				expect(recievedValues).toEqual([1, 3]);

				async function createStream(): Promise<void> {
					for await (const values of emitter.once(events)) {
						recievedValues.push(...values);
						listener();
					}
				}
			});
		});

		describe('until any of the events is emitted only once', () => {
			it('via callback', () => {
				const
					emitter = new EventEmitter(),
					events = ['foo', 'bar'];

				const
					listener = jest.fn(),
					recievedValues: unknown[] = [];

				emitter.any(events, (...values) => {
					recievedValues.push(...values);
					listener();
				});

				const [first, second] = Math.random() > 0.5 ? events : [...events].reverse();

				emitter.emit(first, 1);
				emitter.emit(first, 2);
				emitter.emit(second, 3);

				expect(listener).toBeCalledTimes(1);
				expect(recievedValues).toEqual([1]);
			});

			it('via stream', async () => {
				const
					emitter = new EventEmitter(),
					events = ['foo', 'bar'];

				const
					stream = createStream(),
					listener = jest.fn(),
					recievedValues: unknown[] = [];

				const
					[first, second] = Math.random() > 0.5 ? events : [...events].reverse();

				emitter.emit(first, 1);
				emitter.emit(first, 2);
				emitter.emit(second, 3);

				await stream;

				expect(recievedValues).toEqual([1]);
				expect(listener).toBeCalledTimes(1);

				async function createStream(): Promise<void> {
					for await (const values of emitter.any(events)) {
						recievedValues.push(...values);
						listener();
					}
				}
			});
		});

		it('subscribing by a callback until it is unsubscribed explicitly', () => {
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

		it('subscribing via stream until all listeners to the event are unsubscribed', async () => {
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
	});
});
