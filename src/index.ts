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
 * String.matchAll polyfill
 * Used because no support in Safari <= 12
 * @see https://caniuse.com/mdn-javascript_builtins_string_matchall
 * @see https://stackoverflow.com/questions/58003217/how-to-use-the-string-prototype-matchall-polyfill
 */
function matchAllPolyfill(string: string, pattern: RegExp) {
  let match
  const matches = []

  while ((match = pattern.exec(string))) matches.push(match)

  return matches
}

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

  // Find all variables within string
  const stringVariables = matchAllPolyfill(string, pattern)

  // No variables => no need to interpolate
  if (!stringVariables[0])
    return string as StringInterpolationReturn<VariableValue, OptionRaw>

  if (sanity) {
    // Sanity check string variables <-> passed in variables count
    const variableKeys = Object.keys(variables)
    // Checks whether variables parsed from string exist in passed argument
    if (stringVariables.length !== variableKeys.length)
      throw new Error("Variable count mismatch")
    for (const regExpMatchArray of stringVariables) {
      const variableKeyInString = regExpMatchArray[1]
      if (variableKeyInString && !variableKeys.includes(variableKeyInString))
        throw new Error(`Variable '${variableKeyInString}' not found`)
    }
  }

  // Create raw interpolation result using match positions to avoid
  // replacing plain text that happens to equal a variable name
  const rawInterpolation: (string | VariableValue)[] = []
  let lastIndex = 0

  for (const regExpMatchArray of stringVariables as RegExpExecArray[]) {
    const matchIndex = regExpMatchArray.index ?? 0
    const fullMatch = regExpMatchArray[0]
    const variableKeyInString = regExpMatchArray[1]

    // Push literal substring before the match
    if (matchIndex > lastIndex) {
      rawInterpolation.push(string.slice(lastIndex, matchIndex))
    }

    // Push the variable value for the matched key
    rawInterpolation.push(
      variables[variableKeyInString as unknown as PropertyKey],
    )

    lastIndex = matchIndex + fullMatch.length
  }

  // Push any trailing literal substring after the last match
  if (lastIndex < string.length) {
    rawInterpolation.push(string.slice(lastIndex))
  }

  // Checks if raw interpolation can be joined or not.
  // i.e. avoid printing [object Object | Array | Function | ...] within returned string.
  const canJoin = !rawInterpolation.filter(
    (i) => typeof i !== "string" && typeof i !== "number",
  )[0]

  if (canJoin && !rawOutput)
    return rawInterpolation.join("") as StringInterpolationReturn<
      VariableValue,
      OptionRaw
    >

  return rawInterpolation as StringInterpolationReturn<VariableValue, OptionRaw>
}
