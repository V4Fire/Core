"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _proxyClone = _interopRequireDefault(require("../../../core/object/proxy-clone"));

/*!
 * V4Fire Core
 * https://github.com/V4Fire/Core
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Core/blob/master/LICENSE
 */
describe('core/object/proxy-clone', () => {
  it('cloning an object', () => {
    const original = {
      user: {
        name: 'Bob',
        age: 56,
        skills: ['singing', 'dancing', 'programming']
      }
    };
    const clone = (0, _proxyClone.default)(original);
    clone.user.name = 'Jack';
    clone.user.skills.push('boxing');
    expect(clone.user.name).toBe('Jack');
    expect(original.user.name).toBe('Bob');
    expect(clone.user.skills).toEqual(['singing', 'dancing', 'programming', 'boxing']);
    expect(original.user.skills).toEqual(['singing', 'dancing', 'programming']);
  });
  it('cloning an array', () => {
    const original = [{
      name: 'Bob',
      age: 56,
      skills: ['singing', 'dancing', 'programming']
    }];
    const clone = (0, _proxyClone.default)(original);
    clone[0].name = 'Jack';
    clone[0].skills.push('boxing');
    clone.push({
      name: 'Sam',
      age: 23
    });
    expect(clone[0].name).toBe('Jack');
    expect(original[0].name).toBe('Bob');
    expect(clone[0].skills).toEqual(['singing', 'dancing', 'programming', 'boxing']);
    expect(original[0].skills).toEqual(['singing', 'dancing', 'programming']);
    expect(clone).toEqual([{
      name: 'Jack',
      age: 56,
      skills: ['singing', 'dancing', 'programming', 'boxing']
    }, {
      name: 'Sam',
      age: 23
    }]);
    expect(original).toEqual([{
      name: 'Bob',
      age: 56,
      skills: ['singing', 'dancing', 'programming']
    }]);
  });
  it('cloning an object with Map/Set properties', () => {
    const original = new Map([['user', {
      name: 'Bob',
      age: 56,
      skills: new Set(['singing', 'dancing', 'programming'])
    }]]);
    const clone = (0, _proxyClone.default)(original);
    clone.get('user').name = 'Jack';
    clone.get('user').skills.add('boxing');
    expect(clone.get('user').name).toBe('Jack');
    expect(original.get('user').name).toBe('Bob');
    expect(clone.get('user').skills).toBeInstanceOf(Set);
    expect([...clone.get('user').skills]).toEqual(['singing', 'dancing', 'programming', 'boxing']);
    expect([...original.get('user').skills]).toEqual(['singing', 'dancing', 'programming']);
  });
  it('cloning an object with WeakMap/WeakSet properties', () => {
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
    const clone = (0, _proxyClone.default)(original);
    clone.get(user).name = 'Jack';
    clone.get(user).skills.add(boxing);
    expect(clone.get(user).name).toBe('Jack');
    expect(original.get(user).name).toBe('Bob');
    expect(clone.get(user).skills).toBeInstanceOf(WeakSet);
    expect(clone.get(user).skills.has(boxing)).toBeTrue();
    expect(original.get(user).skills.has(boxing)).toBeFalse();
  });
  it('cloning an iterable object', () => {
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
    const clone = (0, _proxyClone.default)(original);

    for (const el of clone.get('user').skills) {
      el.type = [...el.type].reverse().join('');
    }

    expect([...clone.get('user').skills]).toEqual([{
      type: 'gnignis'
    }, {
      type: 'gnicnad'
    }]);
    expect([...original.get('user').skills]).toEqual([{
      type: 'singing'
    }, {
      type: 'dancing'
    }]);

    for (const el of clone.get('user').skillsSet) {
      el.type = [...el.type].reverse().join('');
    }

    expect([...clone.get('user').skillsSet]).toEqual([{
      type: 'gnignis'
    }, {
      type: 'gnicnad'
    }]);
    expect([...original.get('user').skillsSet]).toEqual([{
      type: 'singing'
    }, {
      type: 'dancing'
    }]);
  });
});