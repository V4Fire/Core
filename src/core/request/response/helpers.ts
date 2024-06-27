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
	if (statuses instanceof Range) {
		return statuses.contains(statusCode);
	}

	if (Object.isArray(statuses)) {
		return statuses.includes(statusCode);
	}

	return statuses === statusCode;
}
