import type { EmitterEvent, HandlerValues } from 'core/event-emitter/interface';

/**
 *
 */
export interface QueueChunk {
	/**
	 *
	 */
	value: HandlerValues;

	/**
	 *
	 */
	event: EmitterEvent;
}

/**
 *
 */
export interface LocalOptions {
	/**
	 *
	 */
	forbid?: boolean;
}
