import type defaultEngine from 'core/event-emitter/engines/default';

/**
 *
 */
export interface EmitterOptions<T extends EmitterEngineFactory = typeof defaultEngine> {
	/**
	 *
	 */
	engine?: T;

	/**
	 *
	 */
	engineOptions?: InferFactoryParameters<T>;
}

/**
 *
 */
export type EmitterEngineFactory = (params?: Dictionary) => EmitterEngine;

/**
 *
 */
export interface EmitterEngine {
	/**
	 *
	 */
	on(event: EmitterEvent, handler: AnyFunction): void;

	/**
	 *
	 */
	off(event: EmitterEvent, handler: AnyFunction): void;

	/**
	 *
	 */
	emit(event: EmitterEvent, ...params: unknown[]): void;

	/**
	 *
	 */
	offAll(event?: EmitterEvent): void;

	/**
	 *
	 */
	getEvents(): EmitterEvent[];
}

/**
 *
 */
export type EmitterEvent = string;

/**
 *
 */
export type EventHandler = (...params: HandlerParameters) => void;

/**
 *
 */
export type HandlerParameters = [...values: HandlerValues, meta: HandlerMeta];

/**
 *
 */
export interface HandlerMeta {
	/**
	 *
	 */
	event: EmitterEvent;
}

/**
 *
 */
export type HandlerValues = unknown[];

/**
 *
 */
type InferFactoryParameters<T extends EmitterEngineFactory> = Parameters<T>[0];

export interface OffOptions {
	emit?: boolean;
}
