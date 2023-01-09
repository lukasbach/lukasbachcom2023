export const isNotNullish = <T>(value: T | null | undefined | false): value is T => !!value;
