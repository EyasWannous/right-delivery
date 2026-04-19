import { Phone } from '@/domain/shared/value-objects/phone.value-object';
import { CurrentLocation } from '@/domain/captain/value-objects/current-location.value-object';
import { Location } from '@/domain/order/value-objects/location.value-object';
import { ValidationError } from '@/domain/shared/errors';

describe('Phone value object', () => {
  it('accepts a valid E.164 phone number', () => {
    const phone = new Phone('+1234567890');
    expect(phone.value).toBe('+1234567890');
  });

  it('throws ValidationError for an empty string', () => {
    expect(() => new Phone('')).toThrowError(ValidationError);
  });

  it('throws ValidationError for letters', () => {
    expect(() => new Phone('+123ABC890')).toThrowError(ValidationError);
  });

  it('returns true for equals() with same value', () => {
    const phone1 = new Phone('+1234567890');
    const phone2 = new Phone('+1234567890');
    expect(phone1.equals(phone2)).toBe(true);
  });

  it('returns false for equals() with different value', () => {
    const phone1 = new Phone('+1234567890');
    const phone2 = new Phone('+1987654321');
    expect(phone1.equals(phone2)).toBe(false);
  });
});

describe('CurrentLocation value object', () => {
  it('creates with valid lat/lng', () => {
    const loc = new CurrentLocation(40, -74);
    expect(loc.lat).toBe(40);
    expect(loc.lng).toBe(-74);
  });

  it('throws ValidationError when lat > 90', () => {
    expect(() => new CurrentLocation(91, -74)).toThrowError(ValidationError);
  });

  it('throws ValidationError when lat < -90', () => {
    expect(() => new CurrentLocation(-91, -74)).toThrowError(ValidationError);
  });

  it('throws ValidationError when lng > 180', () => {
    expect(() => new CurrentLocation(40, 181)).toThrowError(ValidationError);
  });

  it('throws ValidationError when lng < -180', () => {
    expect(() => new CurrentLocation(40, -181)).toThrowError(ValidationError);
  });
});

describe('Location value object (Order)', () => {
  it('creates with valid lat/lng', () => {
    const loc = new Location(40, -74);
    expect(loc.lat).toBe(40);
    expect(loc.lng).toBe(-74);
  });

  it('throws ValidationError for out of range values', () => {
    expect(() => new Location(91, -74)).toThrowError(ValidationError);
    expect(() => new Location(40, -181)).toThrowError(ValidationError);
  });
});
