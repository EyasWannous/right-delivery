import 'reflect-metadata';
import { container } from 'tsyringe';

import { ICaptainApplicationService } from '@/application/captain/captain.application-service.interface';
import { IOrderApplicationService } from '@/application/order/order.application-service.interface';
import { IReportApplicationService } from '@/application/report/report.application-service.interface';

import { CaptainApplicationService } from '@/application/captain/captain.application-service';
import { OrderApplicationService } from '@/application/order/order.application-service';
import { ReportApplicationService } from '@/application/report/report.application-service';

import { ICaptainRepository } from '@/domain/captain/repositories/captain.repository.interface';
import { IOrderRepository } from '@/domain/order/repositories/order.repository.interface';
import { IReportRepository } from '@/domain/report/repositories/report.repository.interface';

import { MongoCaptainRepository } from '@/infrastructure/repositories/mongo-captain.repository';
import { MongoOrderRepository } from '@/infrastructure/repositories/mongo-order.repository';
import { MongoReportRepository } from '@/infrastructure/repositories/mongo-report.repository';

import { CaptainController } from '@/interfaces/http/controllers/captain.controller';
import { OrderController } from '@/interfaces/http/controllers/order.controller';
import { ReportController } from '@/interfaces/http/controllers/report.controller';
import { PartnerController } from '@/interfaces/http/controllers/partner.controller';

container.register(ICaptainRepository, { useClass: MongoCaptainRepository });
container.register(IOrderRepository, { useClass: MongoOrderRepository });
container.register(IReportRepository, { useClass: MongoReportRepository });

container.register(ICaptainApplicationService, { useClass: CaptainApplicationService });
container.register(IOrderApplicationService, { useClass: OrderApplicationService });
container.register(IReportApplicationService, { useClass: ReportApplicationService });

container.registerSingleton(CaptainController);
container.registerSingleton(OrderController);
container.registerSingleton(ReportController);
container.registerSingleton(PartnerController);

export { container };
