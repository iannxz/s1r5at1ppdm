import { Response } from "express";

export function parsePositiveInteger(value: unknown): number | null {
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return null;
  }
  return numberValue;
}

export function parsePositiveNumber(value: unknown): number | null {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return null;
  }
  return numberValue;
}

export function parseNonNegativeNumber(value: unknown): number | null {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return null;
  }
  return numberValue;
}

const NOME_REGEX = /^[a-zA-ZÀ-ú0-9\s\-.,()]+$/;

export function requiredName(value: unknown, minLength = 3): string | null {
  const text = requiredString(value, minLength);
  if (!text) return null;
  return NOME_REGEX.test(text) ? text : null;
}

export function requiredString(value: unknown, minLength = 1): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();
  return text.length >= minLength ? text : null;
}

export function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseBoolean(value: unknown, defaultValue = true): boolean | null {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "sim", "yes", "on"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "nao", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  return null;
}

export function badRequest(res: Response, error: string) {
  return res.status(400).json({ error });
}

export function notFound(res: Response, message: string) {
  return res.status(404).json({ message });
}

export function serverError(res: Response, error: string, cause: unknown) {
  console.error(`${error}:`, cause);
  return res.status(500).json({
    error,
    errorMessage: cause instanceof Error ? cause.message : "Erro desconhecido",
  });
}
