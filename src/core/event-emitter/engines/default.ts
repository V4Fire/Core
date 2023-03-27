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
		return this.eventNames().flatMap((event) => {
			if (Array.isArray(event)) {
				return event.map(String);
			}

			return String(event);
		});
	}

	/**
	 *
	 */
	override hasListeners(event: string): boolean {
		return <boolean>super.hasListeners(event);
	}
}

/**
 *
 */
export default function factory(options?: ConstructorOptions): Engine {
	return new Engine(options);
}
