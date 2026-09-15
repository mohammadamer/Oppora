/**
 * Cross-cutting primitives shared across Oppora packages.
 */

/** A value that is either present (`value`) or explicitly unknown/absent. */
export type UnknownOr<T> = { known: true; value: T } | { known: false };

export function known<T>(value: T): UnknownOr<T> {
  return { known: true, value };
}

export const UNKNOWN: UnknownOr<never> = { known: false };

/** Discriminated success/failure outcome, avoiding thrown exceptions for expected failures. */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/** Standard creation/update timestamp fields required on every persisted entity. */
export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

export * from './operational-records';
