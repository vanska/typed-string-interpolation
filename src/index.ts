type StringInterpolationOptions<Raw extends boolean | undefined> = {
  pattern?: RegExp
  sanity?: boolean
  raw?: Raw
}

type StringInterpolationReturn<VariableValue extends any, OptionRaw> =
  Exclude<VariableValue, string | number> extends never
    ? Extract<OptionRaw, boolean> extends true
      ? (string | VariableValue)[]
      : string
    : (string | VariableValue)[]

/**
 * Takes in a string containing variables and an object containing variables for interpolation. Accepts options.
 * 
 * @example
 * 
 * stringInterpolation("You have {{n}} messages", {
      n: 3,
  })

  stringInterpolation("You have {{n}} messages from {{person}}", {
      n: <strong>3</strong>,
      person: "John",
  })
 */
export function stringInterpolation<
  VariableValue extends any,
  OptionRaw extends boolean | undefined,
>(
  string: string,
  variables: Record<PropertyKey, VariableValue>,
  {
    pattern = /\{{([^{]+)}}/g,
    sanity = true,
    raw = false,
  }: StringInterpolationOptions<OptionRaw> = {},
): StringInterpolationReturn<VariableValue, OptionRaw> {
  if (!string && sanity) throw new Error("Empty string")

  const variableKeys = sanity ? Object.keys(variables) : undefined
  const segments: (string | VariableValue)[] = []
  let lastIndex = 0
  let foundCount = 0
  let joinable = true

  let m: RegExpExecArray | null
  while ((m = pattern.exec(string))) {
    const idx = m.index
    const full = m[0]
    const key = m[1]

    if (idx > lastIndex) segments.push(string.slice(lastIndex, idx))

    if (sanity && key && !variableKeys!.includes(key))
      throw new Error(`Variable '${key}' not found`)

    const value = variables[key as unknown as PropertyKey]
    joinable =
      joinable && (typeof value === "string" || typeof value === "number")
    segments.push(value)

    lastIndex = idx + full.length
    foundCount++
  }

  if (!foundCount)
    return string as StringInterpolationReturn<VariableValue, OptionRaw>

  if (lastIndex < string.length) segments.push(string.slice(lastIndex))

  if (sanity && foundCount !== variableKeys!.length)
    throw new Error("Variable count mismatch")

  if (joinable && !raw)
    return segments.join("") as StringInterpolationReturn<
      VariableValue,
      OptionRaw
    >

  return segments as StringInterpolationReturn<VariableValue, OptionRaw>
}
