/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { ErrorsDeduplicatorMiddleware } from 'core/log/middlewares/errors-deduplicator';

describe('middlewares/errors-deduplicator', () => {
	describe('implementation', () => {
		beforeEach(() => {
			this.middleware = new ErrorsDeduplicatorMiddleware();
		});

		afterEach(() => {
			this.middleware = undefined;
		});

		it('an event without an error - the event should pass to the next middleware', () => {
			const
				event = createLogEvent(),
				eventCopy = copyLogEvent(event),
				nextCallbackSpy = jasmine.createSpy('next');

			this.middleware.exec(event, nextCallbackSpy);
			expect(nextCallbackSpy).toHaveBeenCalledOnceWith(eventCopy);
		});

		it('single error occurrence - the event should pass to the next middleware', () => {
			const
				event = createLogEvent(new Error('My awesome error')),
				eventCopy = copyLogEvent(event),
				nextCallbackSpy = jasmine.createSpy('next');

			this.middleware.exec(event, nextCallbackSpy);
			expect(nextCallbackSpy).toHaveBeenCalledOnceWith(eventCopy);
		});

		it('multiple error occurrences - only the first event should pass to the next middleware', () => {
			const
				error = new Error('My awesome error'),
				firstEvent = createLogEvent(error, 'first'),
				firstEventCopy = copyLogEvent(firstEvent),
				secondEvent = createLogEvent(error, 'second'),
				firstNextCallbackSpy = jasmine.createSpy('firstNext'),
				secondNextCallbackSpy = jasmine.createSpy('secondNext');

			this.middleware.exec(firstEvent, firstNextCallbackSpy);
			this.middleware.exec(secondEvent, secondNextCallbackSpy);

			expect(firstNextCallbackSpy).toHaveBeenCalledOnceWith(firstEventCopy);
			expect(secondNextCallbackSpy).not.toHaveBeenCalled();
		});

		it('multiple occurrences of errors with different references and the same message - all events pass to the next middleware', () => {
			const
				firstEvent = createLogEvent(new Error('Error'), 'first'),
				firstEventCopy = copyLogEvent(firstEvent),
				secondEvent = createLogEvent(new Error('Error'), 'second'),
				secondEventCopy = copyLogEvent(secondEvent),
				firstNextCallbackSpy = jasmine.createSpy('firstNext'),
				secondNextCallbackSpy = jasmine.createSpy('secondNext');

			this.middleware.exec(firstEvent, firstNextCallbackSpy);
			this.middleware.exec(secondEvent, secondNextCallbackSpy);

			expect(firstNextCallbackSpy).toHaveBeenCalledOnceWith(firstEventCopy);
			expect(secondNextCallbackSpy).toHaveBeenCalledOnceWith(secondEventCopy);
		});

		function createLogEvent(error, context = 'test') {
			const logEvent = {
				context,
				level: error ? 'error' : 'info',
				additionals: {}
			};

			if (error) {
				logEvent.error = error;
			}

			return logEvent;
		}

		function copyLogEvent(srcLogEvent) {
			const copy = {
				context: srcLogEvent.context,
				level: srcLogEvent.level,
				additionals: srcLogEvent.additionals
			};

			if (srcLogEvent.error) {
				copy.error = srcLogEvent.error;
			}

			return copy;
		}
	});
});
