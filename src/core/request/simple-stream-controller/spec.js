/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { set, get } from 'core/env';
import StreamController from 'core/request/simple-stream-controller';

describe('core/request/simple-stream-controller', () => {
	let
		globalChunks,
		logOptions;

	beforeAll(async () => {
		globalChunks = ['chunk1', 'chunk2', 'chunk3'];
		logOptions = await get('log');
		set('log', {patterns: []});
	});

	afterAll(() => {
		set('log', logOptions);
	});

	describe('core/request/simple-stream-controller', () => {
		it('constructor takes initial items as iterable object', () => {
			const
				arr = ['item1', 'item2', 'item3'],
				set = new Set(arr),
				sc1 = new StreamController([...arr]),
				sc2 = new StreamController(set);

			expect([...sc1]).toEqual(arr);
			expect([...sc2]).toEqual(arr);
		});

		it('"add" method adds items to the stream', () => {
			const
				streamController = new StreamController();

			streamController.add('item1');
			streamController.add('item2');

			expect([...streamController]).toEqual(['item1', 'item2']);
		});

		it('if the stream is closed, adding new items is ignored', () => {
			const
				streamController = new StreamController();

			streamController.add('item1');
			streamController.close();
			streamController.add('item2');
			streamController.add('item3');

			expect([...streamController]).toEqual(['item1']);
		});

		it('"close" method interrupts the async loop and closes the stream', async () => {
			const
				streamController = new StreamController(),
				queue = globalChunks.slice(),
				chunks = [];

			setTimeout(function cb() {
				streamController.add(queue.shift());

				if (queue.length) {
					setTimeout(cb, 50);
				} else {
					streamController.close();
				}
			}, 50);

			for await (const chunk of streamController) {
				chunks.push(chunk);
			}

			expect(chunks).toEqual(globalChunks);
		});

		it('the stream is iterable object allowing to go through all items that were already added', () => {
			const
				streamController = new StreamController();

			for (const chunk of globalChunks) {
				streamController.add(chunk);
			}

			expect([...streamController]).toEqual(globalChunks);
		});

		it('"destroy" method close the stream and throws an error if async iterator is called', async () => {
			await expectAsync((async () => {
				const
					streamController = new StreamController();

				setTimeout(function cb() {
					streamController.destroy('reason');
				});

				for await (const item of streamController) {
					console.log('unreachable code', item);
				}
			})()).toBeRejectedWith('reason');
		});

		it('destroy" method closes the stream without throwing an error if async iterator isn\'t called,', async () => {
			await expectAsync(Promise.resolve().then(() => {
				const
					streamController = new StreamController();

				streamController.destroy('reason');
			})).not.toBeRejected();
		});

		it('"destroy" does nothing if the stream is already closed', async () => {
			await expectAsync((async () => {
				const
					streamController = new StreamController();

				setTimeout(function cb() {
					streamController.close();
				});

				for await (const item of streamController) {
					console.log('unreachable code: ', item);
				}

				streamController.destroy('reason');
			})()).not.toBeRejected();
		});
	});
});
