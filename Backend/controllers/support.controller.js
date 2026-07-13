import { Support } from "../models/support.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import sendEmail from "../utils/sendEmail.js";
import {
  supportTicketConfirmationTemplate,
  supportTicketReplyTemplate,
  supportTicketStatusUpdateTemplate,
} from "../utils/emailTemplates.js";

const getSupportResponseLink = (role) => {
  if (role === "employer") return "/employer/support-responses";
  return "/jobseeker/support-responses";
};

// CREATE a new support ticket
export const createSupportTicket = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      message,
      category = "general",
      priority = "medium",
      role,
    } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    if (message.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 5 characters long",
      });
    }

    // Create support ticket
    const supportTicket = new Support({
      userId: userId || null,
      name,
      email,
      message,
      category,
      priority,
    });

    await supportTicket.save();

    let supportLink = "/contact-support";
    if (userId) {
      try {
        const ticketUser = await User.findById(userId).select("role");
        supportLink = getSupportResponseLink(role || ticketUser?.role);
      } catch (lookupError) {
        console.log("Failed to resolve support response link:", lookupError);
      }
    }

    // Create notification for user
    if (userId) {
      try {
        await Notification.create({
          recipient: userId,
          type: "SUPPORT",
          title: "Support Request Submitted",
          message: `Your support request has been submitted successfully. Ticket #${supportTicket._id.toString().slice(-8).toUpperCase()}`,
          link: supportLink,
        });
      } catch (notifError) {
        console.log("Notification creation failed:", notifError);
      }
    }

    // Send acknowledgement email to user
    try {
      const emailContent = supportTicketConfirmationTemplate(
        name,
        supportTicket._id,
        message,
        category,
      );

      await sendEmail({
        email: email,
        subject: `Support Ticket Received - #${supportTicket._id.toString().slice(-8).toUpperCase()}`,
        html: emailContent,
      });
    } catch (emailError) {
      console.log("Email sending failed:", emailError);
      // Continue even if email fails
    }

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully. We will contact you soon.",
      ticket: supportTicket,
    });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create support ticket",
      error: error.message,
    });
  }
};

// GET all support tickets (Admin only)
export const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await Support.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets",
    });
  }
};

// GET user's support tickets
export const getUserSupportTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await Support.find({ userId }).sort({ createdAt: -1 });

    if (!tickets.length) {
      return res.status(200).json({
        success: true,
        message: "No support tickets found",
        tickets: [],
      });
    }
    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets",
    });
  }
};

// GET single support ticket detail
export const getSupportTicketDetail = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Support.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket detail:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support ticket",
    });
  }
};

// UPDATE support ticket (Admin - add reply)
export const updateSupportTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { reply, status, priority } = req.body;

    const ticket = await Support.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    const oldStatus = ticket.status;

    // Update fields
    if (reply) {
      ticket.reply = reply;
      ticket.replyAt = new Date();
    }
    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;

    await ticket.save();

    let supportLink = "/contact-support";
    if (ticket.userId) {
      try {
        const ticketUser = await User.findById(ticket.userId).select("role");
        supportLink = getSupportResponseLink(ticketUser?.role);
      } catch (lookupError) {
        console.log("Failed to resolve support response link:", lookupError);
      }
    }

    // Send reply email if reply is provided
    if (reply) {
      try {
        const emailContent = supportTicketReplyTemplate(
          ticket.name,
          ticketId,
          reply,
        );

        await sendEmail({
          email: ticket.email,
          subject: `Re: Your Support Request - #${ticketId.toString().slice(-8).toUpperCase()}`,
          html: emailContent,
        });

        // Create notification for user about admin reply
        if (ticket.userId) {
          try {
            await Notification.create({
              recipient: ticket.userId,
              type: "SUPPORT",
              title: "Support Response Received",
              message: `You have received a response to your support request #${ticketId.toString().slice(-8).toUpperCase()}`,
              link: supportLink,
            });
          } catch (notifError) {
            console.log("Reply notification creation failed:", notifError);
          }
        }
      } catch (emailError) {
        console.log("Reply email sending failed:", emailError);
      }
    }

    // Send status update email when status changes
    if (status && status !== oldStatus) {
      try {
        const statusEmailContent = supportTicketStatusUpdateTemplate(
          ticket.name,
          ticketId,
          oldStatus,
          status,
        );

        await sendEmail({
          email: ticket.email,
          subject: `Support Request #${ticketId.toString().slice(-8).toUpperCase()} status updated`,
          html: statusEmailContent,
        });

        // Create notification for status update
        if (ticket.userId) {
          try {
            await Notification.create({
              recipient: ticket.userId,
              type: "SUPPORT",
              title: "Support Request Status Updated",
              message: `Your support request #${ticketId.toString().slice(-8).toUpperCase()} status changed from ${oldStatus} to ${status}`,
              link: supportLink,
            });
          } catch (notifError) {
            console.log("Status notification creation failed:", notifError);
          }
        }
      } catch (emailError) {
        console.log("Status update email sending failed:", emailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Support ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error updating support ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update support ticket",
    });
  }
};

// DELETE support ticket (Admin only)
export const deleteSupportTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Support.findByIdAndDelete(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Support ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting support ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete support ticket",
    });
  }
};

// GET support tickets by status (Admin)
export const getSupportTicketsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = ["open", "in-progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const tickets = await Support.find({ status }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets by status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets",
    });
  }
};
