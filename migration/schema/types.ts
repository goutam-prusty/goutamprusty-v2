/**
 * Sanity Schema Definition Helper Functions
 * Matches the native Sanity Studio v3 defineType, defineField, defineArrayMember signatures
 * without requiring @sanity/types at build/migration time.
 */

import type { SanitySchemaDefinition, SanityFieldDefinition } from '../types/sanity-schema';

export function defineType<T extends SanitySchemaDefinition>(def: T): T {
  return def;
}

export function defineField<T extends SanityFieldDefinition>(def: T): T {
  return def;
}

export function defineArrayMember<T extends Record<string, any>>(def: T): T {
  return def;
}
