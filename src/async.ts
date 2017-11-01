/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

export interface AsyncLink {
	id: any;
	obj: any;
	objName: string | undefined;
	label: string | symbol | undefined;
	onComplete: Function[];
	onClear: Function[];
}

export interface ClearOpts {
	label?: string | symbol;
	group?: string | symbol | RegExp;
}

export interface ClearOptsId<T> extends ClearOpts {
	id?: T;
}

export interface AsyncOpts {
	join?: boolean | 'replace';
	label?: string | symbol;
	group?: string | symbol;
}

export type AsyncCtx = {
	type: string;
	link: AsyncLink;
	replacedBy?: AsyncLink;
} & AsyncOpts & ClearOptsId<any>;

export interface SimpleAsyncCbOpts extends AsyncOpts {
	onClear?: Function | Function[];
}

export interface AsyncCbOpts extends SimpleAsyncCbOpts {
	fn: Function;
}

export interface AsyncCbOptsSingle extends AsyncCbOpts {
	single?: boolean;
}

export interface LocalCacheObject {
	labels: Record<string, any>;
	links: Map<any, any>;
}

export interface CacheObject {
	root: LocalCacheObject;
	groups: Record<string, LocalCacheObject>;
}

export interface EventEmitterLike {
	on?: Function;
	addListener?: Function;
	addEventListener?: Function;
	once?: Function;
	off?: Function;
	removeListener?: Function;
	removeEventListener?: Function;
}

export interface WorkerLike {
	terminate?: Function;
	destroy?: Function;
	close?: Function;
}

export type RequestLike = Promise<any> & {abort: Function};

export interface NodeEventCb {
	(e: Event, el: Node): void;
}

export interface NodeEventOpts {
	capture?: boolean;
	handler: NodeEventCb;
}

/**
 * Базовый класс для асинхронный действий
 *
 * @example
 * this.setImmediate(() => alert(1));                                    // 1
 * this.setImmediate({fn: () => alert(2), label: 'foo'});                // -
 * this.setImmediate({fn: () => alert(3), label: 'foo'});                // 3
 * this.setImmediate({fn: () => alert(4), group: 'bar'});                // 4
 * this.setImmediate({fn: () => alert(5), label: 'foo', group: 'bar'});  // -
 * this.setImmediate({fn: () => alert(6), label: 'foo', group: 'bar'});  // 6
 */
export default class Async<CTX extends Object> {
	/**
	 * Возвращает заданное значение если оно является событием
	 * @param value
	 */
	protected static getIfEvent(value: any & {event?: string}): Function | undefined {
		return Object.isObject(value) && Object.isString(value.event) ? value : undefined;
	}

	/**
	 * Возвращает заданное значение если оно не является объектом
	 * @param value
	 */
	protected static getIfNotObject(value: any): Function | undefined {
		return Object.isObject(value) ? undefined : value;
	}

	/**
	 * Удаляет обработчик события для заданного источника
	 *
	 * @param params - параметры:
	 *   *) emitter - источник событий
	 *   *) event - событие
	 *   *) handler - функция обработчик
	 *   *) args - дополнительные аргументы для emitter
	 */
	protected static removeEventListener<T>(params: {
		emitter: T & EventEmitterLike,
		event: string,
		handler: Function,
		args: any[]
	}): void {
		const
			e = params.emitter,
			fn = e.removeEventListener || e.removeListener || e.off;

		if (fn) {
			fn.call(e, params.event, params.handler, ...params.args);
		}
	}

	/**
	 * Уничтожает заданный поток
	 * @param worker
	 */
	protected static terminateWorker<T>(worker: T & WorkerLike): void {
		const fn = worker.terminate || worker.destroy || worker.close;
		fn && fn.call(worker);
	}

	/**
	 * Отменяет заданный запрос
	 *
	 * @param request
	 * @param ctx - объект контекста
	 */
	protected static cancelRequest(request: RequestLike, ctx: AsyncCtx): void {
		request.abort(ctx.join === 'replace' ? ctx.replacedBy && ctx.replacedBy.id : undefined);
	}

