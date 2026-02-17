/**
 * Flattens nested color palette to keys like "red-500", "slate-100".
 */
export function flattenColorPalette(colors: Record<string, string | Record<string, string>>): Record<string, string> {
  return Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values === 'object' && values !== null && !Array.isArray(values)
        ? Object.entries(flattenColorPalette(values as Record<string, string | Record<string, string>>)).map(
            ([number, hex]) => ({ [color + (number === 'DEFAULT' ? '' : `-${number}`)]: hex })
          )
        : [{ [color]: values as string }]
    )
  );
}
