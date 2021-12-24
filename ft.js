const express = require('express');

// Import Provider, { provider } from 'core/data';
const {default: baseRequest, globalOpts, RequestError} = require('./dist/server/core/request/index.js');
const {defaultRequestOpts} = require('./dist/server/core/request/const.js');
const {default: nodeEngine} = require('./dist/server/core/request/engines/node.js');
const {default: fetchEngine} = require('./dist/server/core/request/engines/fetch.js');
// Import fetchEngine from './dist/server/core/request/engines/fetch.js';
// import xhrEngine from './dist/server/core/request/engines/xhr.js';
// import createProviderEngine from './dist/server/core/request/engines/provider.js';

const emptyBodyStatuses = [204, 304];

const PORT = 3000;

(async () => {
	let server;

  try {
    const request = baseRequest;
    // GlobalOpts.api = 'https://run.mocky.io';
    defaultRequestOpts.engine = nodeEngine;
		server = createServer();
    // Const req = await request(`http://localhost:${PORT}/json/2`, {
		// 	method: 'POST',
		// 	headers: {
		// 		Accept: 'application/json'
		// 	}
		// });
		const req = await request('http://localhost:3000/retry/speedup', {
			timeout: 300,
			retry: 2
		});
		console.log(req);
    // Console.log(await req.response.json());
    // Server.close((err) => {
    //   console.log('server closed');
    //   process.exit(err ? 1 : 0);
    // });
  } catch(err) {
    console.log('top-level-error:', err);
  } finally {
		server.close((err) => {
			console.log('server closed');
			process.exit(err ? 1 : 0);
		});
	}
})();

function createServer() {
	const serverApp = express();
	serverApp.use(express.json());

	serverApp.get('/json/1', (req, res) => {
		res.status(200).json({id: 1, value: 'things'});
	});

	serverApp.put('/json/2', (req, res) => {
		if (req.get('Accept') === 'application/json') {
			console.log('server: `put` 200', req.body);
			res.status(200).end('{"message": "Success"}');

		} else {
			console.log('server: `put` 422');
			res.sendStatus(422);
		}
	});

	serverApp.post('/json', (req, res) => {
		const
			{body} = req;

		if (body.id === 12345 && body.value === 'abc-def-ghi') {
			res.status(201).json({message: 'Success'});

		} else {
			res.sendStatus(422);
		}
	});

	serverApp.get('/xml/text', (req, res) => {
		res.type('text/xml');
		res.status(200).send('<foo>Hello world</foo>');
	});

	serverApp.get('/xml/app', (req, res) => {
		res.type('application/xml');
		res.status(200).send('<foo>Hello world</foo>');
	});

	serverApp.get('/search', (req, res) => {
		const
			{query} = req;

		if (query.q != null && /^[A-Za-z0-9]*$/.test(query.q)) {
			res.type('application/xml');
			res.status(200);
			res.send('<results><result>one</result><result>two</result><result>three</result></results>');

		} else {
			res.sendStatus(422);
		}
	});

	serverApp.get('/delayed', (req, res) => {
		setTimeout(() => {
			res.sendStatus(200);
		}, 300);
	});

	serverApp.get('/favicon.ico', (req, res) => {
		const
			faviconInBase64 = 'AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAnISL6JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL5JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL1JyEi9ichIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEihCchIpgnISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEixCUgIRMmICEvJyEi5ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIrYnISKSJyEi9ichIlxQREUAHxobAichIo4nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISJeJyEiICchIuAnISJJJiAhbCYgITgmICEnJyEi4ichIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEiXichIiAnISLdJyEihichIuknISKkIRwdBCchIoUnISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIl4nISIgJyEi4ichIu4nISL/JyEi8CYgIT8mICEhJyEi3CchIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISJeJyEiHychIuUnISL/JyEi/ychIv8nISKrIh0eBiYhInwnISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEiXSYgITUnISLvJyEi/ychIv8nISL/JyEi9CYgIUcmICEbJyEi1ichIv8nISL/JyEi/ychIv8nISL/JyEi/ichImknISKjJyEi/ychIv8nISL/JyEi/ychIv8nISKzIRwdBiYhIX0nISL/JyEi/ychIv8nISL/JyEi/ychIvwnISK+JyEi9CchIv8nISL/JyEi/ychIv8nISL/JyEi9yYhIoonISKzJyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ichIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL6JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL/JyEi/ychIv8nISL6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

		res.type('image/x-icon');
		res.send(Buffer.from(faviconInBase64, 'base64'));
	});

	for (const status of emptyBodyStatuses) {
		serverApp.get(`/octet/${status}`, (req, res) => {
			res.type('application/octet-stream').status(status).end();
		});
	}

	const
		triesBeforeSuccess = 3,
		requestTimes = [];

	let
		tryNumber = 0,
		speed = 600;

	serverApp.get('/retry', (req, res) => {
		requestTimes.push(new Date().getTime());

		if (tryNumber <= triesBeforeSuccess) {
			res.sendStatus(500);
			tryNumber++;

		} else {
			res.status(200);
			res.json({
				tryNumber,
				times: requestTimes
			});
		}
	});

	serverApp.get('/retry/speedup', (req, res) => {
		setTimeout(() => {
			res.status(200);
			res.json({tryNumber});
			tryNumber++;
		}, speed);

		speed -= 200;
	});

	serverApp.get('/retry/bad', (req, res) => {
		res.status(500);
		res.json({tryNumber});
		tryNumber++;
	});

	return serverApp.listen(PORT, (err) => {
    if (err) {
      console.log(err.message);
      return;
    }

    console.log(`server started on ${PORT} port`);
  });
}
