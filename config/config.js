'use strict';

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

const
	$C = require('collection.js'),
	Sugar = require('sugar').extend();

const
	path = require('path'),
	isPathEqual = require('path-equal').pathEqual;

const
	fs = require('fs-extra-promise');

const
	{env} = process;

const
	origin = Symbol('Original function');

/**
 * Class to create a config object with support of inheritance
 * @template C
 */
class Config {
	constructor() {
		this.src = {};
		this.envs = {};

		/** @type {!Array<string>} */
		this.roots = [];

		/** @type {!Array<string>} */
		this.client = [];

		/** @type {!Array<string>} */
		this.server = [];
	}

	/**
	 * Wrapper for $C.extend
	 *
	 * @param {...?} args
	 * @returns {!Object}
	 */
	extend(...args) {
		return $C.extend({
			deep: true,
			withProto: true,
			concatArray: true,
			concatFn: Sugar.Array.union
		}, ...args);
	}

	/**
	 * Expands the specified config to a plain object.
	 * Usually, this method is used to hash the config object.
	 *
	 * @param {Object=} [config]
	 * @returns {!Object}
	 */
	expand(config = this) {
		const blacklist = Object.assign(Object.create(null), {
			extend: true,
			expand: true,
			createConfig: true,
			hash: true
		});

		const reduce = (from, to) => {
			$C(from).forEach((el, key) => {
				if (blacklist[key]) {
					return;
				}

				if (Object.isFunction(el)) {
					if (!el.length) {
						try {
							to[key] = el.call(from);

						} catch {}
					}

				} else if (Object.isObject(el)) {
					to[key] = {};
					to[key] = reduce(el, to[key]);

				} else if (Object.isArray(el)) {
					to[key] = [];
					to[key] = reduce(el, to[key]);

				} else {
					to[key] = el;
				}
			});

			return to;
		};

		return reduce(config, {});
	}

	/**
	 * Returns a hash string of the config
	 *
	 * @param {Object=} [data] - extra data to hash
	 * @param {string=} [alg] - hash algorithm
	 * @param {number} [length] - hash length
	 * @returns {string}
	 */
	hash({data, alg = 'md5', length} = {}) {
		const
			objectHash = require('node-object-hash'),
			val = objectHash().hash({config: this.expand(), ...data}, {alg});

		if (length) {
			return val.slice(0, length);
		}

		return val;
	}

	/**
	 * Creates a config object with the specified options and returns it
	 *
	 * @template T
	 * @param {!Array<string>} dirs - list of initial directories ([0] - dirname, [1+] - src fields)
	 * @param {Object=} [envs] - map of environment variables
	 * @param {(string|Object)=} [mod] - url for a config modifier or object modifier (env configs)
	 * @param {T} opts
	 * @returns {!Object}
	 */
	createConfig({dirs, envs, mod}, opts) {
		const
			activeDir = dirs[0],
			isActiveConfig = isPathEqual(path.join(process.cwd(), 'config'), activeDir);

		if (envs) {
			this.extend(env, envs, $C.clone(env));
		}

		function setProto(obj, proto, link = []) {
			$C(obj).forEach((el, key) => {
				if (!el || typeof el !== 'object') {
					return;
				}

				key = [...link, key];

				const
					parent = $C(proto).get(key);

				if (parent && el !== parent) {
					Object.setPrototypeOf(el, parent);
				}

				setProto(el, proto, key);
			});
		}

		const
			modObj = mod ? include(mod, activeDir) : undefined,
			proto = modObj || Object.getPrototypeOf(opts);

		setProto(opts, proto);
		Object.setPrototypeOf(opts, proto);

		const
			config = this.extend(Object.create(proto), opts),
			p = this.getSrcMap(activeDir);

		$C(['roots'].concat(dirs.slice(1))).forEach((nm, i) => {
			let src;

			if (i) {
				if ({client: true, server: true}[nm]) {
					const s = p.pzlr;
					src = path.join(p.src, (nm === 'client' ? s.blockDir : s.serverDir) || '');

				} else {
					src = p.src;
				}

			} else {
				src = p.root;
			}

			config.src[nm] = (this.src[nm] || []).union(src);
		});

		function bindObjCtx(obj) {
			$C(obj).object(true).forEach((el, key) => {
				if (Object.isFunction(el)) {
					if (isPathEqual(path.join(process.cwd(), 'config'), activeDir)) {
						const
							o = el[origin] || el,
							ctx = Object.assign(Object.create({config}), obj);

						el[origin] = o;
						obj[key] = Object.assign(o.bind(ctx), {[origin]: o});
					}

				} else {
					obj[key] = el;

					if (el && typeof el === 'object') {
						bindObjCtx(el);
					}
				}
			});
		}

		if (isActiveConfig) {
			bindObjCtx(config);
		}

		if (envs) {
			$C(Object.keys(envs)).forEach((nm) => {
				config.envs[nm] = env[nm];
			});
		}

		config.hash = this.hash;
		config.extend = this.extend;
		config.expand = this.expand;

		return config;
	}

	/**
	 * Returns a map with paths of the specified initial directory
	 *
	 * @param {string} dir - initial directory (usually __dirname)
	 * @returns {{root: string, src: string, pzlr: {blockDir: (string|undefined), serverDir: (string|undefined)}}}
	 */
	getSrcMap(dir) {
		const
			root = path.join(dir, '../'),
			pzlr = fs.readJSONSync(path.join(root, '.pzlrrc'));

		return {
			pzlr,
			root,
			src: path.join(root, pzlr.sourceDir)
		};
	}
}

module.exports = new Config();
