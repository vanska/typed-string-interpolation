import { expectType } from "tsd-lite"
import { stringInterpolation } from "../index"

// ~~~~~~~~~~~~~~ TYPESCRIPT TYPE TESTING ~~~~~~~~~~~~~~

describe("stringInterpolation types", () => {
  test("returns string for single variable string", () => {
    expectType<string>(
      stringInterpolation("hello {{one}}", {
        one: "one",
      }),
    )

    expectType<string>(
      stringInterpolation("hello {{one}}", {
        one: "one",
      }),
    )
  })

  test("returns string[] when raw is true with string values", () => {
    expectType<string[]>(
      stringInterpolation(
        "hello {{one}}",
        {
          one: "one",
        },
        { raw: true },
      ),
    )
  })

  test("returns string when mixed string and number are joinable", () => {
    expectType<string>(
      stringInterpolation("hello {{one}} {{two}}", {
        one: "one",
        two: 2,
      }),
    )
  })

  test("returns string when variable is a number", () => {
    expectType<string>(
      stringInterpolation("hello {{one}}", {
        one: 2,
      }),
    )
  })

  test("returns array union when non-primitive element is included", () => {
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
      }),
    )
  })

  test("returns array including Date when Date is included", () => {
    expectType<(string | number | Date)[]>(
      stringInterpolation("hello {{one}} {{two}} {{three}}", {
        one: "one",
        two: 2,
        three: new Date(),
      }),
    )
  })

  test("raw true with only string/number returns (string | number)[]", () => {
    expectType<(string | number)[]>(
      stringInterpolation("num {{n}}", { n: 123 }, { raw: true }),
    )

    expectType<(string | number)[]>(
      stringInterpolation("a {{a}} b {{b}}", { a: "A", b: 2 }, { raw: true }),
    )
  })

  test("raw false with non-(string|number) still returns array", () => {
    expectType<(string | Date)[]>(
      stringInterpolation("date {{d}}", { d: new Date() }, { raw: false }),
    )
  })

  test("including a function forces array regardless of raw option", () => {
    const fnReturnsString: () => string = () => "ok"
    expectType<(string | (() => string))[]>(
      stringInterpolation("fn {{f}}", { f: fnReturnsString }),
    )
  })

  test("raw true + string values returns string[]", () => {
    expectType<string[]>(
      stringInterpolation("hello {{one}}", { one: "one" }, { raw: true }),
    )
  })

  test("raw true with object value returns array including object type", () => {
    expectType<
      (
        | string
        | {
            id: number
          }
      )[]
    >(stringInterpolation("obj {{o}}", { o: { id: 1 } }, { raw: true }))
  })
})
