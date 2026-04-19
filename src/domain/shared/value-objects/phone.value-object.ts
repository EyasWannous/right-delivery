import { ValidationError } from '@/domain/shared/errors';

export class Phone {
  private static readonly E164_REGEX = /^\+?[1-9]\d{6,14}$/;

  readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (!Phone.E164_REGEX.test(trimmed)) {
      throw new ValidationError(
        `Invalid phone number "${trimmed}". Must match E.164 format (e.g. +1234567890).`,
      );
    }
    this.value = trimmed;
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