	/**
	 * Фабрика для функций очистки промисов
	 *
	 * @param resolve
	 * @param reject
	 */
	protected static onPromiseClear(resolve: Function, reject: Function): Function {
		return (obj) => {
			const
				{replacedBy} = obj;

			if (replacedBy && obj.join === 'replace' && obj.link.onClear.length < 25) {
				replacedBy.onComplete.push([resolve, reject]);

				const
					onClear = (<Function[]>[]).concat(obj.link.onClear, reject);

				for (let i = 0; i < onClear.length; i++) {
					replacedBy.onClear.push(onClear[i]);
				}

			} else {
				reject(obj);
			}
		};
	}

	/**
	 * Объект кеша для операций
	 */
	protected cache: Record<string, CacheObject>;

	/**
	 * Контекст для функция
	 */
	protected context: CTX | undefined;

	/**
	 * @param [ctx] - контекст для функций
	 */
	constructor(ctx?: CTX) {
		this.cache = Object.create(null);
		this.context = ctx;
	}

	/**
	 * Возвращает объект кеша по заданному имени
	 * @param name
	 */
	protected initCache(name: string): CacheObject {
		return this.cache[name] = this.cache[name] || {
			root: {
				labels: Object.create(null),
				links: new Map()
			},

			groups: Object.create(null)
		};
	}

	/**
	 * Инициализирует обработчик
	 * @param p
	 */
	protected setAsync(p): any {
		const
			baseCache = this.initCache(p.name);

		let cache;
		if (p.group) {
			baseCache.groups[p.group] = baseCache.groups[p.group] || {
				labels: Object.create(null),
				links: new Map()
			};

			cache = baseCache.groups[p.group];

		} else {
			cache = baseCache.root;
		}

		const
			{labels, links} = cache,
			labelCache = labels[p.label];

		if (labelCache && p.join === true) {
			return labelCache;
		}

		const
			ctx = this.context;

		let
			id,
			finalObj,
			wrappedObj = id = finalObj = p.needCall && Object.isFunction(p.obj) ? p.obj.call(ctx || this) : p.obj;

		if (!p.interval || Object.isFunction(wrappedObj)) {
			wrappedObj = function () {
				const
					link = links.get(id),
					fnCtx = ctx || this;

				if (!link) {
					return;
				}

				if (!p.interval) {
					links.delete(id);
					delete labels[p.label];
				}

				const execTasks = (i = 0) => function () {
					const
						fns = link.onComplete;

					if (fns) {
						for (let j = 0; j < fns.length; j++) {
							const fn = fns[j];
							(fn[i] || fn).apply(fnCtx, arguments);
						}
					}
				};

				let res = finalObj;
				if (Object.isFunction(finalObj)) {
					res = finalObj.apply(fnCtx, arguments);
				}

				if (finalObj instanceof Promise) {
					finalObj.then(execTasks(), execTasks(1));

				} else {
					execTasks().apply(null, arguments);
				}

				return res;
			};
		}

		if (p.wrapper) {
			const
				link = p.wrapper(...[wrappedObj].concat(p.needCall ? id : [], p.args));

			if (p.linkByWrapper) {
				id = link;
			}
		}

		const link = {
			id,
			obj: p.obj,
			objName: p.obj.name,
			label: p.label,
			onComplete: [],
			onClear: [].concat(p.onClear || [])
		};

		if (labelCache) {
			this.clearAsync({...p, replacedBy: link});
		}

		links.set(id, link);

		if (p.label) {
			labels[p.label] = id;
		}

		return id;
	}

