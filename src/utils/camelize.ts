function camelizeKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

export function camelizeKeys<T>(data: unknown): T {
  if (Array.isArray(data)) {
    return data.map((item) => camelizeKeys(item)) as T;
  }

  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [
        camelizeKey(key),
        camelizeKeys(value),
      ])
    ) as T;
  }

  return data as T;
}
