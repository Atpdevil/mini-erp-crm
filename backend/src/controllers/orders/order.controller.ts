import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

// CREATE ORDER
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, userId, items } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Check customer
    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(customerId),
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check user if provided
    if (userId !== undefined && userId !== null) {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    }

    // Get all products
    const productIds = items.map((item: any) => Number(item.productId));

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Check all products exist
    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products not found",
      });
    }

    // Validate stock and calculate total
    let total = 0;

    const orderItems: { productId: number; quantity: number; price: number; }[] = [];

    for (const item of items) {
      const product = products.find(
        (p) => p.id === Number(item.productId)
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product ${product.name}`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available stock: ${product.stock}`,
        });
      }

      const itemTotal = product.price * quantity;

      total += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity,
        price: product.price,
      });
    }

    // Transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId: Number(customerId),
          userId:
            userId !== undefined && userId !== null
              ? Number(userId)
              : null,
          total,
          items: {
            create: orderItems,
          },
        },
        include: {
          customer: true,
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Reduce stock
      for (const item of orderItems) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET ALL ORDERS
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET ORDER BY ID
export const getOrderById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// UPDATE ORDER STATUS
export const updateOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        customer: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// DELETE ORDER
export const deleteOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    await prisma.order.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};