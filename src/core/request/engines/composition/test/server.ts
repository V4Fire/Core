/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import type { Server } from 'node:http';
import express, { Request, Response } from 'express';

import Async from 'core/async';
import { concatURLs } from 'core/url';

interface HandleResponse {
	statusCode: number;
	body: object;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function createServer(startPort: number) {
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
		console.log('clear handles');
		Object.values(handles).forEach((handle) => handle.clear());
	};

	const [server, port] = await new Promise<[Server, number]>((res) => {
		let selectedPort = startPort;

		const start = () => {
			const server = serverApp.listen(selectedPort, async () => {
				console.log('listen on port', selectedPort);
				await new Promise((res) => setTimeout(res, 100));
				res([server, selectedPort]);
			});

			server.on('error', (err) => {
				console.log('server error', err);
				selectedPort++;
				server.close();
				start();
			});
		};

		start();
	});

	console.log('server return');

	const result = {
		handles,
		server,
		clearHandles,
		port,

		url: (...paths: string[]) => concatURLs(`http://localhost:${startPort}/`, ...paths),

		destroy: () => {
			console.log('server destroy');
			server.close();
			clearHandles();
		}
	};

	return result;
}