	/**
	 * Отменяет заданные обработчики
	 * @param p
	 */
	protected clearAsync(p): this {
		const
			baseCache = this.initCache(p.name);

		let cache;
		if (p.group) {
			if (Object.isRegExp(p.group)) {
				$C(baseCache.groups).forEach((g) => {
					if (p.group.test(g)) {
						this.clearAsync({...p, group: g});
					}
				});

				return this;
			}

			if (!baseCache.groups[p.group]) {
				return this;
			}

			cache = baseCache.groups[p.group];

		} else {
			cache = baseCache.root;
		}

		const
			{labels, links} = cache;

		if (p.label) {
			const
				tmp = labels[p.label];

			if (p.id != null && p.id !== tmp) {
				return this;
			}

			p.id = tmp;
		}

		if (p.id != null) {
			const
				link = links.get(p.id);

			if (link) {
				links.delete(link.id);
				labels[link.label] = undefined;

				const ctx = {
					...p,
					link,
					type: 'clearAsync'
				};

				const
					clearHandlers = link.onClear;

				for (let i = 0; i < clearHandlers.length; i++) {
					clearHandlers[i].call(this.context || this, ctx);
				}

				if (p.clearFn) {
					p.clearFn(link.id, ctx);
				}
			}

		} else {
			const
				values = links.values();

			for (let el = values.next(); !el.done; el = values.next()) {
				this.clearAsync({...p, id: el.value.id});
			}
		}

		return this;
	}

	/**
	 * Отменяет все асинхронные обработчики по заданным параметрам
	 * @param p
	 */
	protected clearAllAsync(p): this {
		this.clearAsync.apply(this, arguments);

		const
			obj = this.initCache(p.name).groups,
			keys = Object.keys(obj);

		for (let i = 0; i < keys.length; i++) {
			this.clearAsync({...p, group: keys[i]});
		}

		return this;
	}

	/**
	 * Обертка для setImmediate
	 *
	 * @param fn - функция обратного вызова
	 * @param [args] - дополнительные аргументы setImmediate
	 */
	setImmediate(fn: Function, ...args: any[]): number;

	/**
	 * @param params - параметры операции:
	 *   *) fn - функция обратного вызова
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [onClear] - обработчик события clearAsync
	 *
	 * @param [args] - дополнительные аргументы setImmediate
	 */
	setImmediate(params: AsyncCbOpts, ...args: any[]): number;
	setImmediate(p, ...args) {
		return this.setAsync({
			...p,
			name: 'immediate',
			obj: p.fn || Async.getIfNotObject(p),
			clearFn: clearImmediate,
			wrapper: setImmediate,
			linkByWrapper: true,
			args
		});
	}

	/**
	 * Обертка для clearImmediate
	 * @param id - ид операции
	 */
	clearImmediate(id: number): this;

	/**
	 * @param params - параметры операции:
	 *   *) [id] - ид операции
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	clearImmediate(params: ClearOptsId<number>): this;
	clearImmediate(p): this {
		return this.clearAsync({
			...p,
			name: 'immediate',
			clearFn: clearImmediate,
			id: p.id || Async.getIfNotObject(p)
		});
	}

	/**
	 * Отменяет все setImmediate операции
	 */
	clearAllImmediates(): this {
		return this.clearAllAsync({name: 'immediate', clearFn: clearImmediate});
	}

	/**
	 * Обертка для setInterval
	 *
	 * @param fn - функция обратного вызова
	 * @param interval - значение интервала
	 * @param [args] - дополнительные аргументы setInterval
	 */
	setInterval(fn: Function, interval: number, ...args: any[]): number;

	/**
	 * @param params - параметры операции:
	 *   *) fn - функция обратного вызова
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [onClear] - обработчик события clearAsync
	 *
	 * @param interval - значение интервала
	 * @param [args] - дополнительные аргументы setInterval
	 */
	setInterval(params: AsyncCbOpts, interval: number, ...args: any[]): number;
	setInterval(p, interval: number, ...args) {
		return this.setAsync({
			...p,
			name: 'interval',
			obj: p.fn || Async.getIfNotObject(p),
			clearFn: clearInterval,
			wrapper: setInterval,
			linkByWrapper: true,
			interval: true,
			args: [interval, ...args]
		});
	}

	/**
	 * Обертка для clearInterval
	 * @param id - ид операции
	 */
	clearInterval(id: number): this;

