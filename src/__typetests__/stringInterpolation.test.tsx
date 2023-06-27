import { expectType } from "tsd-lite"
import { stringInterpolation } from "../index"

// ~~~~~~~~~~~~~~ TYPESCRIPT TYPE TESTING ~~~~~~~~~~~~~~

expectType<string>(
  stringInterpolation("hello {{one}}", {
    one: "one",
  })
)

expectType<string>(
  stringInterpolation("hello {{one}}", {
    one: "one",
  })
)

expectType<string[]>(
  stringInterpolation(
    "hello {{one}}",
    {
      one: "one",
    },
    { raw: true }
  )
)

expectType<string>(
  stringInterpolation("hello {{one}} {{two}}", {
    one: "one",
    two: 2,
  })
)

expectType<string>(
  stringInterpolation("hello {{one}}", {
    one: 2,
  })
)

expectType<
  (
    | string
    | number
    | {
        type: string
        props: {
          className: string
          children: string
        }
      }
  )[]
>(
  stringInterpolation("hello {{one}} {{two}} {{three}}", {
    one: "one",
    two: 2,
    three: {
      type: "span",
      props: {
        className: "bold",
        children: "one",
      },
    },
  })
)
