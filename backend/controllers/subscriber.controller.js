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
        subject: "Welcome to Oaklyn Newsletter 🏡",
        html: `
          <h2>Welcome to Oaklyn Real Estates</h2>
          <p>Thanks for subscribing to our newsletter.</p>

          <hr />
          <p style="font-size:12px;color:#666">
            Don’t want these emails?
            <a href="${unsubscribeUrl}" target="_blank">
              Unsubscribe here
            </a>
          </p>
          <p>– Team Oaklyn Real Estates</p>
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
      <p>${subscriber.email} will no longer receive emails from Oaklyn.</p>
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
