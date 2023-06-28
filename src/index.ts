type StringInterpolationOptions<Raw extends boolean | undefined> = {
  pattern?: RegExp
  sanity?: boolean
  raw?: Raw
}

type StringInterpolationReturn<VariableValue extends any, OptionRaw> = Exclude<
  VariableValue,
  string | number
> extends never
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
  OptionRaw extends boolean | undefined
>(
  string: string,
  variables: Record<PropertyKey, VariableValue>,
  {
    pattern = new RegExp(/\{{([^{]+)}}/g),
    sanity = true,
    raw: rawOutput = false,
  }: StringInterpolationOptions<OptionRaw> = {}
): StringInterpolationReturn<VariableValue, OptionRaw> {
  if (!string && sanity) throw "Empty string"

  // Find all variables within string
  const stringVariables = [...string.matchAll(pattern)]

  // No variables => no need to interpolate
  if (!stringVariables[0])
    return string as StringInterpolationReturn<VariableValue, OptionRaw>

  if (sanity) {
    // Sanity check string variables <-> passed in variables count
    const variableKeys = Object.keys(variables)
    // Checks whether variables parsed from string exist in passed argument
    if (stringVariables.length !== variableKeys.length)
      throw "Variable count mismatch"
    for (const regExpMatchArray of stringVariables) {
      const variable = regExpMatchArray[1]
      if (variable && !variableKeys.includes(variable))
        throw `Variable '${variable}' not found`
    }
  }

  // Create raw interpolation result
  const rawInterpolation = string
    .split(pattern)
    // Trim empty string from array end (Could propably be done with regex as well)
    .filter(Boolean)
    // Match parsed variables with passed in variables
    .map((splitItem) => {
      return variables[splitItem] ? variables[splitItem] : splitItem
    })

  // Checks if raw interpolation can be joined or not.
  // i.e. avoid printing [object Object | Array | Function | ...] within returned string.
  const canJoin = !rawInterpolation.filter(
    (i) => typeof i !== "string" && typeof i !== "number"
  )[0]

  if (canJoin && !rawOutput)
    return rawInterpolation.join("") as StringInterpolationReturn<
      VariableValue,
      OptionRaw
    >

  return rawInterpolation as StringInterpolationReturn<VariableValue, OptionRaw>
}
