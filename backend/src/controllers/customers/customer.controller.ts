import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

console.log("PRISMA CHECK:", {
  prismaExists: !!prisma,
  customerExists: !!prisma?.customer,
});

// CREATE CUSTOMER
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      address,
      userId,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        address: address || null,

        ...(userId
          ? {
              user: {
                connect: {
                  id: Number(userId),
                },
              },
            }
          : {}),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create customer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET ALL CUSTOMERS
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        user: true,
        leads: true,
        orders: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get customers",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET CUSTOMER BY ID
export const getCustomerById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        leads: true,
        orders: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get customer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// UPDATE CUSTOMER
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    console.log("PUT CUSTOMER BODY:", req.body);
    console.log("PUT CUSTOMER PARAMS:", req.params);

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const {
      name,
      email,
      phone,
      company,
      address,
      userId,
    } = req.body || {};

    const customer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(address !== undefined && { address }),

        ...(userId !== undefined
          ? {
              user: userId
                ? {
                    connect: {
                      id: Number(userId),
                    },
                  }
                : {
                    disconnect: true,
                  },
            }
          : {}),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.error("Update customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// DELETE CUSTOMER
export const deleteCustomer = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    await prisma.customer.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};