"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _sync = _interopRequireDefault(require("../../../../core/promise/sync"));

/* eslint-disable max-lines-per-function */

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/prelude/structures/sync-promise', () => {
  it('simple `then`', () => {
    let i = 1;
    new _sync.default(resolve => {
      resolve();
    }).then(() => i + 2).then(val => i = val * 2);
    expect(i).toBe(6);
  });
  it('unwraps a promise', done => {
    let err;
    const sleep = new _sync.default(r => setTimeout(() => r(10), 30));

    try {
      sleep.unwrap();
    } catch (e) {
      err = e;
    }

    setTimeout(() => {
      expect(err).toBeInstanceOf(Error);
      expect(err?.message).toBe("Can't unwrap a pending promise");
      expect(sleep.unwrap()).toBe(10);
      done();
    }, 50);
  });
  it('unwraps a rejected promise', () => {
    let err;

    try {
      _sync.default.reject('Boom!').unwrap();
    } catch (e) {
      err = e;
    }

    expect(err).toBe('Boom!');
  });
  it('promise that is resolved with another promise', async () => {
    const i = await new _sync.default(resolve => {
      resolve(new Promise(r => setTimeout(() => r(_sync.default.resolve(1)), 50)));
    }).then(val => new Promise(r => setTimeout(() => r(_sync.default.resolve(val + 2)), 50))).then(val => val * 2);
    expect(i).toBe(6);
  });
  it('promise that is rejected with another promise', async () => {
    let i;

    try {
      await new _sync.default(resolve => {
        resolve(new Promise(r => setTimeout(() => r(_sync.default.resolve(1)), 50)));
      }).then(val => new Promise(r => setTimeout(() => r(_sync.default.reject(val + 2)), 50))).catch(val => Promise.reject(val * 2));
    } catch (err) {
      i = err;
    }

    expect(i).toBe(6);
  });
  it('promise that is rejected with another promise by using a constructor', async () => {
    let i;

    try {
      await new _sync.default((resolve, reject) => {
        reject(_sync.default.resolve(1));
      });
    } catch (err) {
      i = err;
    }

    expect(i).toBeInstanceOf(_sync.default);
    expect(await i).toBe(1);
  });
  it('double promise resolution', async () => {
    expect(await new _sync.default(resolve => {
      resolve(1);
      resolve(2);
    })).toBe(1);
    expect(await new _sync.default(resolve => {
      resolve(new Promise(r => setTimeout(() => r(1)), 100));
      resolve(2);
    })).toBe(1);
  });
  it('double promise rejection', async () => {
    try {
      await new _sync.default((resolve, reject) => {
        reject(1);
        reject(2);
      });
    } catch (err) {
      expect(err).toBe(1);
    }

    try {
      await new _sync.default((resolve, reject) => {
        reject(new Promise(r => setTimeout(() => r(1)), 100));
        reject(2);
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Promise);
      expect(await err).toBe(1);
    }
  });
  it('resolved `then` after `catch`', () => {
    let i = 1;
    new _sync.default(resolve => {
      resolve();
    }).catch(() => undefined).then(() => i + 2).then(val => i = val * 2);
    expect(i).toBe(6);
  });
  it('rejected `then`', () => {
    let i = 1;
    new _sync.default((resolve, reject) => {
      reject('boom');
    }).then(val => val * 2, err => {
      expect(err).toBe('boom');
      i += 2;
    });
    expect(i).toBe(3);
  });
  it('dynamically rejected `catch`', () => {
    let i = 1;
    new _sync.default(resolve => {
      resolve();
    }).then(() => {
      throw 'boom';
    }).then(val => val * 2).catch(err => {
      expect(err).toBe('boom');
      return i += 2;
    }).then(val => i = val * 2);
    expect(i).toBe(6);
  });
  it('`catch`', () => {
    let i = 1;
    new _sync.default((resolve, reject) => {
      reject('boom');
    }).then(val => val * 2).catch(err => {
      expect(err).toBe('boom');
      i += 2;
    });
    expect(i).toBe(3);
  });
  it('dynamically rejected `catch`', () => {
    let i = 1;
    new _sync.default(resolve => {
      resolve();
    }).then(() => {
      throw 'boom';
    }).then(val => val * 2).catch(err => {
      expect(err).toBe('boom');
      return i += 2;
    }).then(val => i = val * 2);
    expect(i).toBe(6);
  });
  it('resolved `finally`', () => {
    let i = 1;
    new _sync.default(resolve => {
      resolve();
    }).then(() => i + 2).finally(arg => {
      expect(arg).toBeUndefined();
      i *= 2;
    });
    expect(i).toBe(2);
  });
  it('rejected `finally`', async () => {
    try {
      let i = 1;
      const promise = new _sync.default((resolve, reject) => {
        reject('boom');
      }).finally(arg => {
        expect(arg).toBeUndefined();
        i *= 2;
      });
      expect(i).toBe(2);
      await promise;
    } catch (err) {
      expect(err).toBe('boom');
    }
  });
  it('dynamically rejected `finally`', () => {
    let i = 1;
    new _sync.default(resolve => {
      resolve();
    }).then(() => {
      throw 'boom';
    }).then(val => val * 2).catch(err => {
      expect(err).toBe('boom');
      return i + 2;
    }).finally(arg => {
      expect(arg).toBeUndefined();
      return i *= 2;
    }).then(val => {
      expect(val).toBe(3);
      return i = val * 2;
    });
    expect(i).toBe(6);
  });
  it('`finally` that returns an error', () => {
    let reason;
    new _sync.default(resolve => {
      resolve(1);
    }).finally(() => _sync.default.reject('Boom')).catch(err => {
      reason = err;
    });
    expect(reason).toBe('Boom');
  });
  it('`finally` that throws an error', () => {
    let reason;
    new _sync.default(resolve => {
      resolve(1);
    }).finally(() => {
      throw 'Boom';
    }).catch(err => {
      reason = err;
    });
    expect(reason).toBe('Boom');
  });
  it('`SyncPromise.resolve`', () => {
    let i = 0,
        j = 0;

    _sync.default.resolve(1).then(val => i = val + 2).then(val => i = val * 2);

    _sync.default.resolve(_sync.default.resolve(1)).then(val => j = val + 2).then(val => j = val * 2);

    expect(i).toBe(6);
    expect(j).toBe(6);
  });
  it('`SyncPromise.reject`', () => {
    let i = 1;

    _sync.default.reject('boom').catch(err => {
      expect(err).toBe('boom');
      i += 2;
    });

    expect(i).toBe(3);
  });
  describe('`SyncPromise.all`', () => {
    it('all promises are resolved', () => {
      let res;

      _sync.default.all([1, null, _sync.default.resolve(2)]).then(val => res = val);

      expect(res).toEqual([1, null, 2]);
    });
    it('some promises are rejected', () => {
      let res;

      _sync.default.all([1, null, _sync.default.reject(2)]).then(val => res = val, err => res = err);

      expect(res).toBe(2);
    });
  });
  it('`SyncPromise.allSettled`', () => {
    let res;

    _sync.default.allSettled([1, null, _sync.default.reject(2)]).then(val => res = val, err => res = err);

    expect(res).toEqual([{
      status: 'fulfilled',
      value: 1
    }, {
      status: 'fulfilled',
      value: null
    }, {
      status: 'rejected',
      reason: 2
    }]);
  });
  describe('`SyncPromise.race`', () => {
    it('all promises are resolved', () => {
      let res;

      _sync.default.race([Promise.resolve(1), _sync.default.resolve(2)]).then(val => res = val);

      expect(res).toBe(2);
    });
    it('some promises are rejected', () => {
      let res;

      _sync.default.race([Promise.resolve(1), _sync.default.reject(2)]).then(val => res = val, err => res = ['error', err]);

      expect(res).toEqual(['error', 2]);
    });
  });
});