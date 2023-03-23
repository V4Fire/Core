import { EventEmitter2 } from 'eventemitter2';

import type { ConstructorOptions } from 'eventemitter2';

import type { EmitterEngine, EmitterEvent } from 'core/event-emitter/interface';

/**
 *
 */
class Engine extends EventEmitter2 implements EmitterEngine {
	/**
	 *
	 */
	offAll(event?: CanArray<EmitterEvent>): void {
		this.removeAllListeners(event);
	}

	/**
	 *
	 */
	getEvents(): EmitterEvent[] {
		return this.eventNames().map((event) => {
			if (Array.isArray(event)) {
				return String(event).replaceAll(',', '.');
			}

			return String(event);
		});
	}
}

/**
 *
 */
export default function factory(options?: ConstructorOptions): Engine {
	return new Engine(options);
}
