const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const KEY_PATTERN = /^[a-z0-9][a-z0-9-_]*$/;

export function requireText(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

export function optionalText(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function requireSlug(formData: FormData, key: string): string {
  const value = requireText(formData, key);
  if (!SLUG_PATTERN.test(value)) {
    throw new Error(`${key} must use lowercase letters, numbers, and hyphens.`);
  }

  return value;
}

export function requireKey(formData: FormData, key: string): string {
  const value = requireText(formData, key);
  if (!KEY_PATTERN.test(value)) {
    throw new Error(
      `${key} must use lowercase letters, numbers, hyphens, or underscores.`
    );
  }

  return value;
}

export function parseNumber(
  formData: FormData,
  key: string,
  fallback = 0
): number {
  const rawValue = optionalText(formData, key);
  if (!rawValue) {
    return fallback;
  }

  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    throw new Error(`${key} must be a valid number.`);
  }

  return value;
}

export function parseNullableNumber(
  formData: FormData,
  key: string
): number | null {
  const rawValue = optionalText(formData, key);
  if (!rawValue) {
    return null;
  }

  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    throw new Error(`${key} must be a valid number.`);
  }

  return value;
}

export function parseBoolean(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

export function parseJsonObject(
  formData: FormData,
  key: string
): Record<string, unknown> {
  const rawValue = optionalText(formData, key);
  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (
      parsed === null ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      throw new Error();
    }

    return parsed as Record<string, unknown>;
  } catch {
    throw new Error(`${key} must contain valid JSON object text.`);
  }
}
