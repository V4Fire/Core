import EventEmitter from 'core/event-emitter';

describe('core/event-emitter', () => {
	it.only('foo', async () => {
		const
			ee = new EventEmitter(),
			promise = ee.promifisy('foo');

		ee.emit('foo', 21, {data: 'bla'});

		const results = await promise;

		expect(results).toEqual([21, {data: 'bla'}, {event: 'foo'}]);
	});
});
