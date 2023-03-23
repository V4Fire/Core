import type { EmitterOptions } from 'core/event-emitter/interface';

import defaultEngine from 'core/event-emitter/engines/default';

export const defaultOptions: Required<EmitterOptions> = {
	engine: defaultEngine,
	engineOptions: {}
};
