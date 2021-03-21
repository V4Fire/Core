/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { ExtractorMiddleware } from 'core/log/middlewares/extractor';
import { createLogEvent, copyLogEvent } from 'core/log/middlewares/testing';
import { TestDetailedError, TestBaseError, TestDetailedBaseError, TestExtractor } from 'core/log/middlewares/extractor/testing';

describe('middlewares/extractor', () => {
	describe('no error extractors', () => {
		beforeEach(() => {
			this.middleware = new ExtractorMiddleware();
		});

		afterEach(() => {
			this.middleware = undefined;
		});

		it('no error within a log event', () => {
			const logEvent = createLogEvent();

			this.middleware.exec(logEvent, (res) => {
				expect(res).toEqual(copyLogEvent(logEvent));
			});
		});

		it('error without details', () => {
			const logEvent = createLogEvent(new Error('no details'));

			this.middleware.exec(logEvent, (res) => {
				expect(res).toEqual(copyLogEvent(logEvent));
			});
		});

		it('error with details', () => {
			const
				errorDetails = {msg: 'just for fun'},
				logEvent = createLogEvent(new TestDetailedError('details', errorDetails));

			this.middleware.exec(logEvent, (res) => {
				expect(res).toEqual(copyLogEvent(
					logEvent,
					{error: {details: {reason: errorDetails}}}
				));
			});
		});

		it('error with a cause', () => {
			const
				causeErrorMessage = 'general error',
				logEvent = createLogEvent(new TestBaseError('no details', new Error(causeErrorMessage)));

			this.middleware.exec(logEvent, (res) => {
				expect(res).toEqual(copyLogEvent(
					logEvent,
					{error: {cause: {error: {name: 'Error', message: causeErrorMessage}}}}
				));
			});
		});

		it('error with details and a cause', () => {
			const
				errorDetails = {msg: 'yep'},
				causeErrorMessage = 'general error',
				logEvent = createLogEvent(new TestDetailedBaseError('details', errorDetails, new Error(causeErrorMessage)));

			this.middleware.exec(logEvent, (res) => {
				expect(res).toEqual(copyLogEvent(
					logEvent,
					{
						error: {
							details: {reason: errorDetails},
							cause: {error: {name: 'Error', message: causeErrorMessage}}
						}
					}
				));
			});
		});

		it('error with details and cause that has its own details and cause', () => {
			const
				errorDetails = {msg: 'yep'},
				causeDetails = {count: 7},
				causeMessage = 'cause error',
				causeCauseMessage = 'cause of the cause';

			const logEvent = createLogEvent(
				new TestDetailedBaseError('error details', errorDetails, new TestDetailedBaseError(
					causeMessage,
					causeDetails,
					new Error(causeCauseMessage)
				))
			);

			this.middleware.exec(logEvent, (res) => {
				expect(res).toEqual(copyLogEvent(
					logEvent,
					{
						error: {
							details: {reason: errorDetails},
							cause: {
								error: {name: 'TestDetailedBaseError', message: causeMessage},
								details: {reason: causeDetails},
								cause: {error: {name: 'Error', message: causeCauseMessage}}
							}
						}
					}
				));
			});
		});
	});

	describe('has extractor', () => {
		beforeEach(() => {
			this.middleware = new ExtractorMiddleware(new TestExtractor());
		});

		afterEach(() => {
			this.middleware = undefined;
		});

		it('error matches some extractor', () => {
			const
				errorDetails = {msg: 'yep'},
				logEvent = createLogEvent(new TestDetailedBaseError('details', errorDetails));

			this.middleware.exec(logEvent, (res) => {
				expect(res).toEqual(copyLogEvent(
					logEvent,
					{error: {details: errorDetails}}
				));
			});
		});

		it('error does not match any extractor', () => {
			const
				errorDetails = {msg: 'yep'},
				logEvent = createLogEvent(new TestDetailedError('details', errorDetails));

			this.middleware.exec(logEvent, (res) => {
				expect(res).toEqual(copyLogEvent(
					logEvent,
					{error: {details: {reason: errorDetails}}}
				));
			});
		});
	});
});
