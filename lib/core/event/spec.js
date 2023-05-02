"use strict";

var _eventemitter = require("eventemitter2");
var _event = require("../../core/event");
describe('core/event', () => {
  it('`resolveAfterEvents`', done => {
    const emitter = new _eventemitter.EventEmitter2(),
      promise = (0, _event.resolveAfterEvents)(emitter, 'foo', 'bar');
    let i = 0;
    promise.then(() => {
      expect(i).toBe(2);
      done();
    });
    emitter.onAny(() => {
      i++;
    });
    emitter.emit('foo');
    emitter.emit('bar');
  });
  it('`createsAsyncSemaphore`', () => {
    let i = 0;
    const semaphore = (0, _event.createsAsyncSemaphore)(() => {
      i++;
    }, 'foo', 'bar');
    semaphore('foo');
    expect(i).toBe(0);
    semaphore('bar');
    expect(i).toBe(1);
    semaphore('bar');
    expect(i).toBe(1);
  });
});