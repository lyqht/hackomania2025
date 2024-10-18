import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "./tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);
const colors = fullConfig.theme.colors;

/** Below is a modified version of the code from the TailwindCSS docs */
type FullColorName<
  TKey extends string | number,
  TPrefix extends string | number | undefined,
> = TKey extends "DEFAULT"
  ? NonNullable<TPrefix>
  : TPrefix extends undefined
    ? TKey
    : `${TPrefix}-${TKey}`;

type ExtractColorName<
  TObject extends object,
  TParentKey extends string | number | undefined = undefined,
> = keyof {
  [TKey in keyof TObject as TKey extends string | number
    ? TObject[TKey] extends string
      ? FullColorName<TKey, TParentKey>
      : TObject[TKey] extends object
        ? ExtractColorName<TObject[TKey], FullColorName<TKey, TParentKey>>
        : never
    : never]: any;
};

export type ColorName = ExtractColorName<typeof colors>;

/**
 * This function flattens the `colors` defined according to Tailwind's nested
 * color structure and returns a map of resolved color names to their values.
 */
function resolveColors(colorObject: object, parentKey?: string): object {
  const result: { [colorName: string]: string } = {};
  for (const [key, value] of Object.entries(colorObject)) {
    const colorName = key === "DEFAULT" ? parentKey! : parentKey ? `${parentKey}-${key}` : key;
    switch (typeof value) {
      case "string":
        result[colorName] = value;
        break;
      case "object":
        // Recursively call resolveColors on value and append the resulting object
        // to result
        Object.assign(result, resolveColors(value, colorName));
        break;
      default:
        break;
    }
  }
  return result;
}

const resolvedColors = resolveColors(colors) as { [color in ColorName]: string };

export default function getColor(colorName: ColorName) {
  return resolvedColors[colorName];
}
