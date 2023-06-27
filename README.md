# [`typed-string-interpolation`](https://www.npmjs.com/package/typed-string-interpolation)

[String interpolation](https://en.wikipedia.org/wiki/String_interpolation) utility that returns the correct type based on passed in variable substitutions.

## Main features

- Replaces variables within a string with passed in variables
- Sanity checks that correct variables were passed in
- Returns the correct type based on passed in variable substitutions
- Options to customize return, pattern matching and sanity checking
- Both ES Module `.mjs` and CommonJS `.cjs` distributions available. Use anywhere!
- Tiny footprint:
  - ES Module: `0.462kB` (`773B` unpacked)
  - CommonJS: `0.833B` (`1.75kB` unpacked)

## Motivation

String interpolation/variable substitution (i.e. injecting variables within text) is a really common operation when building single and multilingual applications. Existing string interpolation utilities within the most used `i18n` / `l10n` packages like `i18next` and `formatjs` come with massive overhead while lacking thing like proper TypeScript infer support for the interpolation operation.

This package aims to provide a high quality string interpolation "primitive" to use as is or within other localization frameworks and tooling.

## Getting started

### Install

```bash
npm i typed-string-interpolation
```

### Usage

```ts
// ES module
import { stringInterpolation } from "typed-string-interpolation"
// CommonJS
const { stringInterpolation } = require("typed-string-interpolation")
```

```ts
stringInterpolation("hello {{world}}", {
  world: "world",
}) // "hello world"
```

Pass in anything you want an get back sane results when interpolation result shouldn't be turned into a `string`:

```tsx
stringInterpolation("hello {{world}} with {{anything}}", {
  world: "world",
  anything: <span className="bold">anything</span>,
})
```

Returns an array for easy use with libraries like `react` or anything else!

```tsx
const interpolationResult = [
  "hello ",
  "world",
  " with ",
  <span className="bold">anything</span>,
]
```

## TypeScript support

If the string can be joined you'll get back a string. Otherwise a union type within an array is returned based on the passed in variables.

```ts
stringInterpolation("hello {{world}} with number {{number}}", {
  world: "world",
  number: 1,
}) // : string
```

```tsx
stringInterpolation("hello {{world}} with number {{number}}", {
  world: <span className="bold">world</span>,
  number: 1,
}) // : (string | JSX.Element | number)[]
```

## Options

Takes in an optional third parameter for options:

```js
stringInterpolation(str, variables, options)
```

```ts
type Options = {
  raw?: boolean // default: false
  pattern?: RegExp // default: new RegExp(/\{{([^{]+)}}/g)
  sanity?: boolean // default: true
}
```

`raw`

Return the raw interpolation results without joining to string when you want full control for some reason.

```tsx
stringInterpolation(
  "hello {{world}} with number {{number}}",
  {
    world: "world",
    number: 1,
  },
  { raw: true }
) // : (string | number)[]
```

`pattern`

Provide your own `RegExp` pattern for variable matching. Must be defined as:

```ts
pattern: new RegExp(/\{{([^{]+)}}/g)
```

`sanity`

If you want to live dangerously, sanity checking can be turned off.

```ts
{
  sanity: false
}
```

Turning of sanity checking removes `throw` from:

- empty string
- string variables and passed in variables count mismatch
- missing variables

## Contributing

Easiest way to contribute is to open new issues for API suggestions and fixes.

### Contributing for a release

Basic steps for contributing for a release:

- Fork `main` on Github and clone fork locally
- `npm ci` to install dependencies
- Make changes while running tests
  - Unit test in watch mode:
    - `npm run test:unit:watch`
  - Unit test for types in watch mode:
    - `npm run test:unit:types:watch`
- Once all changes are complete create a new release with changeset. This creates a PR that once merged will get released.
  - `npm run changeset`
- Commit and push changes
- Open a pull request for the fork
