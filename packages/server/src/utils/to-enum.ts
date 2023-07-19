export const toEnum = <EnumValue extends string>(
  enumObject: Record<string, EnumValue>,
  value: string
): EnumValue => {
  const values: string[] = Object.values(enumObject);

  if (!values.includes(value)) {
    throw new Error(
      `invalid enum value "${value}", expected one of ${values.map((value) => `"${value}"`).join(', ')}`
    );
  }

  return value as EnumValue;
};
