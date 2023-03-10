"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _proxyReadonly = _interopRequireDefault(require("../../../core/object/proxy-readonly"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/object/proxy-readonly', () => {
  it('readonly object', () => {
    const original = {
      user: {
        name: 'Bob',
        age: 56,
        skills: ['singing', 'dancing', 'programming']
      }
    };
    const readonly = (0, _proxyReadonly.default)(original);
    expect(() => readonly.user.name = 'Jack').toThrowError("'set' on proxy: trap returned falsish for property 'name'");
    expect(() => readonly.user.skills.push('boxing')).toThrowError("'set' on proxy: trap returned falsish for property '3'");
    expect(readonly.user.name).toBe('Bob');
    expect(original.user.name).toBe('Bob');
    expect([...readonly.user.skills]).toEqual(['singing', 'dancing', 'programming']);
    expect([...original.user.skills]).toEqual(['singing', 'dancing', 'programming']);
    expect(() => {
      delete readonly.user.name;
    }).toThrowError("'deleteProperty' on proxy: trap returned falsish for property 'name'");
    expect(readonly.user.name).toBe('Bob');
    expect(original.user.name).toBe('Bob');
    expect(() => Object.defineProperty(readonly, 'foo', {
      value: 1
    })).toThrowError("'defineProperty' on proxy: trap returned falsish for property 'foo'");
  });
  it('readonly object with Map/Set properties', () => {
    const original = new Map([['user', {
      name: 'Bob',
      age: 56,
      skills: new Set(['singing', 'dancing', 'programming'])
    }]]);
    const readonly = (0, _proxyReadonly.default)(original);
    expect(() => readonly.get('user').name = 'Jack').toThrowError("'set' on proxy: trap returned falsish for property 'name'");
    readonly.get('user').skills.add('boxing');
    expect(readonly.get('user').name).toBe('Bob');
    expect(original.get('user').name).toBe('Bob');
    expect(readonly.get('user').skills).toBeInstanceOf(Set);
    expect([...readonly.get('user').skills]).toEqual(['singing', 'dancing', 'programming']);
    expect([...original.get('user').skills]).toEqual(['singing', 'dancing', 'programming']);
  });
  it('readonly object with WeakMap/WeakSet properties', () => {
    const user = {},
          singing = {},
          dancing = {},
          programming = {},
          boxing = {};
    const original = new WeakMap([[user, {
      name: 'Bob',
      age: 56,
      skills: new WeakSet([singing, dancing, programming])
    }]]);
    const readonly = (0, _proxyReadonly.default)(original);
    expect(() => readonly.get(user).name = 'Jack').toThrowError("'set' on proxy: trap returned falsish for property 'name'");
    readonly.get(user).skills.add(boxing);
    expect(readonly.get(user).name).toBe('Bob');
    expect(original.get(user).name).toBe('Bob');
    expect(readonly.get(user).skills).toBeInstanceOf(WeakSet);
    expect(readonly.get(user).skills.has(boxing)).toBe(false);
    expect(original.get(user).skills.has(boxing)).toBe(false);
  });
  it('readonly iterable object', () => {
    const original = new Map([['user', {
      name: 'Bob',
      age: 56,
      skills: [{
        type: 'singing'
      }, {
        type: 'dancing'
      }],
      skillsSet: [{
        type: 'singing'
      }, {
        type: 'dancing'
      }]
    }]]);
    const readonly = (0, _proxyReadonly.default)(original);

    for (const el of readonly.get('user').skills) {
      expect(() => el.type = [...el.type].reverse().join('')).toThrowError("'set' on proxy: trap returned falsish for property 'type'");
    }

    expect([...readonly.get('user').skills]).toEqual([{
      type: 'singing'
    }, {
      type: 'dancing'
    }]);
    expect([...original.get('user').skills]).toEqual([{
      type: 'singing'
    }, {
      type: 'dancing'
    }]);

    for (const el of readonly.get('user').skillsSet) {
      expect(() => el.type = [...el.type].reverse().join('')).toThrowError("'set' on proxy: trap returned falsish for property 'type'");
    }

    expect([...readonly.get('user').skillsSet]).toEqual([{
      type: 'singing'
    }, {
      type: 'dancing'
    }]);
    expect([...original.get('user').skillsSet]).toEqual([{
      type: 'singing'
    }, {
      type: 'dancing'
    }]);
  });
  it('Object.isExtensible', () => {
    expect(Object.isExtensible(null)).toBe(false);
    expect(Object.isExtensible(1)).toBe(false);
    expect(Object.isExtensible('2')).toBe(false);
    expect(Object.isExtensible(true)).toBe(false);
    expect(Object.isExtensible(Object.freeze({}))).toBe(false);
    expect(Object.isExtensible((0, _proxyReadonly.default)({}))).toBe(false);
    expect(Object.isExtensible({})).toBe(true);
  });
  it('Object.isSealed', () => {
    expect(Object.isSealed(null)).toBe(true);
    expect(Object.isSealed(1)).toBe(true);
    expect(Object.isSealed('2')).toBe(true);
    expect(Object.isSealed(true)).toBe(true);
    expect(Object.isSealed(Object.freeze({}))).toBe(true);
    expect(Object.isSealed((0, _proxyReadonly.default)({}))).toBe(true);
    expect(Object.isSealed({})).toBe(false);
  });
  it('Object.isFrozen', () => {
    expect(Object.isFrozen(null)).toBe(true);
    expect(Object.isFrozen(1)).toBe(true);
    expect(Object.isFrozen('2')).toBe(true);
    expect(Object.isFrozen(true)).toBe(true);
    expect(Object.isFrozen(Object.freeze({}))).toBe(true);
    expect(Object.isFrozen((0, _proxyReadonly.default)({}))).toBe(true);
    expect(Object.isFrozen({})).toBe(false);
  });
});