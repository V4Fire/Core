/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
/**
 * [[include:core/async/wrappers/README.md]]
 * @packageDocumentation
 */
import type { Provider } from '../../../core/data';
import type { AsyncStorage, AsyncStorageNamespace } from '../../../core/kv-storage';
import Super, { EventEmitterLike } from '../../../core/async/events';
import type { WrappedDataProvider, EventEmitterWrapper, EventEmitterOverwritten, WrappedAsyncStorageNamespace, WrappedAsyncStorage, AsyncOptionsForWrappers } from '../../../core/async/interface';
export * from '../../../core/async/events';
export * from '../../../core/async/wrappers/consts';
export * from '../../../core/async/interface';
export default class Async<CTX extends object = Async<any>> extends Super<CTX> {
    /**
     * The wrapper takes a link to the "raw" data provider and returns a new object based on the original.
     * All asynchronous methods and properties are wrapped by Async.
     *
     * Note that the wrapped methods can take additional Async parameters, such as `group` or `label`.
     * If you don't provide a group, it will be taken from the provider name.
     *
     * @param provider
     * @param [opts] - additional options for the wrapper
     *
     * @example
     * ```js
     * import Async from '../../../core/async';
     * import Provider, { provider } from '../../../core/data';
     *
     * @provider('api')
     * export default class User extends Provider {
     *   baseURL = 'user/:id';
     * }
     *
     * const
     *   $a = new Async(),
     *   wrappedProvider = $a.wrapDataProvider(new User());
     *
     * wrappedProvider.get({uuid: 1}).then((res) => {
     *   console.log(res);
     * });
     *
     * // By default, all wrapped methods have a group name that is equal to the provider's name.
     * // This allows us to clear or suspend requests, among other things.
     * $a.clearAll({group: 'api.User'})
     *
     * wrappedProvider.update({uuid: 1}, {
     *   // All wrapped methods can take additional Async parameters as the second argument: group, label, and join
     *   group: 'bla',
     *   label: 'foo',
     *   join: true,
     *
     *   // Additionally, the second argument of the wrapped method can take the original parameters from the provider
     *   headers: {
     *     'X-Foo': '1'
     *   }
     *
     * }).then((res) => {
     *   console.log(res);
     * });
     *
     * // If we provide a group to the method, it will be joined with the global group using the `:` character
     * $a.suspendAll({group: 'api.User:bla'});
     *
     * // We can use a group as a RegExp
     * $a.muteAll({group: /api\.User/});
     *
     * // We can use any methods or properties from the original data provider
     * wrappedProvider.dropCache();
     * ```
     */
    wrapDataProvider<P extends Provider, W extends WrappedDataProvider>(provider: P, opts?: AsyncOptionsForWrappers): W;
    /**
     * The wrapper takes a link to the "raw" event emitter and returns a new object based on the original,
     * but all asynchronous methods and properties are wrapped by Async.
     *
     * Note that the wrapped methods can take additional Async parameters, such as `group` or `label`.
     * In addition, the wrapper adds new methods, such as "on" and "off", to make the emitter API more standard.
     *
     * @param emitter
     * @param [opts] - additional options for the wrapper
     *
     * @example
     * ```js
     * import Async from '../../../core/async';
     *
     * const
     *   $a = new Async(),
     *   wrappedEventEmitter = $a.wrapEventEmitter(window);
     *
     * const handler = () => console.log('scroll event');
     *
     * // We can safely listen to emitter events because all emitter methods,
     * // such as addListener or on, are wrapped by Async
     * const id = wrappedEventEmitter.addEventListener('scroll', handler, {
     *   // Note that the third argument can take Async parameters in addition to the native emitter parameters
     *   capture: true,
     *   label: 'label'
     * });
     *
     * // The wrapper preserves the original API of the emitter methods, so we can call something like this:
     * wrappedEventEmitter.removeEventListener('scroll', handler);
     *
     * // Finally, the wrapper adds a bunch of standard methods to the emitter,
     * // such as on, once, and other functionalities.
     * // We can use them instead of the original methods to make our code more universal.
     * wrappedEventEmitter.once('resize', (e) => {
     *   console.log(e);
     * }, {group: 'resizers'});
     *
     * $a.muteAll({group: 'resizers'});
     *
     * // We can use any methods or properties from the original emitter
     * console.log(wrappedEventEmitter.name); // window.name
     * ```
     */
    wrapEventEmitter<T extends EventEmitterLike>(emitter: T, opts?: AsyncOptionsForWrappers): EventEmitterOverwritten<T> & EventEmitterWrapper;
    /**
     * The wrapper takes a link to the "raw" asynchronous storage and returns a new object based on the original,
     * but all asynchronous methods and properties are wrapped by Async.
     *
     * Note that the wrapped methods can take additional Async parameters, such as `group` or `label`.
     *
     * @param storage
     * @param opts
     *
     * @example
     * ```js
     * import Async from '../../../core/async';
     * import { asyncLocal } from '../../../core/kv-storage';
     *
     * const
     *   $a = new Async(),
     *   wrappedStorage = $a.wrapStorage(asyncLocal, {group: 'bar'});
     *
     * wrappedStorage.set('someKey', 'someValue', {
     *   // If we provide a group to the method, it will be joined with the global group using the ":" character
     *   group: 'bla',
     *   label: 'foo',
     *   join: true,
     * }).then(async () => {
     *   console.log(await wrappedStorage.get('someKey') === 'someValue');
     * });
     *
     * $a.suspendAll({group: 'bar:bla'});
     *
     * // We can provide our own global group to the namespace, and it will be joined with the parent's global group
     * const blaStore = wrappedStorage.namespace('[[BLA]]', {group: 'bla'});
     *
     * blaStore.clear({group: 'foo'});
     *
     * $a.muteAll({group: 'bar:bla:foo'});
     * ```
     */
    wrapStorage<T extends AsyncStorage | AsyncStorageNamespace>(storage: T, opts?: AsyncOptionsForWrappers): T extends AsyncStorage ? WrappedAsyncStorage : WrappedAsyncStorageNamespace;
}
