import type EventEmitter from 'core/event-emitter';
import type { HandlerParameters, EmitterEvent } from 'core/event-emitter/interface';

import { createsAsyncSemaphore } from 'core/event';

export default function createEmitterPromise(
	emitter: EventEmitter,
	events: EmitterEvent[]
): Promise<HandlerParameters> {
	return new Promise((resolve, reject) => {
		const
			handler = (...params: HandlerParameters) => resolve(params);

		emitter.once(events, handler);

		const
			semaphore = createsAsyncSemaphore(reject, ...events);

		for (const event of events) {
			emitter.once(`off.${event}`, () => {
				emitter.off(event, handler, {emit: false});
				semaphore(event);
			});
		}
	});
}
