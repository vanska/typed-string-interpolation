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
    pattern = new RegExp(/\{{([^{]+)}}/g),
    sanity = true,
    raw: rawOutput = false,
  }: StringInterpolationOptions<OptionRaw> = {},
): StringInterpolationReturn<VariableValue, OptionRaw> {
  if (!string && sanity) throw new Error("Empty string")

  const rawInterpolation: (string | VariableValue)[] = []
  let lastIndex = 0
  let matchCount = 0
  let canJoin = true
  const variableKeys = sanity ? Object.keys(variables) : undefined

  let m: RegExpExecArray | null
  while ((m = pattern.exec(string))) {
    const idx = m.index || 0
    const full = m[0]
    const key = m[1]

    if (idx > lastIndex) rawInterpolation.push(string.slice(lastIndex, idx))

    if (sanity && key && !variableKeys!.includes(key))
      throw new Error(`Variable '${key}' not found`)

    const value = variables[key as unknown as PropertyKey]
    if (canJoin && typeof value !== "string" && typeof value !== "number")
      canJoin = false
    rawInterpolation.push(value)

    lastIndex = idx + full.length
    matchCount++
  }

  if (!matchCount)
    return string as StringInterpolationReturn<VariableValue, OptionRaw>

  if (lastIndex < string.length) rawInterpolation.push(string.slice(lastIndex))

  if (sanity && matchCount !== variableKeys!.length)
    throw new Error("Variable count mismatch")

  if (canJoin && !rawOutput)
    return rawInterpolation.join("") as StringInterpolationReturn<
      VariableValue,
      OptionRaw
    >

  return rawInterpolation as StringInterpolationReturn<VariableValue, OptionRaw>
}
