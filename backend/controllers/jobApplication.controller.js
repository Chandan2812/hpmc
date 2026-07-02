const JobApplication = require("../models/jobApplication.model");
const sendEmail = require("../utils/sendEmail");

// Submit Resume
exports.createApplication = async (req, res) => {
  try {
    const {
      careerId,
      name,
      email,
      phone,
      currentLocation,
      experience,
      currentCompany,
      currentCTC,
      expectedCTC,
      noticePeriod,
      coverLetter,
    } = req.body || {};

    // Required Fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Phone are required",
      });
    }

    // Resume Required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    let resumeUrl = "";

    if (req.file.secure_url) {
      resumeUrl = req.file.secure_url;
    } else if (req.file.path) {
      resumeUrl = req.file.path;
    } else if (req.file.location) {
      resumeUrl = req.file.location;
    }

    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "Resume upload failed",
      });
    }

    const application = await JobApplication.create({
      careerId: careerId || null,
      name,
      email,
      phone,
      currentLocation,
      experience,
      currentCompany,
      currentCTC,
      expectedCTC,
      noticePeriod,
      coverLetter,
      resumeUrl,
    });

    // Emails...

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Application Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().populate("careerId").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Application
exports.getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id).populate(
      "careerId",
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Application Status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await sendEmail({
      to: application.email,
      subject: `Your Job Application Status - ${status.charAt(0).toUpperCase() + status.slice(1)} | HPMC`,
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

      <!-- Body -->
      <tr>
        <td style="padding:40px 35px;">

          <h2 style="margin:0 0 20px;font-size:28px;color:#111827;">
            Hello ${application.name},
          </h2>

          <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
            Thank you for your interest in joining
            <strong>Hindustan Plastics & Machine Corporation (HPMC)</strong>.
          </p>

          <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
            We would like to inform you that your job application has been reviewed and its status has been updated.
          </p>

          <!-- Status Card -->
          <div style="
            background:#f3fdf1;
            border-left:5px solid #65BC4F;
            padding:18px 22px;
            border-radius:8px;
            margin:30px 0;
          ">
            <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">
              Current Application Status
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
            If your application progresses to the next stage, our recruitment team will contact you with further details.
          </p>

          <p style="margin:0;font-size:16px;line-height:1.8;color:#4b5563;">
            We sincerely appreciate the time and effort you invested in applying to HPMC and thank you for considering us as part of your career journey.
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
      data: application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
