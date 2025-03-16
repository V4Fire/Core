import type { EmitterEvent } from 'core/event-emitter/interface';

/**
 *
 */
export function isEmitterEvent(event: unknown): event is EmitterEvent {
	return Object.isString(event);
}
