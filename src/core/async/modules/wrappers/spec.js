/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

import express from 'express';

import Async from 'core/async';
import Provider, { provider } from 'core/data';

describe('core/async/modules/wrappers', () => {
	let server;

	beforeAll(() => {
		server = createServer();
	});

	afterAll((done) => {
		server.close(done);
	});

	@provider
	class ProviderExample extends Provider {
		baseURL = 'http://localhost:3000/ok';
	}

	describe('`wrapDataProvider`', () => {
		it('should call methods from the original instance', () => {
			const
				$a = new Async(),
				provider = new ProviderExample(),
				wrappedProvider = $a.wrapDataProvider(provider);

			spyOn(provider, 'name');
			wrappedProvider.name();
			expect(provider.name).toHaveBeenCalled();

			spyOn(provider, 'base');
			wrappedProvider.base('bar');
			expect(provider.base).toHaveBeenCalledWith('bar');
		});

		it('should call replaced methods from the original instance', () => {
			const
				$a = new Async(),
				provider = new ProviderExample(),
				wrappedProvider = $a.wrapDataProvider(provider);

			spyOn(provider, 'get');
			wrappedProvider.get();
			expect(provider.get).toHaveBeenCalled();

			spyOn(provider, 'upd');
			wrappedProvider.upd();
			expect(provider.upd).toHaveBeenCalled();
		});

		it('if a group is not provided should use a class name from the provider', () => {
			const
				$a = new Async(),
				provider = new ProviderExample(),
				wrappedProvider = $a.wrapDataProvider(provider);

			spyOn($a, 'request');
			wrappedProvider.get({id: 1});
			expect($a.request.calls.mostRecent().args[1]).toEqual({group: 'ProviderExample'});
		});

		it('should concatenate a global group and local group', () => {
			const
				$a = new Async(),
				provider = new ProviderExample(),
				wrappedProvider = $a.wrapDataProvider(provider, {group: 'example'});

			spyOn($a, 'request');
			wrappedProvider.get({id: 1});
			expect($a.request.calls.mostRecent().args[1]).toEqual({group: 'example'});

			wrappedProvider.upd({id: 1}, {group: 'foo'});
			expect($a.request.calls.mostRecent().args[1]).toEqual({group: 'example:foo'});
		});

		it('should provide a group into a nested event emitter wrapper and replace the original emitter with a wrapper', () => {
			const
				$a = new Async(),
				provider = new ProviderExample(),
				fakeWrapper = {info: 'Is a wrapped event emitter'};

			spyOn($a, 'wrapEventEmitter').and.returnValue(fakeWrapper);

			const
				wrappedProvider = $a.wrapDataProvider(provider, {group: 'example'});

			expect($a.wrapEventEmitter.calls.mostRecent().args).toEqual([provider.emitter, {group: 'example'}]);
			expect(wrappedProvider.emitter).toEqual(fakeWrapper);
		});
	});

	describe('`wrapEventEmitter`', () => {
		it('should have access to event emitter properties and methods', () => {
			const
				$a = new Async();

			const fakeEventEmitter = {
				foo: () => null,
				bar: 'bar'
			};

			const emitter = $a.wrapEventEmitter(fakeEventEmitter);

			expect(emitter.foo).toEqual(fakeEventEmitter.foo);
			expect(emitter.bar).toEqual(fakeEventEmitter.bar);
		});

		it('`addEventListener` and `addListener` should be aliases for `on`', () => {
			const
				$a = new Async(),
				emitter = $a.wrapEventEmitter({});

			expect(emitter.addEventListener).toEqual(emitter.on);
			expect(emitter.addListener).toEqual(emitter.on);
		});

		it('should throw an error if the second parameter at `on` is not a function', () => {
			const
				$a = new Async(),
				emitter = $a.wrapEventEmitter({on: () => null});

			expect(emitter.on.bind(null, 'bar', {handleEvent: () => ({})})).toThrowError();
		});

		it('should concatenate a global group and local group', () => {
			const
				$a = new Async(),
				emitterWithGroup = $a.wrapEventEmitter({on: () => null}, {group: 'example'});

			spyOn($a, 'on');
			emitterWithGroup.on('foo', () => null, {
				group: 'example2'
			});

			expect($a.on.calls.mostRecent().args[3]).toEqual({group: 'example:example2'});

			emitterWithGroup.on('bar', () => null);
			expect($a.on.calls.mostRecent().args[3]).toEqual({group: 'example'});

			const emitterWithoutGroup = $a.wrapEventEmitter({
				on: () => null
			});

			emitterWithoutGroup.on('foo', () => null, {
				group: 'example3'
			});

			expect($a.on.calls.mostRecent().args[3]).toEqual({group: 'example3'});

			emitterWithoutGroup.on('bar', () => null);
			expect($a.on.calls.mostRecent().args[3]).toEqual({});
		});

		it('normalizes of input parameters', () => {
			const
				$a = new Async(),
				emitter = $a.wrapEventEmitter({on: () => null});

			spyOn($a, 'on');

			// [] => [{}]
			emitter.on('foo', () => null);
			expect($a.on.calls.mostRecent().args.slice(3)).toEqual([{}]);

			// [true] => [{}, true]
			emitter.on('foo', () => null, true);
			expect($a.on.calls.mostRecent().args.slice(3)).toEqual([{}, true]);

			/*
			 * [{foo: 'foo', group: 'group', label: 'label'}, null, 5]
			 *  =>
			 * [{group: 'group', label: 'label'}, {foo: 'foo'}, null, 5]
			 */
			emitter.on('foo', () => null, {foo: 'foo', group: 'group', label: 'label'}, null, 5);
			expect($a.on.calls.mostRecent().args.slice(3)).toEqual([{group: 'group', label: 'label'}, {foo: 'foo'}, null, 5]);
		});

		it('`off`, `once`, `promisifyOnce` should call async wrappers', () => {
			const
				$a = new Async(),
				emitter = $a.wrapEventEmitter({});

			spyOn($a, 'once');
			spyOn($a, 'promisifyOnce');
			spyOn($a, 'off');

			emitter.once('foo', () => null);
			emitter.promisifyOnce('bar', () => null);
			emitter.off({});

			expect($a.once).toHaveBeenCalled();
			expect($a.promisifyOnce).toHaveBeenCalled();
			expect($a.off).toHaveBeenCalled();
		});

		it('`off` alias should return control to the original function if wrong parameters are provided', () => {
			const originalMethods = {
				off: false,
				removeEventListener: false,
				removeListener: false
			};

			const
				$a = new Async();

			const emitter = $a.wrapEventEmitter({
				on: () => null,
				off: () => originalMethods.off = true,
				removeEventListener: () => originalMethods.removeEventListener = true,
				removeListener: () => originalMethods.removeListener = true
			});

			emitter.off(null);
			emitter.removeEventListener('foo');
			emitter.removeListener({}, () => null, 'bar', 1);

			expect(originalMethods).toEqual({
				off: true,
				removeEventListener: true,
				removeListener: true
			});
		});

		it('`emit` should call all emit like events', () => {
			const results = {
				emit: null,
				fire: null,
				dispatch: null,
				dispatchEvent: null
			};

			const
				$a = new Async(),
				fakeEventEmitter = {};

			const
				events = Object.keys(results),
				emitter = $a.wrapEventEmitter(fakeEventEmitter);

			for (let i = 0; i < events.length; i += 1) {
				delete fakeEventEmitter[events[i - 1]];
				fakeEventEmitter[events[i]] = (event) => results[events[i]] = event;
				emitter.emit(events[i]);
			}

			expect(results).toEqual({
				emit: 'emit',
				fire: 'fire',
				dispatch: 'dispatch',
				dispatchEvent: 'dispatchEvent'
			});
		});
	});

	describe('`wrapStorage`', () => {
		const
			mainMethods = ['has', 'get', 'set', 'remove', 'clear'],
			methodsWithNamespace = [...mainMethods, 'namespace'];

		let
			$a,
			mockedStorage,
			methodArgs,
			expectedResult;

		beforeEach(() => {
			$a = new Async();
			methodArgs = [Symbol('firstArg'), Symbol('secondArg'), Symbol('thirdArg')];
			expectedResult = Symbol('result');
			jasmine.setDefaultSpyStrategy((and) => and.returnValue(Promise.resolve(expectedResult)));
			mockedStorage = jasmine.createSpyObj(methodsWithNamespace);
		});

		mainMethods.forEach(testMethod);

		function testMethod(methodName) {
			describe(`\`${methodName}\``, () => {
				it('should call the original method and return its result', async () => {
					const
						wrappedStorage = $a.wrapStorage(mockedStorage),
						result = await wrappedStorage[methodName](...methodArgs);

					expect(mockedStorage[methodName]).toHaveBeenCalledWith(...methodArgs);
					expect(result).toBe(expectedResult);
				});

				it('should mark a storage by the global group', async () => {
					const
						wrappedStorage = $a.wrapStorage(mockedStorage, {group: 'bla'}),
						spyPromise = jasmine.createSpy();

					const promise = wrappedStorage[methodName](...methodArgs).then(
						() => spyPromise('resolved'),
						(err) => spyPromise(Object.select(err, ['type', 'reason']))
					);

					await $a.clearAll({group: 'bla'});
					await promise;
					expect(spyPromise).toHaveBeenCalledOnceWith({type: 'clearAsync', reason: 'group'});
				});

				it('should consider the `group` parameter', async () => {
					const
						wrappedStorage = $a.wrapStorage(mockedStorage),
						spyPromise = jasmine.createSpy();

					const promise = wrappedStorage[methodName](...methodArgs, {group: 'bla'}).then(
						() => spyPromise('resolved'),
						(err) => spyPromise(Object.select(err, ['type', 'reason']))
					);

					await $a.clearAll({group: 'bla'});
					await promise;
					expect(spyPromise).toHaveBeenCalledOnceWith({type: 'clearAsync', reason: 'group'});
				});

				it('should consider the `label` parameter', async () => {
					const
						wrappedStorage = $a.wrapStorage(mockedStorage),
						spyPromise = jasmine.createSpy();

					const promise = wrappedStorage[methodName](...methodArgs, {label: 'qoo'}).then(
						() => spyPromise('resolved'),
						(err) => spyPromise(Object.select(err, ['type', 'reason']))
					);

					await $a.clearAll({label: 'qoo'});
					await promise;
					expect(spyPromise).toHaveBeenCalledOnceWith({type: 'clearAsync', reason: 'label'});
				});

				it('should consider the `join` parameter', async () => {
					const
						wrappedStorage = $a.wrapStorage(mockedStorage),
						spyPromise = jasmine.createSpy(),
						label = Symbol('label'),
						promise1 = wrappedStorage[methodName](...methodArgs, {label, join: true}).then(() => spyPromise()),
						promise2 = wrappedStorage[methodName](...methodArgs, {label, join: true}).then(() => spyPromise());

					await Promise.all([promise1, promise2]);
					expect(spyPromise).toHaveBeenCalledTimes(2);
				});

				it('should concatenate global and local groups', async () => {
					const
						wrappedStorage = $a.wrapStorage(mockedStorage, {group: 'bla'}),
						spyWithoutLocal = jasmine.createSpy(),
						spyWithLocal = jasmine.createSpy();

					const promiseWithoutLocal = wrappedStorage[methodName](...methodArgs).then(
						() => spyWithoutLocal('resolved'),
						(err) => spyWithoutLocal(Object.select(err, ['type', 'reason']))
					);

					const promiseWithLocal = wrappedStorage[methodName](...methodArgs, {group: 'foo'}).then(
						() => spyWithLocal('resolved'),
						(err) => spyWithLocal(Object.select(err, ['type', 'reason']))
					);

					await $a.clearAll({group: 'bla:foo'});
					await Promise.all([promiseWithoutLocal, promiseWithLocal]);

					expect(spyWithoutLocal).toHaveBeenCalledOnceWith('resolved');
					expect(spyWithLocal).toHaveBeenCalledOnceWith({type: 'clearAsync', reason: 'group'});
				});

				it('should separate async options from additional parameters', () => {
					const wrappedStorage = $a.wrapStorage(mockedStorage);

					wrappedStorage[methodName]('firstArg', 'secondArg', {additionalArg: true}, {
						group: 'bla',
						label: 'foo',
						join: true,
						notAsyncOption: true
					});

					expect(mockedStorage[methodName].calls.mostRecent().args[2]).toEqual({additionalArg: true});
					expect(mockedStorage[methodName].calls.mostRecent().args[3]).toEqual({notAsyncOption: true});
				});
			});
		}

		describe('`namespace`', () => {
			it('should call the original method and return the wrapped result', () => {
				const
					parentStorage = $a.wrapStorage(mockedStorage),
					name = Symbol('name'),
					storageNamespace = Symbol('storageNamespace'),
					wrappedStorageNamespace = Symbol('wrappedStorageNamespace');

				spyOn($a, 'wrapStorage');
				mockedStorage.namespace.and.returnValue(storageNamespace);
				$a.wrapStorage.and.returnValue(wrappedStorageNamespace);

				const returnedStorage = parentStorage.namespace(name);

				expect(mockedStorage.namespace).toHaveBeenCalledWith(name);
				expect($a.wrapStorage.calls.mostRecent().args[0]).toBe(storageNamespace);
				expect(returnedStorage).toBe(wrappedStorageNamespace);
			});

			it('should concatenate global and local groups', () => {
				const parentStorage = $a.wrapStorage(mockedStorage, {group: 'bla'});

				spyOn($a, 'wrapStorage');
				parentStorage.namespace('someName', {group: 'foo'});
				expect($a.wrapStorage.calls.mostRecent().args[1]).toEqual({group: 'bla:foo'});
			});
		});
	});
});

function createServer() {
	const
		serverApp = express();

	serverApp.use(express.json());
	serverApp.use('/ok', (req, res) => res.status(200).json({ok: true}));

	return serverApp.listen(3000);
}
