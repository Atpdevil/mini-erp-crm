import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

// ============================================
// CREATE LEAD
// ============================================
export const createLead = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      source,
      status,
      notes,
      customerId,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Lead name is required",
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        source: source || null,
        status: status || "NEW",
        notes: notes || null,

        ...(customerId
          ? {
              customer: {
                connect: {
                  id: Number(customerId),
                },
              },
            }
          : {}),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ============================================
// GET ALL LEADS
// ============================================
export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get leads",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ============================================
// GET LEAD BY ID
// ============================================
export const getLeadById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await prisma.lead.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
      },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Get lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get lead",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ============================================
// UPDATE LEAD
// ============================================
export const updateLead = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const {
      name,
      email,
      phone,
      company,
      source,
      status,
      notes,
      customerId,
    } = req.body;

    const lead = await prisma.lead.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && {
          name,
        }),

        ...(email !== undefined && {
          email: email || null,
        }),

        ...(phone !== undefined && {
          phone: phone || null,
        }),

        ...(company !== undefined && {
          company: company || null,
        }),

        ...(source !== undefined && {
          source: source || null,
        }),

        ...(status !== undefined && {
          status,
        }),

        ...(notes !== undefined && {
          notes: notes || null,
        }),

        ...(customerId !== undefined
          ? customerId
            ? {
                customer: {
                  connect: {
                    id: Number(customerId),
                  },
                },
              }
            : {
                customer: {
                  disconnect: true,
                },
              }
          : {}),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ============================================
// DELETE LEAD
// ============================================
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const existingLead = await prisma.lead.findUnique({
      where: {
        id,
      },
    });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await prisma.lead.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};