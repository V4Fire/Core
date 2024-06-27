import type { StatusCodes } from 'core/status-codes';
import type { Statuses } from 'core/request/interface';
import Range from 'core/range';

/**
 * Returns true if specified `statuses` contain specified `statusCode`
 *
 * @param statuses
 * @param statusCode
 */
export function statusesContainStatus(statuses: Statuses, statusCode: StatusCodes): boolean {

	return statuses instanceof Range ?
		statuses.contains(statusCode) :
		Array.concat([], <number>statuses).includes(statusCode);
}
