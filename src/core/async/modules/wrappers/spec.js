/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import Async from 'core/async';

import Provider, { provider } from 'core/data';

@provider
class ProviderExample extends Provider {}

describe('core/async/modules/data-providers', () => {
	describe('wrapDataProvider', () => {
		it('should call methods on original instance', () => {
			const
				$a = new Async(),
				$dp = new ProviderExample();

			const dp = $a.wrapDataProvider($dp);

			spyOn($dp, 'name');
			dp.name();
			expect($dp.name).toHaveBeenCalled();

			spyOn($dp, 'base');
			dp.base('bar');
			expect($dp.base).toHaveBeenCalledWith('bar');
		});

		it('should call replaced methods on original instance', () => {
			const
				$a = new Async(),
				$dp = new ProviderExample();

			const dp = $a.wrapDataProvider($dp);

			spyOn($dp, 'get');
			dp.get();
			expect($dp.get).toHaveBeenCalled();

			spyOn($dp, 'upd');
			dp.upd();
			expect($dp.upd).toHaveBeenCalled();
		});

		it('if group not provided should use classname of provider', () => {
			const
				$a = new Async(),
				$dp = new ProviderExample();

			const dp = $a.wrapDataProvider($dp);

			spyOn($a, 'request');
			dp.get({id: 1});
			expect($a.request.calls.mostRecent().args[1]).toEqual({group: 'ProviderExample'});
		});

		it('should concatenate global group and method group', () => {
			const
				$a = new Async(),
				$dp = new ProviderExample();

			const dp = $a.wrapDataProvider($dp, {group: 'example'});

			spyOn($a, 'request');
			dp.get({id: 1});
			expect($a.request.calls.mostRecent().args[1]).toEqual({group: 'example'});

			dp.upd({id: 1}, {group: 'foo'});
			expect($a.request.calls.mostRecent().args[1]).toEqual({group: 'example:foo'});
		});

		it('should provide group in eventEmitter wrapper and replace eventEmitter with eventEmitter wrapper', () => {
			const
				$a = new Async(),
				$dp = new ProviderExample();

			const fakeWrapper = {info: 'Is wrappedEventEmitter'};

			spyOn($a, 'wrapEventEmitter').and.returnValue(fakeWrapper);
			const dp = $a.wrapDataProvider($dp, {group: 'example'});

			expect($a.wrapEventEmitter.calls.mostRecent().args).toEqual([$dp.emitter, {group: 'example'}]);

			expect(dp.emitter).toEqual(fakeWrapper);
		});
	});

	describe('wrapEventEmitter', () => {
		it('should have access to event emitter props and methods', () => {
			const
				$a = new Async(),
				fakeEventEmitter = {
					foo: () => null,
					bar: 'bar'
				};

			const ee = $a.wrapEventEmitter(fakeEventEmitter);

			expect(ee.foo).toEqual(fakeEventEmitter.foo);
			expect(ee.bar).toEqual(fakeEventEmitter.bar);
		});

		it('addEventListener and eventListener should be alias for on', () => {
			const
				$a = new Async(),
				ee = $a.wrapEventEmitter({});

			expect(ee.addEventListener).toEqual(ee.on);
			expect(ee.addListener).toEqual(ee.on);
		});

		it('should throw error if second parameter in `on` method is not function', () => {
			const
				$a = new Async(),
				ee = $a.wrapEventEmitter({
					on: () => null
				});

			expect(ee.on.bind(null, 'bar', {handleEvent: () => ({})})).toThrowError();
		});

		it('should concatenate global group and method group', () => {
			const
				$a = new Async(),
				eeWithGroup = $a.wrapEventEmitter({
					on: () => null
				}, {group: 'example'});

			spyOn($a, 'on');
			eeWithGroup.on('foo', () => null, {
				group: 'example2'
			});

			expect($a.on.calls.mostRecent().args[3]).toEqual({group: 'example:example2'});

			eeWithGroup.on('bar', () => null);
			expect($a.on.calls.mostRecent().args[3]).toEqual({group: 'example'});

			const eeWithoutGroup = $a.wrapEventEmitter({
				on: () => null
			});

			eeWithoutGroup.on('foo', () => null, {
				group: 'example3'
			});

			expect($a.on.calls.mostRecent().args[3]).toEqual({group: 'example3'});

			eeWithoutGroup.on('bar', () => null);
			expect($a.on.calls.mostRecent().args[3]).toEqual({});
		});

		it('paramsNormalizer', () => {
			const
				$a = new Async(),
				ee = $a.wrapEventEmitter({
					on: () => null
				});

			spyOn($a, 'on');
			// [] => [{}]
			ee.on('foo', () => null);
			expect($a.on.calls.mostRecent().args.slice(3)).toEqual([{}]);

			// [true] => [{}, true]
			ee.on('foo', () => null, true);
			expect($a.on.calls.mostRecent().args.slice(3)).toEqual([{}, true]);

			/*
			 * [{foo: 'foo', group: 'group', label: 'label'}, null, 5]
			 *  =>
			 * [{group: 'group', label: 'label'}, {foo: 'foo'}, null, 5]
			 */
			ee.on('foo', () => null, {foo: 'foo', group: 'group', label: 'label'}, null, 5);
			expect($a.on.calls.mostRecent().args.slice(3)).toEqual([{group: 'group', label: 'label'}, {foo: 'foo'}, null, 5]);
		});

		it('off, once, promisifyOnce should call async methods', () => {
			const
				$a = new Async(),
				ee = $a.wrapEventEmitter({});

			spyOn($a, 'once');
			spyOn($a, 'promisifyOnce');
			spyOn($a, 'off');

			ee.once('foo', () => null);
			ee.promisifyOnce('bar', () => null);
			ee.off({});

			expect($a.once).toHaveBeenCalled();
			expect($a.promisifyOnce).toHaveBeenCalled();
			expect($a.off).toHaveBeenCalled();
		});

		it('off alias should return control to original function if wrong parameters provided', () => {
			const originalMethods = {
				off: false,
				removeEventListener: false,
				removeListener: false
			};

			const
				$a = new Async(),
				ee = $a.wrapEventEmitter({
					on: () => null,
					off: () => originalMethods.off = true,
					removeEventListener: () => originalMethods.removeEventListener = true,
					removeListener: () => originalMethods.removeListener = true
				});

			ee.off(null);
			ee.removeEventListener('foo');
			ee.removeListener({}, () => null, 'bar', 1);

			expect(originalMethods).toEqual({
				off: true,
				removeEventListener: true,
				removeListener: true
			});
		});

		it('emit should call all emit like events', () => {
			const results = {
				emit: null,
				fire: null,
				dispatch: null,
				dispatchEvent: null
			};

			const
				$a = new Async(),
				fakeEventEmitter = {};

			const events = Object.keys(results);

			const ee = $a.wrapEventEmitter(fakeEventEmitter);

			for (let i = 0; i < events.length; i += 1) {
				delete fakeEventEmitter[events[i - 1]];

				fakeEventEmitter[events[i]] = (event) => results[events[i]] = event;
				ee.emit(events[i]);
			}

			expect(results).toEqual({
				emit: 'emit',
				fire: 'fire',
				dispatch: 'dispatch',
				dispatchEvent: 'dispatchEvent'
			});
		});
	});
});
