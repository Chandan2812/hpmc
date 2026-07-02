const Vendor = require("../models/vendor.model");
const sendEmail = require("../utils/sendEmail");

// Create Vendor Registration
exports.createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);

    // Admin Notification
    await sendEmail({
      to: "social_media@hindustanplastics.com",
      subject: "🏭 New Vendor Registration - HPMC",
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
            🏭 New Vendor Registration
          </h2>

          <p style="margin:10px 0 0;color:#6b7280;font-size:15px;">
            A new vendor has submitted a registration request through the HPMC website.
          </p>
        </td>
      </tr>

      <!-- Contact Details -->
      <tr>
        <td style="padding:0 35px 25px;">
          <h3 style="margin:0 0 15px;color:#111827;">
            Contact Information
          </h3>

          <table width="100%" cellpadding="12" cellspacing="0" style="border-collapse:collapse;font-size:15px;">

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;width:220px;border:1px solid #e5e7eb;">Name</td>
              <td style="border:1px solid #e5e7eb;">${vendor.name}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Email</td>
              <td style="border:1px solid #e5e7eb;">${vendor.email}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Phone</td>
              <td style="border:1px solid #e5e7eb;">${vendor.phone}</td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- Company Details -->
      <tr>
        <td style="padding:0 35px 25px;">
          <h3 style="margin:0 0 15px;color:#111827;">
            Company Details
          </h3>

          <table width="100%" cellpadding="12" cellspacing="0" style="border-collapse:collapse;font-size:15px;">

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;width:220px;border:1px solid #e5e7eb;">Company Name</td>
              <td style="border:1px solid #e5e7eb;">${vendor.companyName}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Business Type</td>
              <td style="border:1px solid #e5e7eb;">${vendor.businessType}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">GST Number</td>
              <td style="border:1px solid #e5e7eb;">${vendor.gstNumber || "-"}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">PAN Number</td>
              <td style="border:1px solid #e5e7eb;">${vendor.panNumber || "-"}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Experience</td>
              <td style="border:1px solid #e5e7eb;">
                ${vendor.experience ? `${vendor.experience} Years` : "-"}
              </td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Website</td>
              <td style="border:1px solid #e5e7eb;">
                ${vendor.website || "-"}
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- Address -->
      <tr>
        <td style="padding:0 35px 25px;">
          <h3 style="margin:0 0 15px;color:#111827;">
            Address
          </h3>

          <table width="100%" cellpadding="12" cellspacing="0" style="border-collapse:collapse;font-size:15px;">

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;width:220px;border:1px solid #e5e7eb;">Address</td>
              <td style="border:1px solid #e5e7eb;">${vendor.address}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">City</td>
              <td style="border:1px solid #e5e7eb;">${vendor.city}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">State</td>
              <td style="border:1px solid #e5e7eb;">${vendor.state}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Country</td>
              <td style="border:1px solid #e5e7eb;">${vendor.country}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Pincode</td>
              <td style="border:1px solid #e5e7eb;">${vendor.pincode || "-"}</td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- Products & Message -->
      <tr>
        <td style="padding:0 35px 30px;">

          <h3 style="margin:0 0 15px;color:#111827;">
            Products / Services
          </h3>

          <div style="
            background:#f9fafb;
            border:1px solid #e5e7eb;
            border-radius:8px;
            padding:16px;
            color:#374151;
            line-height:1.7;
          ">
            ${vendor.productsServices}
          </div>

          <h3 style="margin:30px 0 15px;color:#111827;">
            Message
          </h3>

          <div style="
            background:#f9fafb;
            border:1px solid #e5e7eb;
            border-radius:8px;
            padding:16px;
            color:#374151;
            line-height:1.7;
          ">
            ${vendor.message || "-"}
          </div>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#111827;padding:20px;text-align:center;color:#ffffff;font-size:13px;">
          <strong>Hindustan Plastics & Machine Corporation (HPMC)</strong><br>
          Vendor Registration Notification<br><br>
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
      message: "Vendor registration submitted successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Create Vendor Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Vendor
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Vendor Status
exports.updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    let statusMessage = "";

    switch (status) {
      case "approved":
        statusMessage =
          "Congratulations! Your vendor application has been approved.";
        break;

      case "under_review":
        statusMessage =
          "Your vendor application is currently under review by our procurement team.";
        break;

      case "rejected":
        statusMessage =
          "Thank you for your interest. Currently we are unable to proceed with your vendor application.";
        break;

      default:
        statusMessage =
          "Your vendor application has been received successfully.";
    }

    // Applicant Notification
    await sendEmail({
      to: vendor.email,
      subject: `Your Vendor Registration - ${status
        .replace("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())} | HPMC`,
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
            Hello ${vendor.name},
          </h2>

          <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
            Thank you for your interest in becoming a vendor with
            <strong>Hindustan Plastics & Machine Corporation (HPMC)</strong>.
          </p>

          <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
            We have reviewed your registration request, and your application status has been updated.
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
              Current Registration Status
            </div>

            <div style="
              font-size:22px;
              font-weight:bold;
              color:#111827;
              text-transform:uppercase;
            ">
              ${status.replace("_", " ")}
            </div>
          </div>

          <p style="margin:0 0 25px;font-size:16px;line-height:1.8;color:#4b5563;">
            ${statusMessage}
          </p>

          <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
            We appreciate your interest in partnering with HPMC and look forward to building a successful business relationship.
          </p>

          <p style="margin:0;font-size:16px;line-height:1.8;color:#4b5563;">
            If you have any questions regarding your registration, please feel free to contact our procurement team.
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
      message: "Vendor status updated successfully",
      data: vendor,
    });
  } catch (error) {
    console.error("Update Vendor Status Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
