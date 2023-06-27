# Typed string interpolation

[String interpolation](https://en.wikipedia.org/wiki/String_interpolation) utility that returns the correct type based on passed in variable substitutions.

## Main features

- Replaces variables within a string with passed in variables
- Sanity checks that correct variables were passed in
- Returns the correct type based on passed in variable substitutions
- Options to customize return, pattern matching and sanity checking
- Both `.cjs` and `mjs` distributions available. Use anywhere!

## Install

```bash
npm i typed-string-interpolation
```

## Usage

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
}) // => Returns type: string
```

```tsx
stringInterpolation("hello {{world}} with number {{number}}", {
  world: <span className="bold">world</span>,
  number: 1,
}) // => Returns type: (string | JSX.Element | number)[]
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
) // => Returns type: (string | number)[]
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

API suggestions are welcome and greatly appreciated.

Basic steps for contributing for a release:

- Fork `main`
- `npm ci`
- Run tests `npm run test`
- Create a changeset with `npx changeset`
- Commit and push changes
- Open a pull request
