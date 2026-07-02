const Subscriber = require("../models/subscriber.model");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc   Subscribe Email
 * @route  POST /api/subscribers
 */
exports.subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (!subscriber.isActive) {
        subscriber.isActive = true;
        await subscriber.save();
      } else {
        return res.status(409).json({
          success: false,
          message: "Email already subscribed",
        });
      }
    } else {
      subscriber = await Subscriber.create({ email });
    }

    const unsubscribeUrl = `${process.env.BACKEND_URL}/subscribers/unsubscribe/${subscriber.unsubscribeToken}`;

    // ✅ Email should NOT break subscription
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to the HPMC Newsletter 🚀",
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
            Welcome to HPMC!
          </h2>

          <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5563;">
            Thank you for subscribing to the
            <strong>Hindustan Plastics & Machine Corporation (HPMC)</strong>
            newsletter.
          </p>

          <p style="margin:0 0 25px;font-size:16px;line-height:1.8;color:#4b5563;">
            You'll now receive updates about:
          </p>

          <div style="
            background:#f3fdf1;
            border-left:5px solid #65BC4F;
            padding:20px 24px;
            border-radius:8px;
            margin-bottom:30px;
          ">
            <p style="margin:0 0 10px;color:#111827;">✔ New Plastic Extrusion Machines</p>
            <p style="margin:0 0 10px;color:#111827;">✔ Product Launches & Innovations</p>
            <p style="margin:0 0 10px;color:#111827;">✔ Industry News & Technical Insights</p>
            <p style="margin:0;color:#111827;">✔ Company Updates & Special Announcements</p>
          </div>

          <p style="margin:0;font-size:16px;line-height:1.8;color:#4b5563;">
            We're excited to have you as part of the HPMC community and look forward to sharing valuable updates with you.
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:35px 0;">

          <p style="margin:0 0 10px;font-size:13px;color:#6b7280;">
            If you no longer wish to receive our newsletter, you can unsubscribe at any time.
          </p>

          <p style="margin:0;">
            <a
              href="${unsubscribeUrl}"
              target="_blank"
              style="
                color:#65BC4F;
                text-decoration:none;
                font-weight:bold;
              "
            >
              Unsubscribe from Newsletter
            </a>
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
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: subscriber,
    });
  } catch (error) {
    console.error("Subscribe Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc   Get all subscribers (Admin)
 * @route  GET /api/subscribers
 */
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc   Soft Unsubscribe (Inactive)
 * @route  PATCH /api/subscribers/:id/unsubscribe
 */
exports.unsubscribeEmail = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "Subscriber marked inactive",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @desc   Unsubscribe via secure token
 * @route  GET /api/subscribers/unsubscribe/:token
 */
exports.unsubscribeByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const subscriber = await Subscriber.findOne({
      unsubscribeToken: token,
    });

    if (!subscriber) {
      return res.send(`
        <h3>Invalid unsubscribe link</h3>
        <p>This link is not valid or already used.</p>
      `);
    }

    if (!subscriber.isActive) {
      return res.send(`
        <h3>Already unsubscribed</h3>
        <p>You are already unsubscribed.</p>
      `);
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.send(`
      <h2>Unsubscribed Successfully</h2>
      <p>${subscriber.email} will no longer receive emails from HPMC.</p>
    `);
  } catch (error) {
    res.send("<h3>Something went wrong</h3>");
  }
};

/**
 * @desc   HARD DELETE subscriber (Admin)
 * @route  DELETE /api/subscribers/:id
 */
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    await subscriber.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscriber deleted permanently",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