	/**
	 * @param params - параметры операции:
	 *   *) [id] - ид операции
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	clearInterval(params: ClearOptsId<number>): this;
	clearInterval(p): this {
		return this.clearAsync({
			...p,
			name: 'interval',
			clearFn: clearInterval,
			id: p.id || Async.getIfNotObject(p)
		});
	}

	/**
	 * Отменяет все setInterval операции
	 */
	clearAllIntervals(): this {
		return this.clearAllAsync({name: 'interval', clearFn: clearInterval});
	}

	/**
	 * Обертка для setTimeout
	 *
	 * @param fn - функция обратного вызова
	 * @param timer - значение таймера
	 * @param [args] - дополнительные аргументы setTimeout
	 */
	setTimeout(fn: Function, timer: number, ...args: any[]): number;

	/**
	 * @param params - параметры операции:
	 *   *) fn - функция обратного вызова
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [onClear] - обработчик события clearAsync
	 *
	 * @param timer - значение таймера
	 * @param [args] - дополнительные аргументы setTimeout
	 */
	setTimeout(params: AsyncCbOpts, timer: number, ...args: any[]): number;
	setTimeout(p, timer: number, ...args) {
		return this.setAsync({
			...p,
			name: 'timeout',
			obj: p.fn || Async.getIfNotObject(p),
			clearFn: clearTimeout,
			wrapper: setTimeout,
			linkByWrapper: true,
			args: [timer, ...args]
		});
	}

	/**
	 * Обертка для clearTimeout
	 * @param id - ид операции
	 */
	clearTimeout(id: number): this;

	/**
	 * @param params - параметры операции:
	 *   *) [id] - ид операции
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	clearTimeout(params: ClearOptsId<number>): this;
	clearTimeout(p): this {
		return this.clearAsync({
			...p,
			name: 'timeout',
			clearFn: clearTimeout,
			id: p.id || Async.getIfNotObject(p)
		});
	}

	/**
	 * Отменяет все setTimeout операции
	 */
	clearAllTimeouts(): this {
		return this.clearAllAsync({name: 'timeout', clearFn: clearTimeout});
	}

	/**
	 * Обертка для requestAnimationFrame
	 *
	 * @param fn - функция обратного вызова
	 * @param [element] - ссылка на анимируемый элемент
	 */
	requestAnimationFrame(fn: Function, element?: Element): number;

	/**
	 * @param params - параметры операции:
	 *   *) fn - функция обратного вызова
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [onClear] - обработчик события clearAsync
	 *
	 * @param [element] - сылка на анимируемый элемент
	 */
	requestAnimationFrame(params: AsyncCbOpts, element?: Element): number;
	requestAnimationFrame(p, element) {
		return this.setAsync({
			...p,
			name: 'animationFrame',
			obj: p.fn || Async.getIfNotObject(p),
			clearFn: cancelAnimationFrame,
			wrapper: requestAnimationFrame,
			linkByWrapper: true,
			args: element
		});
	}

	/**
	 * Обертка для cancelAnimationFrame
	 * @param id - ид операции
	 */
	cancelAnimationFrame(id: number): this;

	/**
	 * @param params - параметры операции:
	 *   *) [id] - ид операции
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	cancelAnimationFrame(params: ClearOptsId<number>): this;
	cancelAnimationFrame(p): this {
		return this.clearAsync({
			...p,
			name: 'animationFrame',
			clearFn: cancelAnimationFrame,
			id: p.id || Async.getIfNotObject(p)
		});
	}

	/**
	 * Отменяет все requestAnimationFrame операции
	 */
	cancelAllAnimationFrames(): this {
		return this.clearAllAsync({name: 'animationFrame', clearFn: cancelAnimationFrame});
	}

	/**
	 * Обертка для requestIdleCallback
	 *
	 * @param fn - функция обратного вызова
	 * @param [options] - дополнительные опции метода
	 */
	requestIdleCallback(fn: Function, options?: {timeout?: number}): number;

	/**
	 * @param params - параметры операции:
	 *   *) fn - функция обратного вызова
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [onClear] - обработчик события clearAsync
	 *
	 * @param [options] - дополнительные опции метода
	 */
	requestIdleCallback(params: AsyncCbOpts, options?: {timeout?: number}): number;
	requestIdleCallback(p, options) {
		return this.setAsync({
			...p,
			name: 'idleCallback',
			obj: p.fn || Async.getIfNotObject(p),
			clearFn: cancelIdleCallback,
			wrapper: requestIdleCallback,
			linkByWrapper: true,
			args: options
		});
	}

