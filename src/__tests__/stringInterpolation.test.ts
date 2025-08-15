import { stringInterpolation } from "../index"

describe("stringInterpolation()", () => {
  test("Empty", () => {
    expect(() => {
      stringInterpolation("", {
        world: "world",
      })
    }).toThrow("Empty string")
  })
  test("Incorrect variable count", () => {
    expect(() => {
      stringInterpolation("Hello {{world}}", {
        world: "world with varialbe",
        extraVariable: "this is unnecessary",
      })
    }).toThrow("Variable count mismatch")
  })
  test("Variable not found", () => {
    expect(() =>
      stringInterpolation("Hello {{world}}", {
        wrongVariable: "world",
      }),
    ).toThrow("Variable 'world' not found")
  })
  test("Interpolate single variable", () => {
    expect(
      stringInterpolation("Hello {{world}}", {
        world: "world with variable",
      }),
    ).toBe("Hello world with variable")
  })
  test("Interpolate single variable and return raw result with passed in option", () => {
    expect(
      stringInterpolation(
        "Hello {{world}}",
        {
          world: "world with variable",
        },
        { raw: true },
      ),
    ).toStrictEqual(["Hello ", "world with variable"])
  })
  test("Interpolate two variables", () => {
    expect(
      stringInterpolation("Hello {{world}} and {{anotherVariable}}", {
        world: "world with variable",
        anotherVariable: "another variable",
      }),
    ).toBe("Hello world with variable and another variable")
  })
  test("Interpolation variable contains a function", () => {
    expect(
      stringInterpolation("Hello {{world}} and {{anotherVariable}}", {
        world: "world with variable",
        anotherVariable: () => "another variable",
      }),
    ).toStrictEqual([
      "Hello ",
      "world with variable",
      " and ",
      expect.any(Function),
    ])
  })
  test("Interpolation string contains a variable name which should remain the same", () => {
    expect(stringInterpolation("foo{{foo}}", { foo: "bar" })).toStrictEqual(
      "foobar",
    )
  })

  test("Interpolate falsy values (0 and empty string)", () => {
    expect(
      stringInterpolation("Zero: {{v0}}, Empty: '{{v1}}'", { v0: 0, v1: "" }),
    ).toBe("Zero: 0, Empty: ''")
  })

  test("Return raw with number when raw option is true", () => {
    expect(
      stringInterpolation("Num {{n}}!", { n: 42 }, { raw: true }),
    ).toStrictEqual(["Num ", 42, "!"])
  })

  test("Custom pattern option works", () => {
    expect(
      stringInterpolation(
        "Hi %{name}",
        { name: "John" },
        {
          pattern: /%\{([^}]+)\}/g,
        },
      ),
    ).toBe("Hi John")
  })

  test("Sanity disabled allows extra variables without throwing", () => {
    expect(
      stringInterpolation(
        "Hello {{world}}",
        { world: "earth", extra: "x" },
        { sanity: false },
      ),
    ).toBe("Hello earth")
  })

  test("Duplicate variables with sanity enabled triggers count mismatch", () => {
    expect(() =>
      stringInterpolation("{{name}} {{name}}", { name: "A" }),
    ).toThrow("Variable count mismatch")
  })

  test("No variables returns input unchanged", () => {
    expect(stringInterpolation("Just text", {} as any)).toBe("Just text")
  })

  test("Numeric variable key is supported", () => {
    expect(stringInterpolation("Value {{0}}", { 0: "zero" } as any)).toBe(
      "Value zero",
    )
  })

  test("Empty input with sanity disabled returns empty string", () => {
    expect(stringInterpolation("", { a: 1 } as any, { sanity: false })).toBe("")
  })

  test("Raw output with multiple variables returns segments array", () => {
    expect(
      stringInterpolation("A{{x}}B{{y}}C", { x: "X", y: "Y" }, { raw: true }),
    ).toStrictEqual(["A", "X", "B", "Y", "C"])
  })

  test("Missing variable with sanity disabled yields raw array with undefined", () => {
    expect(
      stringInterpolation("Hello {{world}}", {} as any, { sanity: false }),
    ).toStrictEqual(["Hello ", undefined])
  })
})
