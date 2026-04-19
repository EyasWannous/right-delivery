import 'reflect-metadata';
import { OrderApplicationService } from '@/application/order/order.application-service';
import { IOrderRepository } from '@/domain/order/repositories/order.repository.interface';
import { ICaptainRepository } from '@/domain/captain/repositories/captain.repository.interface';
import { OrderDomainService } from '@/domain/order/order.domain-service';
import { Captain } from '@/domain/captain/entities/captain.entity';
import { Order } from '@/domain/order/entities/order.entity';
import { NotFoundError, BusinessRuleError } from '@/domain/shared/errors';

describe('OrderApplicationService.assignCaptain()', () => {
  let orderApplicationService: OrderApplicationService;
  let orderRepositoryMock: jest.Mocked<IOrderRepository>;
  let captainRepositoryMock: jest.Mocked<ICaptainRepository>;
  let orderDomainServiceMock: jest.Mocked<OrderDomainService>;

  beforeEach(() => {
    orderRepositoryMock = {
      findById: jest.fn(),
      findByOrderNumber: jest.fn(),
      findByExternalReference: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    captainRepositoryMock = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    orderDomainServiceMock = {
      createOrder: jest.fn(),
      updateOrder: jest.fn(),
      assignCaptain: jest.fn(),
      unassignCaptain: jest.fn(),
      updateOrderStatus: jest.fn(),
      cancelOrder: jest.fn(),
    } as any;

    orderApplicationService = new OrderApplicationService(
      orderRepositoryMock,
      orderDomainServiceMock,
      captainRepositoryMock,
    );
  });

  it('throws NotFoundError when captain does not exist', async () => {
    captainRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      orderApplicationService.assignCaptain({ orderId: 'ord1', captainId: 'cap1' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws BusinessRuleError when captain is inactive', async () => {
    const inactiveCaptain = Captain.create({
      id: 'cap1',
      name: 'N',
      phone: '+1234567890',
      vehicleType: 'car',
    });

    captainRepositoryMock.findById.mockResolvedValue(inactiveCaptain);

    await expect(
      orderApplicationService.assignCaptain({ orderId: 'ord1', captainId: 'cap1' }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('throws BusinessRuleError when captain is active but offline', async () => {
    const activeOfflineCaptain = Captain.create({
      id: 'cap1',
      name: 'N',
      phone: '+1234567890',
      vehicleType: 'car',
    });
    activeOfflineCaptain.activate();

    captainRepositoryMock.findById.mockResolvedValue(activeOfflineCaptain);

    await expect(
      orderApplicationService.assignCaptain({ orderId: 'ord1', captainId: 'cap1' }),
    ).rejects.toThrow(BusinessRuleError);
  });

  it('delegates to OrderDomainService when captain can be assigned', async () => {
    const onlineCaptain = Captain.create({
      id: 'cap1',
      name: 'N',
      phone: '+1234567890',
      vehicleType: 'car',
    });
    onlineCaptain.activate();
    onlineCaptain.goOnline();

    const fakeOrder = Order.create({
      customerName: 'C',
      customerPhone: '+1234567890',
      fullAddress: 'A',
      region: 'R',
      lat: 0,
      lng: 0,
    });

    captainRepositoryMock.findById.mockResolvedValue(onlineCaptain);
    orderDomainServiceMock.assignCaptain.mockResolvedValue(fakeOrder);

    await orderApplicationService.assignCaptain({ orderId: 'ord1', captainId: 'cap1' });

    expect(orderDomainServiceMock.assignCaptain).toHaveBeenCalledWith('ord1', 'cap1');
  });
});
