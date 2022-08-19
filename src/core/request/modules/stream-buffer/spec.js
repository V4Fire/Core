/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import StreamBuffer from 'core/request/modules/stream-buffer';

describe('core/request/modules/stream-buffer', () => {
	const
		globalChunks = ['chunk1', 'chunk2', 'chunk3'];

	it('passing values to a stream constructor', () => {
		const
			arr = ['value1', 'value2', 'value3'],
			set = new Set(arr),
			sc1 = new StreamBuffer([...arr]),
			sc2 = new StreamBuffer(set);

		expect([...sc1]).toEqual(arr);
		expect([...sc2]).toEqual(arr);
	});

	it('adding new values to the stream', () => {
		const
			streamBuffer = new StreamBuffer();

		streamBuffer.add('value1');
		streamBuffer.add('value2');

		expect([...streamBuffer]).toEqual(['value1', 'value2']);
	});

	it('adding new values to the closed stream should be ignored', () => {
		const
			streamBuffer = new StreamBuffer();

		streamBuffer.add('value1');
		streamBuffer.close();

		streamBuffer.add('value2');
		streamBuffer.add('value3');

		expect([...streamBuffer]).toEqual(['value1']);
	});

	it('iteration over buffered values via a synchronous iterator', () => {
		const
			streamBuffer = new StreamBuffer();

		for (const chunk of globalChunks) {
			streamBuffer.add(chunk);
		}

		expect([...streamBuffer]).toEqual(globalChunks);
	});

	it('closing the stream should finish a registered asynchronous iterator', async () => {
		const
			streamBuffer = new StreamBuffer(),
			queue = globalChunks.slice(),
			chunks = [];

		setTimeout(function cb() {
			streamBuffer.add(queue.shift());

			if (queue.length) {
				setTimeout(cb, 50);

			} else {
				streamBuffer.close();
			}
		}, 50);

		for await (const chunk of streamBuffer) {
			chunks.push(chunk);
		}

		expect(chunks).toEqual(globalChunks);
	});

	it('destroying the stream with throwing an error if an asynchronous iterator is already called', async () => {
		await expect((async () => {
			const
				streamBuffer = new StreamBuffer();

			setTimeout(function cb() {
				streamBuffer.destroy('Reason to destroy');
			});

			for await (const val of streamBuffer) {
				console.log('Unreachable code', val);
			}
		})()).rejects.toBe('Reason to destroy');
	});

	it("destroying the stream without throwing an error if an asynchronous iterator isn't already called", async () => {
		await expect(Promise.resolve().then(() => {
			const streamBuffer = new StreamBuffer();
			streamBuffer.destroy('reason');
		})).resolves.toBe(undefined);
	});

	it('destroying the already closed stream should do nothing', async () => {
		await expect((async () => {
			const
				streamBuffer = new StreamBuffer();

			setTimeout(function cb() {
				streamBuffer.close();
			});

			for await (const value of streamBuffer) {
				console.log('unreachable code: ', value);
			}

			streamBuffer.destroy('reason');
		})()).resolves.toBe(undefined);
	});
});
