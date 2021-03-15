# core/request/error

This module provides a class for a request error and its details extractor.

## RequestError

Constructor of the class accepts two parameters: required `type` and optional `details`.

```
throw new RequestError('invalidStatus', details);
```

Now we support following types of `RequestError`:
* `invalidStatus` - response status from a server isn't considered as ok
* `abort` - request was aborted
* `timeout` - response from a server wasn't received for expected amount of time
* `offline` - no network

The second parameter could contain `request` and `response` objects and `error` object that is caused the problem.

## RequestErrorDetailsExtractor

The extractor gets details from `RequestError`. Constructor of the class accepts one optional parameter: `headerSettings`.
This settings allow filtering headers from request and response objects of details object of the error. It helps to hide
sensitive information.

The settings itself look like this:

```
const settings = {
    include: [...],
    exclude: [...]
};

const extractor = new RequestErrorDetailsExtractor(settings);
```

If `include` array is defined, then the extractor gets only headers from this array.
If `exclude` array is defined, then the extractor gets all available headers except the specified ones.
If both arrays are defined, then only `inlcude` array is using.
