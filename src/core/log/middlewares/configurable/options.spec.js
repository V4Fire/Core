/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import { get, set, clear, init, subscribe } from 'core/log/middlewares/configurable/options';
import * as env from 'core/env';

describe('middlewares/configurable/options', () => {
	const
		storageKey = 'log',
		defaultOptions = {patterns: [/:error\b/]};

	beforeAll(clear);
	afterEach(clear);

	describe('successful get/set operation:', () => {
		it('get initial options', () => {
			expect(get()).toBeUndefined();
		});

		it('set correct pattern', () => {
			set({patterns: ['log']});
			expect(get()).toEqual({patterns: [/log/]});
		});

		it('set correct patterns', () => {
			set({patterns: ['log1', 'log2']});
			expect(get()).toEqual({patterns: [/log1/, /log2/]});
		});

		it('set empty patterns list', () => {
			set({patterns: []});
			expect(get()).toEqual({patterns: []});
		});

		it('set undefined as options', () => {
			set();
			expect(get()).toEqual(defaultOptions);
		});

		it('update options', () => {
			set({patterns: ['log']});
			set({patterns: ['logs']});
			expect(get()).toEqual({patterns: [/logs/]});
		});

		it('update options with empty array', () => {
			set({patterns: ['log']});
			set({patterns: []});
			expect(get()).toEqual({patterns: []});
		});

		it('update options with undefined', () => {
			set({patterns: ['log']});
			set();
			expect(get()).toEqual(defaultOptions);
		});
	});

	describe('setting wrong options:', () => {
		const cases = [
			{desc: 'mix of correct and incorrect values in patterns array', opts: {patterns: ['a', 2]}},
			{desc: 'regex instead of string in patterns array', opts: {patterns: [/log/]}},
			{desc: 'patterns field is string instead of array', opts: {patterns: 'log'}},
			{desc: 'wrong field name for patterns', opts: {pattern: ['a', 'b']}},
			{desc: 'incorrect options type', opts: ['a', 'b']},
			{desc: 'incorrect object as options', opts: new Error('log')}
		];

		cases.forEach((c) => {
			it(`no options, ${c.desc}`, () => {
				expect(() => set(c.opts)).toThrowError();
				expect(get()).toEqual(defaultOptions);
			});

			it(`has options, ${c.desc}`, () => {
				set({patterns: ['log']});
				expect(() => set(c.opts)).toThrowError();
				expect(get()).toEqual({patterns: [/log/]});
			});
		});

		it('update', () => {
			set({patterns: ['log']});
			expect(() => set({pattern: ['logs']})).toThrowError();
			expect(get()).toEqual({patterns: [/log/]});
		});
	});

	describe('initialization.', () => {
		function clean() {
			return env.remove(storageKey);
		}

		beforeAll(clean);
		afterEach(clean);

		it('init from the storage', async () => {
			expect(get()).toBeUndefined();
			await env.set(storageKey, {patterns: ['log']});
			await init();
			expect(get()).toEqual({patterns: [/log/]});
		});

		it('init from the empty storage', async () => {
			expect(get()).toBeUndefined();
			expect(await env.get(storageKey)).toBeUndefined();
			await init();
			expect(get()).toEqual(defaultOptions);
		});

		it('changes in the storage after initialization', async () => {
			expect(get()).toBeUndefined();
			await env.set(storageKey, {patterns: ['log1']});
			await init();
			await env.set(storageKey, {patterns: ['log2']});
			expect(get()).toEqual({patterns: [/log1/]});
		});

		it('init with wrong options from the storage', async () => {
			await env.set(storageKey, {patterns: 'log'});
			await expectAsync(init()).toBeRejectedWithError();
			expect(get()).toEqual(defaultOptions);
		});
	});

	describe('subscriptions.', () => {
		async function clean() {
			env.emitter.removeAllListeners();
			await env.remove(storageKey);
		}

		beforeAll(clean);
		afterEach(clean);

		it('change storage', async () => {
			expect(get()).toBeUndefined();
			subscribe();
			await env.set(storageKey, {patterns: ['log']});
			expect(get()).toEqual({patterns: [/log/]});
		});

		it('several changes of the storage', async () => {
			expect(get()).toBeUndefined();
			subscribe();
			await env.set(storageKey, {patterns: ['log']});
			await env.set(storageKey, {patterns: ['logs']});
			expect(get()).toEqual({patterns: [/logs/]});
		});

		it('set incorrect options into the storage', async () => {
			expect(get()).toBeUndefined();
			subscribe();
			await expectAsync(env.set(storageKey, {patterns: 'log'})).toBeRejectedWithError();
			expect(get()).toEqual(defaultOptions);
		});

		it('set incorrect options into the storage after setting correct options', async () => {
			expect(get()).toBeUndefined();
			subscribe();
			await env.set(storageKey, {patterns: ['log']});
			await expectAsync(env.set(storageKey, {patterns: 'logs'})).toBeRejectedWithError();
			expect(get()).toEqual({patterns: [/log/]});
		});

		it('init with empty storage and update options via storage', async () => {
			expect(get()).toBeUndefined();
			expect(await env.get(storageKey)).toBeUndefined();
			await init();
			subscribe();
			await env.set(storageKey, {patterns: ['log']});
			expect(get()).toEqual({patterns: [/log/]});
		});

		it('init with storage and update with incorrect options via storage', async () => {
			expect(get()).toBeUndefined();
			await env.set(storageKey, {patterns: ['log']});
			init();
			subscribe();
			await expectAsync(env.set(storageKey, {pattern: ['log']})).toBeRejectedWithError();
			expect(get()).toEqual({patterns: [/log/]});
		});
	});
});
