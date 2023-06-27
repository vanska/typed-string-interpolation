import { stringInterpolation } from "../index"

describe("interpolation()", () => {
  // Throws
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
      })
    ).toThrow("Variable 'world' not found")
  })
  // Succesful outputs
  test("Interpolate single variable", () => {
    expect(
      stringInterpolation("Hello {{world}}", {
        world: "world with variable",
      })
    ).toBe("Hello world with variable")
  })
  test("Interpolate single variable and return raw result with passed in option", () => {
    expect(
      stringInterpolation(
        "Hello {{world}}",
        {
          world: "world with variable",
        },
        { raw: true }
      )
    ).toStrictEqual(["Hello ", "world with variable"])
  })
  test("Interpolate two variables", () => {
    expect(
      stringInterpolation("Hello {{world}} and {{anotherVariable}}", {
        world: "world with variable",
        anotherVariable: "another variable",
      })
    ).toBe("Hello world with variable and another variable")
  })
  test("Interpolation variable contains a function", () => {
    expect(
      stringInterpolation("Hello {{world}} and {{anotherVariable}}", {
        world: "world with variable",
        anotherVariable: () => "another variable",
      })
    ).toStrictEqual([
      "Hello ",
      "world with variable",
      " and ",
      expect.any(Function),
    ])
  })
})
