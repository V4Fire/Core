# core/error

The module provides the base class for any errors. All classes of errors should extend this one.

## Reason

When TypeScript's target is < ES6, the transpiled code breaks inheritance from built-in classes.
For example:

```ts
class MyError extends Error {}
const error = new MyError();

// false
console.log(error instanceof MyError);

// true
console.log(error instanceof Error);
```

So `instanceof` won't work as expected. The same goes to a class that extends `MyError`: `instanceof` returns `true`
only for the `Error` class.

`BaseError` fixes this problem. Moreover, `BaseError` takes care of `name` field and sets it correctly
in the constructor.

## How to use

```ts
import { BaseError } from 'core/error';

class ValidationError extends BaseError {}
```

## Additional abilities

### Message format

You can define an error message via the first argument at the `BaseError` constructor. Additionally, `BaseError` allows you
to define a message format. It means that message can be generated based on arguments, passed to the error class
constructor. To achieve this, you need to override the protected `format` method with an inheriting class.

The `message` field always returns the result of invoking the `format` method. By default, the method returns a string that is passed
to `BaseError`'s constructor as the first argument.

```ts
class ValidationError extends BaseError {
  fieldName: string;

  constructor(fieldName: string) {
    super();
    this.fieldName = fieldName;
  }

  format(): string {
    return `Invalid field: ${this.fieldName}`;
  }
}

const error = new ValidationError('FullName');
console.log(error.message); // Invalid field: FullName
```

### Causing error

It's possible to pass an error as the second argument to the `BaseError` constructor. In this case, it's considered
as the error that caused the new one. After this, the error caused can be accessed via the read-only `cause` property.

```ts
class ExternalLibError extends BaseError {
  constructor(cause: Error) {
    super('An external lib failed', cause);
  }
}

try {
  // Do some stuff

} catch (e) {
  const error = new ExternalLibError(e);

  // error.cause === e
  throw error;
}
```
