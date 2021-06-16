# core/functools/trait

This module provides a bunch of functions to create and implement traits.
A trait is the special kind of abstract class that is used as an interface.
Why would we need that? Well, unlike Java or Kotlin, TypeScript interfaces can't have default implementations of methods.
So we need to implement each method in our classes even if the implementation doesn't change.
This is where traits come into play. How it works? Ok, let's enumerate the steps to create a trait:

1. Create an abstract class, where define all necessary abstract methods and properties (yes, the trait can also define properties,
   not only methods).

  ```typescript
  abstract class Duckable {
    abstract name: string;
    abstract fly(): void;
  }
  ```

2. Define all non-abstract methods as simple methods without implementations: as a method body, use the loopback code,
   like `return <any>null`.

  ```typescript
  abstract class Duckable {
    abstract name: string;
    abstract fly(): void;

    getQuack(size: number): string {
      return <any>null;
    }
  }
  ```

3. Define the non-abstract methods as static class methods with the same names and signatures but add as the first parameter
   a link to the class instance, as we do it in Python or Rust. Also, we can use the `AddSelf` helper to produce less code.

  ```typescript
  abstract class Duckable {
    abstract name: string;
    abstract fly(): void;

    getQuack(size: number): string {
      return <any>null;
    }

    // The first parameter provides a method to wrap.
    // The second parameter declares which type has `self`.
    static getQuack: AddSelf<Duckable['getQuack'], Duckable> = (self, size) => {
      if (size < 10) {
        return 'quack!';
      }

      if (size < 20) {
        return 'quack!!!';
      }

      return 'QUACK!!!';
    };
  }
  ```

We have created a trait. Now we can implement it in a simple class.

1. Create a simple class and implement the trait by using the `implements` keyword.
   Don't implement methods, which you want to store their default implementations.

  ```typescript
  class DuckLike implements Duckable {
    name: string = 'Bob';

    fly(): void {
      // Do some logic to fly
    }
  }
  ```

2. Create an interface with the same name as our class and extend it from the trait using the `Trait` type.

  ```typescript
  interface DuckLike extends Trait<typeof Duckable> {}

  class DuckLike implements Duckable {
    name: string = 'Bob';

    fly(): void {
      // Do some logic to fly
    }
  }
  ```

3. Use the `derive` decorator from `core/functools/trait` with our class and provide all traits that we want to implement automatically.

  ```typescript
  import { derive } from 'core/functools/trait';

  interface DuckLike extends Trait<typeof Duckable> {}

  @derive(Duckable)
  class DuckLike implements Duckable {
    name: string = 'Bob';

    fly(): void {
      // Do some logic to fly
    }
  }
  ```

4. Profit! Now TS understands default methods of interfaces, and it works in runtime.

  ```typescript
  import { derive } from 'core/functools/trait';

  interface DuckLike extends Trait<typeof Duckable> {}

  @derive(Duckable)
  class DuckLike implements Duckable {
    name: string = 'Bob';

    fly(): void {
      // Do some logic to fly
    }
  }

  /// 'QUACK!!!'
  console.log(new DuckLike().getQuack(60));
  ```

5. Of course, we can implement more than one trait in a component.

  ```typescript
  import { derive } from 'core/functools/trait';

  interface DuckLike extends Trait<typeof Duckable>, Trait<typeof AnotherTrait> {}

  @derive(Duckable, AnotherTrait)
  class DuckLike implements Duckable, AnotherTrait, SimpleInterfaceWithoutDefaultMethods {
    name: string = 'Bob';

    fly(): void {
      // Do some logic to fly
    }
  }
  ```

Besides regular methods, you can also define get/set accessors like this:

```typescript
abstract class Duckable {
  get canFly(): boolean {
    return <any>null;
  }

  set canFly(value: boolean) {};

  static canFly(self: Duckable): string {
    if (arguments.length > 1) {
      const value = arguments[1];
      // Setter code

    } else {
      return /* Getter code */;
    }
  }
}
```
