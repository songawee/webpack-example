# webpack-example

This "repro"-sitory attemts to re-create a size difference in bundles when attempting to utilize RxJS [lettable operators](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md).

In this example repo, we have a couple of branches to demonstrate the different cases.

The idea we are after is to be able to import operators like the following:

```js
import { map } from "rxjs/operators";
```

instead of:

```js
import { map } from "rxjs/operators/map";
```

While NOT affecting build size.

The master branch contains the "deep imports" method (`rxjs/operators/map`) which results in a smaller bundle size.

The "operators" branch refers to using `rxjs/operators` and this results in a larger bundle.

## Running example

```js
yarn install
```

```js
yarn build
```
