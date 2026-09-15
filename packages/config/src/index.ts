/**
 * Validated runtime configuration loading.
 *
 * Required environment variables throw a typed ConfigError when missing;
 * optional variables fall back to explicit defaults or `undefined` (never a
 * silently invented value).
 */

export class ConfigError extends Error {
  constructor(public readonly missingKeys: string[]) {
    super(`Missing required configuration values: ${missingKeys.join(', ')}`);
    this.name = 'ConfigError';
  }
}

export interface ConfigSpec<T extends Record<string, unknown>> {
  /** Keys that must be present and non-empty in the source environment. */
  required: (keyof T)[];
  /** Optional keys with explicit default values. */
  defaults?: Partial<T>;
}

/**
 * Loads and validates configuration from a source environment map.
 * Throws ConfigError listing every missing required key (not just the first).
 */
export function loadConfig<T extends Record<string, string | undefined>>(
  source: NodeJS.ProcessEnv,
  spec: ConfigSpec<T>,
): T {
  const missing: string[] = [];
  const result: Record<string, unknown> = { ...(spec.defaults ?? {}) };

  for (const key of spec.required) {
    const value = source[key as string];
    if (value === undefined || value === '') {
      missing.push(String(key));
      continue;
    }
    result[key as string] = value;
  }

  if (missing.length > 0) {
    throw new ConfigError(missing);
  }

  return result as T;
}
