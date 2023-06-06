/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */

'use strict';

let gulpInitialized;

/**
 * Wraps all gulp methods to enable overriding of tasks.
 *
 * ```js
 * // Since gulp@4 we can't do this,
 * // but this feature can be very useful, if we need to override some tasks,
 * // that are defined at the parent layer, i.e, from the external library
 *
 * gulp.task('foo', () => {
 *   // ...
 * });
 *
 * gulp.task('foo', () => {
 *   // ...
 * });
 * ```
 *
 * @param gulp - link to the gulp module
 */
exports.wrapGulp = function wrapGulp(gulp) {
	const
		addTask = gulp.task.bind(gulp),
		series = gulp.series.bind(gulp),
		parallel = gulp.parallel.bind(gulp),
		cache = new Map();

	gulp.task = (name, tasks) => {
		if (gulpInitialized) {
			return addTask(name, tasks);
		}

		cache.set(name.name || name, tasks || name);
	};

	function apply(tasks) {
		if (Object.isArray(tasks)) {
			return tasks.map((tasks) => apply(tasks));
		}

		if (Object.isDictionary(tasks)) {
			return tasks.init();
		}

		return tasks;
	}

	gulp.series = (tasks) => {
		if (gulpInitialized) {
			return series(tasks);
		}

		return {
			type: 'series',
			init: () => series(apply(tasks))
		};
	};

	gulp.parallel = (tasks) => {
		if (gulpInitialized) {
			return parallel(tasks);
		}

		return {
			type: 'parallel',
			init: () => parallel(apply(tasks))
		};
	};

	gulp.init = () => {
		if (gulpInitialized) {
			return;
		}

		gulpInitialized = true;
		Object.forEach(cache, (tasks, name) => {
			addTask(name, typeof tasks === 'function' ? tasks : tasks.init());
		});
	};
};
