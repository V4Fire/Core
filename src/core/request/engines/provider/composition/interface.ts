/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type Provider from 'core/data';
import type { ProviderOptions } from 'core/data';
import type { RequestOptions, RequestResponseObject, MiddlewareParams } from 'core/request';

export interface ProviderWrapper {
	(provider: Provider): Provider;
}

export interface CompositionProviderParams {
	providerWrapper: ProviderWrapper,
	providerOptions?: ProviderOptions
}

export interface CompositionProvider {
	/**
	 * Запрос который необходимо выполнить.
	 *
	 * @param options
	 * @param requestParams
	 *
	 * @example
	 *
	 * ```typescript
	 * export class CompositionProviderTest extends Edadeal {
	 *  static override request: typeof Edadeal.request = Edadeal.request({
	 *    engine: providerCompositionEngine([
	 *      {
	 *        request: (_, params) => new Banners().get(Object.get(params, 'opts.query.bannersQuery')),
	 *        writeResultInto: 'banners'
	 *      },
	 *      {
	 *        request: (_, params) => new Cards().get(Object.get(params, 'opts.query.cardsQuery')),
	 *        writeResultInto: 'content'
	 *      }
	 *    ])
	 *  });
	 * }
	 * ```
	 */
	request(
		options: RequestOptions,
		requestParams: MiddlewareParams,
		params: CompositionProviderParams
	): Promise<RequestResponseObject>;

	/**
	 * В какие поля результирующего объекта будет записан ответ данного запроса.
	 */
	as: string;

	/**
	 * Если функция вернула false, то запрос не будет создан.
	 *
	 * Если функция вернула promise, то будет выполнено ожидание разрешения этого промиса,
	 * и в случае если он разрешится с false, запрос не будет создан.
	 *
	 * @param options
	 * @param params
	 */
	requestFilter?(options: RequestOptions, params: MiddlewareParams): CanPromise<boolean>;

	/**
	 * Если true, то при ошибки данного запроса будет выкинута ошибка всего запроса.
	 */
	failCompositionOnError?: boolean;
}