	/**
	 * Обертка для cancelIdleCallback
	 * @param id - ид операции
	 */
	cancelIdleCallback(id: number): this;

	/**
	 * @param params - параметры операции:
	 *   *) [id] - ид операции
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	cancelIdleCallback(params: ClearOptsId<number>): this;
	cancelIdleCallback(p): this {
		return this.clearAsync({
			...p,
			name: 'idleCallback',
			clearFn: cancelIdleCallback,
			id: p.id || Async.getIfNotObject(p)
		});
	}

	/**
	 * Отменяет все requestIdleCallback операции
	 */
	cancelAllIdleCallbacks(): this {
		return this.clearAllAsync({name: 'idleCallback', clearFn: cancelIdleCallback});
	}

	/**
	 * Обертка для потоков: WebWorker, Socket и т.д.
	 *
	 * @param worker
	 * @param [params] - дополнительные параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [onClear] - обработчик события clearAsync
	 */
	worker<T>(worker: T & WorkerLike, params?: SimpleAsyncCbOpts): T {
		return this.setAsync({
			...params,
			name: 'worker',
			obj: worker || Async.getIfNotObject(params),
			clearFn: Async.terminateWorker,
			interval: true
		});
	};

	/**
	 * Уничтожает заданный поток
	 * @param worker
	 */
	terminateWorker<T>(worker: T & WorkerLike): this;

	/**
	 * @param params - параметры операции:
	 *   *) [id] - исходный поток
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	terminateWorker<T>(params: ClearOptsId<T & WorkerLike>): this;
	terminateWorker(p): this {
		return this.clearAsync({
			...p,
			name: 'worker',
			clearFn: Async.terminateWorker,
			id: p.id || Async.getIfNotObject(p)
		});
	}

	/**
	 * Уничтожает все зарегистрированные потоки
	 */
	terminateAllWorkers(): this {
		return this.clearAllAsync({name: 'worker', clearFn: Async.terminateWorker});
	}

	/**
	 * Обертка для удаленного запроса
	 *
	 * @param request
	 * @param [params] - дополнительные параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой,
	 *        а если replace, то с последней
	 *
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 */
	request(request: RequestLike, params?: AsyncOpts): Promise<any> {
		return this.setAsync({
			...params,
			name: 'request',
			obj: request,
			clearFn: Async.cancelRequest,
			wrapper: (fn, req) => req.then(fn, fn),
			needCall: true
		});
	};

	/**
	 * Отменяет заданный удаленный запрос
	 * @param request
	 */
	cancelRequest<T>(request: RequestLike): this;

	/**
	 * @param params - параметры операции:
	 *   *) [id] - объект запроса
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	cancelRequest<T>(params: ClearOptsId<T & WorkerLike>): this;
	cancelRequest(p): this {
		return this.clearAsync({
			...p,
			name: 'request',
			clearFn: Async.cancelRequest,
			id: p.id || Async.getIfNotObject(p)
		});
	}

	/**
	 * Уничтожает все зарегистрированные удаленные запросы
	 */
	cancelAllRequests(): this {
		return this.clearAllAsync({name: 'request', clearFn: Async.cancelRequest});
	}

	/**
	 * Обертка для callback функции
	 *
	 * @param cb
	 * @param [params] - дополнительные параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [onClear] - обработчик события clearAsync
	 */
	proxy(cb: Function, params?: SimpleAsyncCbOpts): Function {
		return this.setAsync({
			...params,
			name: 'proxy',
			obj: cb,
			wrapper: (fn) => fn,
			linkByWrapper: true
		});
	};

	/**
	 * Отменяет выполнение заданной callback функции
	 * @param cb
	 */
	cancelProxy<T>(cb: Function): this;

