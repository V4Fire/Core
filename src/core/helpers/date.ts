/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

/**
 * Normalizes the specified value as date
 *
 * @param value
 * @param [params] - additional parameters for Date.create
 */
export function normalizeIfDate(value: unknown, params?: DateCreateParams): CanUndef<Date>;

/**
 * @param value - list of values
 * @param [params] - additional parameters for Date.create
 */
export function normalizeIfDate(value: unknown[], params?: DateCreateParams): Date[];
export function normalizeIfDate(value: CanArray<unknown>, params?: DateCreateParams): CanUndef<CanArray<Date>> {
	if (Object.isArray(value)) {
		const
			res = <Date[]>[];

		for (let i = 0; i < value.length; i++) {
			const
				date = value[i];

			if (canDate(date)) {
				res.push(Date.create(<DateCreateValue>date, params));
			}
		}

		return res;
	}

	if (canDate(value)) {
		return Date.create(<DateCreateValue>value, params);
	}

	return undefined;
}

function canDate(value: unknown): boolean {
	return Object.isString(value) || Object.isNumber(value) || Object.isDate(value);
}
