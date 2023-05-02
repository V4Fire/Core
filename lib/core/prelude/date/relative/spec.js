"use strict";

describe('core/prelude/date/relative', () => {
  it('`relative`', () => {
    {
      const res = new Date().rewind({
        seconds: 10
      }).relative();
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'seconds',
        value: 10
      });
      expect(res.diff).toBeGreaterThanOrEqual(10 .seconds() - 5);
    }
    {
      const res = new Date().rewind({
        minutes: 10
      }).relative();
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'minutes',
        value: 10
      });
      expect(res.diff).toBeGreaterThanOrEqual(10 .minutes() - 5);
    }
    {
      const res = new Date().rewind({
        hours: 10
      }).relative();
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'hours',
        value: 10
      });
      expect(res.diff).toBeGreaterThanOrEqual(10 .hours() - 5);
    }
    {
      const res = new Date().rewind({
        days: 4
      }).relative();
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'days',
        value: 4
      });
      expect(res.diff).toBeGreaterThanOrEqual(4 .days() - 5);
    }
    {
      const res = new Date(Date.now() - 2 .weeks()).relative();
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'weeks',
        value: 2
      });
      expect(res.diff).toBeGreaterThanOrEqual(2 .weeks() - 5);
    }
    {
      const date = new Date().rewind({
          months: 2
        }),
        res = date.relative();
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'months',
        value: 2
      });
      expect(res.diff).toBeGreaterThanOrEqual(Date.now().valueOf() - date.valueOf() - 5);
    }
    {
      const date = new Date().rewind({
          years: 2
        }),
        res = date.relative();
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'years',
        value: 2
      });
      expect(res.diff).toBeGreaterThanOrEqual(Date.now().valueOf() - date.valueOf() - 5);
    }
  });
  it('Date.relative', () => {
    const res = Date.relative(new Date().rewind({
      minutes: 10
    }));
    expect(Object.reject(res, 'diff')).toEqual({
      type: 'minutes',
      value: 10
    });
    expect(res.diff).toBeGreaterThanOrEqual(10 .minutes() - 5);
  });
  it('`relativeTo`', () => {
    {
      const res = new Date().rewind({
        seconds: 10
      }).relativeTo(new Date());
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'seconds',
        value: 10
      });
      expect(res.diff).toBeGreaterThanOrEqual(10 .seconds() - 5);
    }
    {
      const res = new Date().rewind({
        minutes: 10
      }).relativeTo(new Date());
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'minutes',
        value: 10
      });
      expect(res.diff).toBeGreaterThanOrEqual(10 .minutes() - 5);
    }
    {
      const res = new Date().rewind({
        hours: 10
      }).relativeTo(new Date());
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'hours',
        value: 10
      });
      expect(res.diff).toBeGreaterThanOrEqual(10 .hours() - 5);
    }
    {
      const res = new Date().rewind({
        days: 4
      }).relativeTo(new Date());
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'days',
        value: 4
      });
      expect(res.diff).toBeGreaterThanOrEqual(4 .days() - 5);
    }
    {
      const dateNow = new Date(),
        res = new Date(dateNow - 2 .weeks()).relativeTo(dateNow);
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'weeks',
        value: 2
      });
      expect(res.diff).toBeGreaterThanOrEqual(2 .weeks() - 5);
    }
    {
      const dateNow = new Date(),
        date = new Date().rewind({
          months: 2
        }),
        res = date.relativeTo(dateNow);
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'months',
        value: 2
      });
      expect(res.diff).toBeGreaterThanOrEqual(dateNow.valueOf() - date.valueOf() - 5);
    }
    {
      const dateNow = new Date(),
        date = new Date().rewind({
          years: 2
        }),
        res = date.relativeTo(dateNow);
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'years',
        value: 2
      });
      expect(res.diff).toBeGreaterThanOrEqual(dateNow.valueOf() - date.valueOf() - 5);
    }
  });
  it('`Date.relativeTo`', () => {
    {
      const res = Date.relativeTo(new Date().rewind({
        minutes: 10
      }), new Date());
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'minutes',
        value: 10
      });
      expect(res.diff).toBeGreaterThanOrEqual(10 .minutes() - 5);
    }
    {
      const res = Date.relativeTo(new Date().rewind({
        minutes: 10
      }))(new Date());
      expect(Object.reject(res, 'diff')).toEqual({
        type: 'minutes',
        value: 10
      });
      expect(res.diff).toBeGreaterThanOrEqual(10 .minutes() - 5);
    }
  });
});