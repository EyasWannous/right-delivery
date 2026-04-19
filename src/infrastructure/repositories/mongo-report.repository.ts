import { injectable } from 'tsyringe';
import mongoose from 'mongoose';
import {
  IReportRepository,
  OrderVolumeDropFilters,
  OrderVolumeDropResult,
} from '../../domain/report/repositories/report.repository.interface';
import { OrderModel } from '@/infrastructure/database/mongoose/models/order.model';

@injectable()
export class MongoReportRepository implements IReportRepository {
  async getCaptainOrderVolumeDrop(
    filters: OrderVolumeDropFilters,
  ): Promise<{ results: OrderVolumeDropResult[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    const sortField = filters.sortBy ?? 'dropPercentage';
    const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

    const earliestDate = new Date(
      Math.min(filters.previousFrom.getTime(), filters.currentFrom.getTime()),
    );
    const latestDate = new Date(
      Math.max(filters.previousTo.getTime(), filters.currentTo.getTime()),
    );

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: {
          captainId: { $ne: null },
          createdAt: {
            $gte: earliestDate,
            $lte: latestDate,
          },
        },
      },

      {
        $group: {
          _id: '$captainId',
          previousOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$createdAt', filters.previousFrom] },
                    { $lte: ['$createdAt', filters.previousTo] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          currentOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$createdAt', filters.currentFrom] },
                    { $lte: ['$createdAt', filters.currentTo] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $addFields: {
          dropCount: { $subtract: ['$previousOrders', '$currentOrders'] },
          dropPercentage: {
            $cond: [
              { $eq: ['$previousOrders', 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ['$previousOrders', '$currentOrders'] },
                          '$previousOrders',
                        ],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },

      {
        $match: {
          previousOrders: { $gte: filters.minPreviousOrders ?? 1 },
          dropPercentage: { $gte: filters.minDropPercentage ?? 0 },
          dropCount: { $gt: 0 },
        },
      },

      {
        $lookup: {
          from: 'captains',
          localField: '_id',
          foreignField: '_id',
          as: 'captain',
        },
      },

      {
        $unwind: { path: '$captain', preserveNullAndEmptyArrays: false },
      },

      {
        $project: {
          _id: 0,
          captainId: '$_id',
          captainName: '$captain.name',
          previousOrders: 1,
          currentOrders: 1,
          dropCount: 1,
          dropPercentage: 1,
        },
      },

      {
        $facet: {
          results: [
            { $sort: { [sortField]: sortDirection } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const [facetOut] = await OrderModel.aggregate(pipeline).exec();

    const results: OrderVolumeDropResult[] = facetOut?.results || [];
    const total: number = facetOut?.totalCount?.[0]?.count ?? 0;

    return { results, total };
  }
}
