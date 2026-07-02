const Agent = require("../models/agent.model");
const sendEmail = require("../utils/sendEmail");

// Create Agent Request
exports.createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);

    // Admin Notification
    await sendEmail({
      to: "social_media@hindustanplastics.com",
      subject: "🤝 New Agent Registration - HPMC",
      html: `
  <div style="margin:0;padding:40px 20px;background:#f4f7f9;font-family:Arial,Helvetica,sans-serif;">
    <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

      <!-- Header -->
      <tr>
        <td align="center" style="padding:30px 20px;background:#ffffff;">
          <img
            src="https://res.cloudinary.com/fkvbncim/image/upload/v1782899294/hpmc/images/hp-logo.png"
            alt="HPMC"
            width="170"
            style="display:block;"
          />
        </td>
      </tr>

      <tr>
        <td style="height:5px;background:#65BC4F;"></td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="padding:35px 35px 15px;">
          <h2 style="margin:0;color:#111827;font-size:28px;">
            🤝 New Agent Registration
          </h2>
          <p style="margin:10px 0 0;color:#6b7280;font-size:15px;">
            A new distributor/agent registration has been submitted through the HPMC website.
          </p>
        </td>
      </tr>

      <!-- Applicant Details -->
      <tr>
        <td style="padding:0 35px 30px;">
          <table width="100%" cellpadding="12" cellspacing="0" style="border-collapse:collapse;font-size:15px;">

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;width:220px;border:1px solid #e5e7eb;">Name</td>
              <td style="border:1px solid #e5e7eb;">${agent.name}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Company</td>
              <td style="border:1px solid #e5e7eb;">${agent.companyName || "-"}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Email</td>
              <td style="border:1px solid #e5e7eb;">${agent.email}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Phone</td>
              <td style="border:1px solid #e5e7eb;">${agent.phone}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Business Type</td>
              <td style="border:1px solid #e5e7eb;">${agent.businessType || "-"}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Experience</td>
              <td style="border:1px solid #e5e7eb;">
                ${agent.experience ? `${agent.experience} Years` : "-"}
              </td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Location</td>
              <td style="border:1px solid #e5e7eb;">
                ${agent.city || "-"}, ${agent.state || "-"}
              </td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Current Products</td>
              <td style="border:1px solid #e5e7eb;">
                ${agent.currentProducts || "-"}
              </td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Monthly Requirement</td>
              <td style="border:1px solid #e5e7eb;">
                ${agent.monthlyRequirement || "-"}
              </td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Message</td>
              <td style="border:1px solid #e5e7eb;">
                ${agent.message || "-"}
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#111827;padding:20px;text-align:center;color:#ffffff;font-size:13px;">
          <strong>Hindustan Plastics & Machine Corporation (HPMC)</strong><br>
          Agent Registration Notification<br><br>
          Received on: ${new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </td>
      </tr>

    </table>
  </div>
  `,
    });

    res.status(201).json({
      success: true,
      message: "Agent request submitted successfully",
      data: agent,
    });
  } catch (error) {
    console.error("Create Agent Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Agent
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Agent Status
exports.updateAgentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    let statusMessage = "";

    switch (status) {
      case "approved":
        statusMessage =
          "Congratulations! Your agent application has been approved.";
        break;

      case "contacted":
        statusMessage =
          "Our team has reviewed your application and will contact you shortly.";
        break;

      case "rejected":
        statusMessage =
          "Thank you for your interest. Currently we are unable to proceed with your application.";
        break;

      default:
        statusMessage = "Your application is currently under review.";
    }

    // Applicant Email
    await sendEmail({
      to: agent.email,
      subject: `Your HPMC Agent Application - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      html: `
  <div style="margin:0;padding:40px 20px;background:#f4f7f9;font-family:Arial,Helvetica,sans-serif;">
    <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

      <!-- Header -->
      <tr>
        <td align="center" style="padding:35px 20px 20px;background:#ffffff;">
          <img
            src="https://res.cloudinary.com/fkvbncim/image/upload/v1782899294/hpmc/images/hp-logo.png"
            alt="HPMC"
            width="170"
            style="display:block;"
          />
        </td>
      </tr>

      <tr>
        <td style="height:5px;background:#65BC4F;"></td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding:40px 35px;">

          <h2 style="margin:0 0 20px;font-size:28px;color:#111827;">
            Hello ${agent.name},
          </h2>

          <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
            Thank you for your interest in becoming an
            <strong>HPMC Channel Partner / Agent.</strong>
          </p>

          <div style="
            background:#f3fdf1;
            border-left:5px solid #65BC4F;
            padding:18px 22px;
            border-radius:8px;
            margin:30px 0;
          ">
            <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">
              Application Status
            </div>

            <div style="
              font-size:22px;
              font-weight:bold;
              color:#111827;
              text-transform:uppercase;
            ">
              ${status}
            </div>
          </div>

          <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
            ${statusMessage}
          </p>

          <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
            Our team appreciates your interest in partnering with
            <strong>Hindustan Plastics & Machine Corporation (HPMC)</strong>.
          </p>

          <p style="margin:0;font-size:16px;line-height:1.8;color:#4b5563;">
            If you have any questions, please feel free to contact our team. We are happy to assist you.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:35px 0;">

          <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.8;">
            This is an automated email from HPMC.<br>
            Please do not reply to this message.<br><br>

            <strong>Hindustan Plastics & Machine Corporation (HPMC)</strong><br>
            Engineering Excellence Since 1972
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#111827;padding:18px;text-align:center;color:#ffffff;font-size:13px;">
          © ${new Date().getFullYear()} HPMC. All Rights Reserved.
        </td>
      </tr>

    </table>
  </div>
  `,
    });

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: agent,
    });
  } catch (error) {
    console.error("Update Agent Status Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Agent
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