	/**
	 * @param params - параметры операции:
	 *   *) [id] - исходный callback
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	cancelProxy<T>(params: ClearOptsId<Function>): this;
	cancelProxy(p): this {
		return this.clearAsync({
			...p,
			name: 'proxy',
			id: p.id || Async.getIfNotObject(p)
		});
	}

	/**
	 * Отменяет выполнение всех зарегистрированных callback функций
	 */
	cancelAllProxies(): this {
		return this.clearAllAsync({name: 'proxy'});
	}

	/**
	 * Обертка для промиса
	 *
	 * @param promise
	 * @param [params] - дополнительные параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой,
	 *        а если replace, то с последней
	 *
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 */
	promise(promise: Promise<any>, params?: AsyncOpts): Promise<any> {
		return new Promise((resolve, reject) => {
			promise.then(
				<any>this.proxy(resolve, {
					...params,
					onClear: Async.onPromiseClear(resolve, reject)
				}),

				reject
			);
		});
	}

	/**
	 * Промис обертка над setTimeout
	 *
	 * @param timer
	 * @param [params] - дополнительные параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой,
	 *        а если replace, то с последней
	 *
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 */
	sleep(timer: number, params?: AsyncOpts): Promise<any> {
		return new Promise((resolve, reject) => {
			this.setTimeout(
				{
					...params,
					fn: resolve,
					onClear: Async.onPromiseClear(resolve, reject)
				},

				timer
			);
		});
	}

	/**
	 * Промис обертка над setImmediate
	 *
	 * @param [params] - дополнительные параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой,
	 *        а если replace, то с последней
	 *
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 */
	nextTick(params?: AsyncOpts): Promise<any> {
		return new Promise((resolve, reject) => {
			this.setImmediate({
				...params,
				fn: resolve,
				onClear: Async.onPromiseClear(resolve, reject)
			});
		});
	}

	/**
	 * Промис обертка над requestIdleCallback
	 *
	 * @param [params] - дополнительные параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой,
	 *        а если replace, то с последней
	 *
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 */
	idle(params?: AsyncOpts): Promise<any> {
		return new Promise((resolve, reject) => {
			this.requestIdleCallback({
				...params,
				fn: resolve,
				onClear: Async.onPromiseClear(resolve, reject)
			});
		});
	}

	/**
	 * Промис обертка над requestAnimationFrame
	 *
	 * @param [params] - дополнительные параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой,
	 *        а если replace, то с последней
	 *
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 */
	animationFrame(params?: AsyncOpts): Promise<any> {
		return new Promise((resolve, reject) => {
			this.requestAnimationFrame({
				...params,
				fn: resolve,
				onClear: Async.onPromiseClear(resolve, reject)
			});
		});
	}

	/**
	 * Возвращает промис, который не зарезолвится пока функция fn не вернет положительное значение
	 *
	 * @param fn
	 * @param [params] - дополнительные параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой,
	 *        а если replace, то с последней
	 *
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 */
	wait(fn: Function, params?: AsyncOpts): Promise<any> {
		return new Promise((resolve, reject) => {
			const id = this.setInterval({
				...params,

				fn: () => {
					if (fn()) {
						resolve();
						this.clearInterval(id);
					}
				},

				onClear: Async.onPromiseClear(resolve, reject)
			}, 15);
		});
	}

	/**
	 * Обертка для установки обработчика событий
	 *
	 * @param emitter - источник событий
	 * @param events - событие или массив событий (можно также указывать несколько событий через пробел)
	 * @param fn - функция обратного вызова
	 * @param [args] - дополнительные аргументы для emitter
	 */
	on<T>(emitter: T & EventEmitterLike, events: string | string[], fn: Function, ...args: any[]): Object;

	/**
	 * @param emitter - источник событий
	 * @param events - событие или массив событий (можно также указывать несколько событий через пробел)
	 * @param params - параметры операции:
	 *   *) fn - функция обратного вызова
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [single] - если true, то после первого вызова события оно будет очищено
	 *   *) [onClear] - обработчик события clearAsync
	 *
	 * @param [args] - дополнительные аргументы для emitter
	 */
	on<T>(
		emitter: T & EventEmitterLike,
		events: string | string[],
		params: AsyncCbOptsSingle,
		...args: any[]
	): Object;

