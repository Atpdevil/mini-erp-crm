import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const [
      customers,
      leads,
      products,
      orders,
      pendingOrders,
      sales
    ] = await Promise.all([
      prisma.customer.count(),

      prisma.lead.count(),

      prisma.product.count(),

      prisma.order.count(),

      prisma.order.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            not: "CANCELLED",
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        customers,
        leads,
        products,
        orders,
        pendingOrders,
        totalSales: sales._sum.total || 0,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get dashboard data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};