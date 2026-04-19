import { Captain } from '@/domain/captain/entities/captain.entity';
import { CaptainStatus, CaptainAvailability } from '@/domain/captain/entities/captain.enums';
import { ValidationError, BusinessRuleError } from '@/domain/shared/errors';

describe('Captain entity', () => {
  describe('create()', () => {
    it('creates a captain with default status Inactive and availability Offline', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      expect(captain.status).toBe(CaptainStatus.Inactive);
      expect(captain.availability).toBe(CaptainAvailability.Offline);
    });

    it('throws ValidationError when phone format is invalid', () => {
      expect(() => {
        Captain.create({
          id: '1',
          name: 'John Doe',
          phone: 'invalid-phone',
          vehicleType: 'car',
        });
      }).toThrowError(ValidationError);
    });
  });

  describe('activate() / deactivate()', () => {
    it('activates an inactive captain', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.activate();
      expect(captain.status).toBe(CaptainStatus.Active);
    });

    it('deactivates an active captain', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.activate();
      captain.deactivate();
      expect(captain.status).toBe(CaptainStatus.Inactive);
    });
  });

  describe('goOnline() / goOffline()', () => {
    it('sets availability to online', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.goOnline();
      expect(captain.availability).toBe(CaptainAvailability.Online);
    });

    it('sets availability to offline', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.goOnline();
      captain.goOffline();
      expect(captain.availability).toBe(CaptainAvailability.Offline);
    });
  });

  describe('canBeAssigned()', () => {
    it('returns true when captain is active and online', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.activate();
      captain.goOnline();
      expect(captain.canBeAssigned()).toBe(true);
    });

    it('returns false when captain is active but offline', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.activate();
      expect(captain.canBeAssigned()).toBe(false);
    });

    it('returns false when captain is inactive and online', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.goOnline();
      expect(captain.canBeAssigned()).toBe(false);
    });

    it('returns false when captain is inactive and offline', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      expect(captain.canBeAssigned()).toBe(false);
    });
  });

  describe('updateLocation()', () => {
    it('updates location when captain is active', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.activate();
      captain.updateLocation(40, -74);
      expect(captain.currentLocation?.lat).toBe(40);
      expect(captain.currentLocation?.lng).toBe(-74);
    });

    it('throws BusinessRuleError when captain is inactive', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      expect(() => {
        captain.updateLocation(40, -74);
      }).toThrowError(BusinessRuleError);
    });

    it('throws ValidationError when lat is out of range', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.activate();
      expect(() => {
        captain.updateLocation(91, -74);
      }).toThrowError(ValidationError);
    });

    it('throws ValidationError when lng is out of range', () => {
      const captain = Captain.create({
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        vehicleType: 'car',
      });
      captain.activate();
      expect(() => {
        captain.updateLocation(40, -181);
      }).toThrowError(ValidationError);
    });
  });
});