	on(emitter, events, p, ...args) {
		events = Object.isArray(events) ? events : events.split(/\s+/);

		const
			links: any[] = [];

		for (const event of events) {
			let
				handler = p.fn || Async.getIfNotObject(p);

			links.push(this.setAsync({
				...p,
				name: 'eventListener',
				obj: handler,
				wrapper() {
					if (p.single && !emitter.once) {
						const baseHandler = handler;
						handler = function () {
							Async.removeEventListener({emitter, event, handler, args});
							return baseHandler.apply(this, arguments);
						};
					}

					const fn = p.single && emitter.once || emitter.addEventListener || emitter.addListener || emitter.on;
					fn.call(emitter, event, handler, ...args);

					return {
						event,
						emitter,
						handler,
						args
					};
				},

				clearFn: Async.removeEventListener,
				linkByWrapper: true,
				interval: !p.single,
				group: p.group || event
			}));
		}

		return events.length === 1 ? links[0] : links;
	}

	/**
	 * Обертка для установки разового (once) обработчика событий
	 *
	 * @param emitter - источник событий
	 * @param events - событие или массив событий (можно также указывать несколько событий через пробел)
	 * @param fn - функция обратного вызова
	 * @param [args] - дополнительные аргументы для emitter
	 */
	once<T>(emitter: T & EventEmitterLike, events: string | string[], fn: Function, ...args: any[]): Object;

	/**
	 * @param emitter - источник событий
	 * @param events - событие или массив событий (можно также указывать несколько событий через пробел)
	 * @param params - параметры операции:
	 *   *) fn - функция обратного вызова
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [onClear] - обработчик события clearAsync
	 *
	 * @param [args] - дополнительные аргументы для emitter
	 */
	once<T>(
		emitter: T & EventEmitterLike,
		events: string | string[],
		params: AsyncCbOpts,
		...args: any[]
	): Object;

	once(emitter, events, p, ...args) {
		return this.on(emitter, events, Object.isFunction(p) ? {fn: p, single: true} : {...p, single: true}, ...args);
	}

	/**
	 * Промис обертка над once
	 *
	 * @param emitter - источник событий
	 * @param events - событие или массив событий (можно также указывать несколько событий через пробел)
	 * @param params - параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой,
	 *        а если replace, то с последней
	 *
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *
	 * @param [args] - дополнительные аргументы для emitter
	 */
	promisifyOnce<T>(
		emitter: T & EventEmitterLike,
		events: string | string[],
		params: AsyncOpts,
		...args: any[]
	): Promise<any> {
		return new Promise((resolve, reject) => {
			this.once(emitter, events, {
				...params,
				fn: resolve,
				onClear: Async.onPromiseClear(resolve, reject)
			}, ...args);
		});
	};

	/**
	 * Обертка для удаления обработчика событий
	 * @param id - ид операции
	 */
	off(id: Object): this;

	/**
	 * @param params - параметры операции:
	 *   *) [id] - ид операции
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	off(params: ClearOptsId<Object>): this;
	off(p) {
		return this.clearAsync({
			...p,
			name: 'eventListener',
			id: p.id || Async.getIfEvent(p),
			clearFn: Async.removeEventListener
		});
	}

	/**
	 * Удаляет все установленные обработчики событий
	 */
	removeAllEventListeners(): this {
		return this.clearAllAsync({
			name: 'eventListener',
			clearFn: Async.removeEventListener
		});
	}

