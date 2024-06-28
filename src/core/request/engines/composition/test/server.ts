/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import express, { Request, Response } from 'express';
import { getPortPromise } from 'portfinder';
import path from 'upath';

import Async from 'core/async';

interface HandleResponse {
	statusCode: number;
	body: object;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function createServer() {
	const serverApp = express();
	serverApp.use(express.json());

	const createHandle = (url) => {
		let
			defaultResponse: Nullable<HandleResponse> = null,
			isResponder = false;

		const
			responses = <HandleResponse[]>[],
			requests = <Array<{resolver: (() => Response); request: Request; response: Response}>>[],
			calls = <Request[]>[];

		serverApp.get(url, (req, res) => {
			const
				response = responses.shift() ?? defaultResponse,
				statusCode = response?.statusCode ?? 200,
				body = response?.body ?? {};

			calls.push(req);

			if (isResponder) {
				requests.push({
					resolver: () => res.status(statusCode).json(body),
					request: req,
					response: res
				});

			} else {
				res.status(statusCode).json(body);
			}
		});

		const
			async = new Async();

		const handle = {
			response: (statusCode: number, body: object) => {
				defaultResponse = {statusCode, body};
				return handle;
			},

			/**
			 * @param {number} statusCode
			 * @param {object} body
			 */
			responseOnce: (statusCode: number, body: object) => {
				responses.push({statusCode, body});
				return handle;
			},

			clear: () => {
				requests.forEach(({response}) => response.sendStatus(521));

				requests.length = 0;
				responses.length = 0;
				calls.length = 0;
				defaultResponse = null;
				isResponder = false;
			},

			responder: () => {
				isResponder = true;
				return handle;
			},

			respond: async () => {
				if (!isResponder) {
					throw new Error('Failed to call "respond" on a handle that is not a responder');
				}

				await async.wait(() => requests.length > 0);

				const
					resolve = requests.pop()!.resolver;

				return resolve();
			},

			calls
		};

		return handle;
	};

	const handles = {
		json1: createHandle('/json/1'),
		json2: createHandle('/json/2')
	};

	const clearHandles = () => {
		Object.values(handles).forEach((handle) => handle.clear());
	};

	let
		port = 0,
		server;

	await getPortPromise().then((foundedPort) => {
		server = serverApp.listen(foundedPort);
		port = foundedPort;
	});

	const result = {
		handles,
		server,
		clearHandles,
		port,

		url: (...paths: string[]) => path.join(`http://localhost:${port}/`, ...paths),

		destroy: () => {
			server.close();
			clearHandles();
		}
	};

	return result;
}
