import { Order } from '@/domain/order/entities/order.entity';
import { OrderStatus } from '@/domain/order/entities/order.enums';
import { ValidationError, BusinessRuleError } from '@/domain/shared/errors';

describe('Order entity', () => {
  describe('create()', () => {
    it('creates an order with status Created and no captainId', () => {
      const order = Order.create({
        customerName: 'Alice',
        customerPhone: '+1234567890',
        fullAddress: '123 Test St',
        region: 'North',
        lat: 40,
        lng: -74,
      });
      expect(order.status).toBe(OrderStatus.Created);
      expect(order.captainId).toBeNull();
      expect(order.orderNumber.startsWith('ORD-')).toBe(true);
    });

    it('throws ValidationError when customerPhone is invalid', () => {
      expect(() => {
        Order.create({
          customerName: 'Alice',
          customerPhone: 'invalid-phone',
          fullAddress: '123 Test St',
          region: 'North',
          lat: 40,
          lng: -74,
        });
      }).toThrowError(ValidationError);
    });

    it('throws ValidationError when lat is out of range', () => {
      expect(() => {
        Order.create({
          customerName: 'Alice',
          customerPhone: '+1234567890',
          fullAddress: '123 Test St',
          region: 'North',
          lat: 91,
          lng: -74,
        });
      }).toThrowError(ValidationError);
    });
  });

  describe('assign()', () => {
    it('assigns a captain and sets status to Assigned', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      expect(order.status).toBe(OrderStatus.Assigned);
      expect(order.captainId).toBe('captain1');
    });

    it('throws BusinessRuleError when order is already assigned', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      expect(() => order.assign('captain2')).toThrowError(BusinessRuleError);
    });

    it('throws BusinessRuleError when order is Delivered', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      order.markPickedUp();
      order.markDelivered();
      expect(() => order.assign('captain2')).toThrowError(BusinessRuleError);
    });

    it('throws BusinessRuleError when order is Cancelled', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.cancel();
      expect(() => order.assign('captain1')).toThrowError(BusinessRuleError);
    });
  });

  describe('unassign()', () => {
    it('unassigns a captain and reverts status to Created', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      order.unassign();
      expect(order.status).toBe(OrderStatus.Created);
      expect(order.captainId).toBeNull();
    });

    it('throws BusinessRuleError when no captain is assigned', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      expect(() => order.unassign()).toThrowError(BusinessRuleError);
    });

    it('throws BusinessRuleError when order is Delivered', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      order.markPickedUp();
      order.markDelivered();
      expect(() => order.unassign()).toThrowError(BusinessRuleError);
    });
  });

  describe('markPickedUp()', () => {
    it('marks order as PickedUp when status is Assigned', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      order.markPickedUp();
      expect(order.status).toBe(OrderStatus.PickedUp);
    });

    it('throws BusinessRuleError when status is not Assigned', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      expect(() => order.markPickedUp()).toThrowError(BusinessRuleError);
    });
  });

  describe('markDelivered()', () => {
    it('marks order as Delivered when status is PickedUp', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      order.markPickedUp();
      order.markDelivered();
      expect(order.status).toBe(OrderStatus.Delivered);
    });

    it('throws BusinessRuleError when status is not PickedUp', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      expect(() => order.markDelivered()).toThrowError(BusinessRuleError);
    });
  });

  describe('cancel()', () => {
    it('cancels an order that is Created', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.cancel();
      expect(order.status).toBe(OrderStatus.Cancelled);
    });

    it('cancels an order that is Assigned', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      order.cancel();
      expect(order.status).toBe(OrderStatus.Cancelled);
    });

    it('throws BusinessRuleError when order is already Delivered', () => {
      const order = Order.create({
        customerName: 'A',
        customerPhone: '+1234567890',
        fullAddress: 'Addr',
        region: 'R',
        lat: 0,
        lng: 0,
      });
      order.assign('captain1');
      order.markPickedUp();
      order.markDelivered();
      expect(() => order.cancel()).toThrowError(BusinessRuleError);
    });
  });
});
