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
 */
export function stringInterpolation<
  VariableValue extends any,
  OptionRaw extends boolean | undefined
>(
  s: string,
  v: Record<PropertyKey, VariableValue>,
  {
    pattern: p = new RegExp(/\{{([^{]+)}}/g),
    sanity: S = true,
    raw: r = false,
  }: StringInterpolationOptions<OptionRaw> = {}
): StringInterpolationReturn<VariableValue, OptionRaw> {
  if (!s && S) throw "Empty string"

  // Find all variables within string
  const sV = [...s.matchAll(p)]

  // No variables => no need to interpolate
  if (!sV[0]) return s as StringInterpolationReturn<VariableValue, OptionRaw>

  if (S) {
    // Sanity check string variables <-> passed in variables count
    const k = Object.keys(v)
    // Checks whether variables parsed from string exist in passed argument
    if (sV.length !== k.length) throw "Variable count mismatch"
    for (const _v of sV) {
      const vIs = _v[1] // Variable in string
      if (vIs && !k.includes(vIs)) throw `Variable '${vIs}' not found`
    }
  }

  const raw = s
    .split(p)
    // Trim empty string from array end (Could propably be done with regex as well)
    .filter(Boolean)
    .map((_v) => {
      return v[_v] ? v[_v] : _v
    })

  // Checks if raw interpolation can be joined or not.
  // i.e. avoid printing [object Object | Array | Function | ...] within returned string.
  const j = !raw.filter(
    (i) => typeof i !== "string" && typeof i !== "number"
  )[0]

  if (j && !r)
    return raw.join("") as StringInterpolationReturn<VariableValue, OptionRaw>

  return raw as StringInterpolationReturn<VariableValue, OptionRaw>
}
