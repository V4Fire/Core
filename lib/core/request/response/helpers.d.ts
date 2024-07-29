import type { StatusCodes } from '../../../core/status-codes';
import type { Statuses } from '../../../core/request/interface';
/**
 * Returns true if specified `statuses` contain specified `statusCode`
 *
 * @param statuses
 * @param statusCode
 */
export declare function statusesContainStatus(statuses: Statuses, statusCode: StatusCodes): boolean;