	/**
	 * Добавляет Drag&Drop обработчики на заданный элемент
	 *
	 * @param el
	 * @param params - параметры операции:
	 *   *) [join] - если true, то смежные операции (с одинаковой меткой) будут объединены с первой
	 *   *) [label] - метка операции (предыдущие операции с этой меткой будут отменены)
	 *   *) [group] - группа операции
	 *   *) [onClear] - обработчик события clearAsync
	 *   *) [onDragStart]
	 *   *) [onDrag]
	 *   *) [onDragEnd]
	 *
	 * @param [useCapture]
	 */
	dnd(
		el: Element,
		params: SimpleAsyncCbOpts & {
			onDragStart?: NodeEventCb | NodeEventOpts,
			onDrag?: NodeEventCb | NodeEventOpts,
			onDragEnd?: NodeEventCb | NodeEventOpts
		},

		useCapture?: boolean

	): string | symbol {
		const
			p = params;

		p.group = p.group || `dnd.${Math.random()}`;
		p.onClear = (<Function[]>[]).concat(p.onClear || []);

		function dragStartClear(...args) {
			$C(p.onClear).forEach((fn) => fn.call(this, ...args, 'dragstart'));
		}

		function dragClear(...args) {
			$C(p.onClear).forEach((fn) => fn.call(this, ...args, 'drag'));
		}

		function dragEndClear(...args) {
			$C(p.onClear).forEach((fn) => fn.call(this, ...args, 'dragend'));
		}

		const dragStartUseCapture = Boolean(
			p.onDragStart && Object.isBoolean((<any>p.onDragStart).capture) ?
				(<NodeEventOpts>p.onDragStart).capture : useCapture
		);

		const dragUseCapture = Boolean(
			p.onDrag && Object.isBoolean((<any>p.onDrag).capture) ?
				(<NodeEventOpts>p.onDrag).capture : useCapture
		);

		const dragEndUseCapture = Boolean(
			p.onDragEnd && Object.isBoolean((<any>p.onDragEnd).capture) ?
				(<NodeEventOpts>p.onDragEnd).capture : useCapture
		);

		const
			that = this,
			opts = {join: p.join, label: p.label, group: p.group};

		function dragStart(e) {
			e.preventDefault();

			let res;
			if (p.onDragStart) {
				res = (<NodeEventCb>((<NodeEventOpts>p.onDragStart).handler || p.onDragStart)).call(this, e, el);
			}

			const drag = (e) => {
				e.preventDefault();

				if (res !== false && p.onDrag) {
					res = (<NodeEventCb>((<NodeEventOpts>p.onDrag).handler || p.onDrag)).call(this, e, el);
				}
			};

			const
				links: any[] = [];

			$C(['mousemove', 'touchmove']).forEach((e) => {
				links.push(that.on(document, e, {...opts, fn: drag, onClear: dragClear}, dragUseCapture));
			});

			const dragEnd = (e) => {
				e.preventDefault();

				if (res !== false && p.onDragEnd) {
					res = (<NodeEventCb>((<NodeEventOpts>p.onDragEnd).handler || p.onDragEnd)).call(this, e, el);
				}

				$C(links).forEach((id) => that.off({id, group: p.group}));
			};

			$C(['mouseup', 'touchend']).forEach((e) => {
				links.push(that.on(document, e, {...opts, fn: dragEnd, onClear: dragEndClear}, dragEndUseCapture));
			});
		}

		this.on(el, 'mousedown touchstart', {...opts, fn: dragStart, onClear: dragStartClear}, dragStartUseCapture);
		return p.group;
	}

	/**
	 * Отменяет все асинхронные обработчики
	 *
	 * @param params - дополнительные параметры операции:
	 *   *) [label] - метка операции
	 *   *) [group] - группа операции
	 */
	clearAll(params: ClearOpts = {}): this {
		if (params.group || params.label) {
			this
				.off(params);

			this
				.clearImmediate(params)
				.clearInterval(params)
				.clearTimeout(params)
				.cancelIdleCallback(params)
				.cancelAnimationFrame(params);

			this
				.cancelRequest(params)
				.terminateWorker(params)
				.cancelProxy(params);

		} else {
			this
				.removeAllEventListeners();

			this
				.clearAllImmediates()
				.clearAllIntervals()
				.clearAllTimeouts()
				.cancelAllIdleCallbacks()
				.cancelAllAnimationFrames();

			this
				.cancelAllRequests()
				.terminateAllWorkers()
				.cancelAllProxies();
		}

		return this;
	}
}
