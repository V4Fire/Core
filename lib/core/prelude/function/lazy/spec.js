"use strict";

describe('core/prelude/function/lazy', () => {
  it('`debounce`', done => {
    let i = 0;
    const foo = (() => {
      i++;
    }).debounce(10);
    foo();
    foo();
    foo();
    foo();
    foo();
    setTimeout(() => {
      expect(i).toBe(1);
      done();
    }, 20);
  });
  it('`Function.debounce`', done => {
    let i = 0;
    const foo = Function.debounce(() => {
      i++;
    }, 10);
    foo();
    foo();
    foo();
    foo();
    foo();
    setTimeout(() => {
      expect(i).toBe(1);
      done();
    }, 20);
  });
  it('`Function.debounce` overload', done => {
    let i = 0;
    const foo = Function.debounce(10)(() => {
      i++;
    });
    foo();
    foo();
    foo();
    foo();
    foo();
    setTimeout(() => {
      expect(i).toBe(1);
      done();
    }, 20);
  });
  it('`throttle`', done => {
    let i = 0;
    const foo = (() => {
      i++;
    }).throttle(10);
    foo();
    foo();
    foo();
    foo();
    foo();
    expect(i).toBe(1);
    setTimeout(() => {
      expect(i).toBe(2);
      done();
    }, 20);
  });
  it('`throttle` with skipping the rest calls', done => {
    let i = 0;
    const foo = (() => {
      i++;
    }).throttle({
      delay: 10,
      single: true
    });
    foo();
    foo();
    foo();
    foo();
    foo();
    expect(i).toBe(1);
    setTimeout(() => {
      expect(i).toBe(1);
      done();
    }, 20);
  });
  it('`throttle` with an interval', done => {
    let i = 0;
    const foo = (() => {
      i++;
    }).throttle({
      delay: 500
    });
    const timerId = setInterval(foo, 10);
    setTimeout(() => {
      expect(i).toBe(3);
      clearInterval(timerId);
      setTimeout(() => {
        expect(i).toBe(4);
        done();
      }, 500);
    }, 1100);
  });
  it('`throttle` with an interval and skipping the rest calls', done => {
    let i = 0;
    const foo = (() => {
      i++;
    }).throttle({
      delay: 500,
      single: true
    });
    const timerId = setInterval(foo, 10);
    setTimeout(() => {
      expect(i).toBe(3);
      clearInterval(timerId);
      setTimeout(() => {
        expect(i).toBe(3);
        done();
      }, 500);
    }, 1100);
  });
  it('`Function.throttle`', done => {
    let i = 0;
    const foo = Function.throttle(() => {
      i++;
    }, 10);
    foo();
    foo();
    foo();
    foo();
    foo();
    expect(i).toBe(1);
    setTimeout(() => {
      expect(i).toBe(2);
      done();
    }, 20);
  });
  it('`Function.throttle` overload #1', done => {
    let i = 0;
    const foo = Function.throttle(10)(() => {
      i++;
    });
    foo();
    foo();
    foo();
    foo();
    foo();
    expect(i).toBe(1);
    setTimeout(() => {
      expect(i).toBe(2);
      done();
    }, 20);
  });
  it('`Function.throttle` overload #2', done => {
    let i = 0;
    const foo = Function.throttle({
      delay: 10,
      single: true
    })(() => {
      i++;
    });
    foo();
    foo();
    foo();
    foo();
    foo();
    expect(i).toBe(1);
    setTimeout(() => {
      expect(i).toBe(1);
      done();
    }, 20);
  });
});