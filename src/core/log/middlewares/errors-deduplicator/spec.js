/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import middlewareFactory from 'core/log/middlewares';
import { ErrorsDeduplicatorMiddleware } from 'core/log/middlewares/errors-deduplicator';

let middleware;

describe('middlewares/errors-deduplicator', () => {
	describe('implementation', () => {
		beforeEach(() => {
			middleware = new ErrorsDeduplicatorMiddleware();
		});

		afterEach(() => {
			middleware = undefined;
		});

		it('an event without an error - the event should pass to the next middleware', () => {
			const
				event = createLogEvent(),
				eventCopy = copyLogEvent(event),
				nextCallbackSpy = jest.fn().mockName('next');

			middleware.exec(event, nextCallbackSpy);
			expect(nextCallbackSpy).toHaveBeenLastCalledWith(eventCopy);
		});

		it('single error occurrence - the event should pass to the next middleware', () => {
			const
				event = createLogEvent(new Error('My awesome error')),
				eventCopy = copyLogEvent(event),
				nextCallbackSpy = jest.fn().mockName('next');

			middleware.exec(event, nextCallbackSpy);
			expect(nextCallbackSpy).toHaveBeenLastCalledWith(eventCopy);
		});

		it('multiple error occurrences - only the first event should pass to the next middleware', () => {
			const
				error = new Error('My awesome error'),
				firstEvent = createLogEvent(error, 'first'),
				firstEventCopy = copyLogEvent(firstEvent),
				secondEvent = createLogEvent(error, 'second'),
				firstNextCallbackSpy = jest.fn().mockName('firstNext'),
				secondNextCallbackSpy = jest.fn().mockName('secondNext');

			middleware.exec(firstEvent, firstNextCallbackSpy);
			middleware.exec(secondEvent, secondNextCallbackSpy);

			expect(firstNextCallbackSpy).toHaveBeenLastCalledWith(firstEventCopy);
			expect(secondNextCallbackSpy).not.toHaveBeenCalled();
		});

		it('multiple occurrences of errors with different references and the same message - all events pass to the next middleware', () => {
			const
				firstEvent = createLogEvent(new Error('Error'), 'first'),
				firstEventCopy = copyLogEvent(firstEvent),
				secondEvent = createLogEvent(new Error('Error'), 'second'),
				secondEventCopy = copyLogEvent(secondEvent),
				firstNextCallbackSpy = jest.fn().mockName('firstNext'),
				secondNextCallbackSpy = jest.fn().mockName('secondNext');

			middleware.exec(firstEvent, firstNextCallbackSpy);
			middleware.exec(secondEvent, secondNextCallbackSpy);

			expect(firstNextCallbackSpy).toHaveBeenLastCalledWith(firstEventCopy);
			expect(secondNextCallbackSpy).toHaveBeenLastCalledWith(secondEventCopy);
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

	describe('factory', () => {
		it('has "errorsDeduplicator" instance', () => {
			expect('errorsDeduplicator' in middlewareFactory).toBe(true);
		});

		it('"errorsDeduplicator" is instance of ErrorsDeduplicatorMiddleware', () => {
			expect(middlewareFactory.errorsDeduplicator() instanceof ErrorsDeduplicatorMiddleware).toBe(true);
		});
	});
});
