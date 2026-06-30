const Settings = require("../models/Settings");
const { normalizeLeadFormFields } = require("../utils/leadFormConfig");

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  let changed = false;

  if (settings.modules && settings.modules.testimonials === undefined) {
    settings.modules.testimonials = true;
    changed = true;
  }

  if (settings.modules && settings.modules.gallery === undefined) {
    settings.modules.gallery = true;
    changed = true;
  }

  if (changed) await settings.save();

  return settings;
};

/* =====================================
   GET SETTINGS
===================================== */
exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

/* =====================================
   UPDATE BRANDING
===================================== */
exports.updateBranding = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    if (req.body.companyName) {
      settings.branding.companyName = req.body.companyName;
    }

    if (req.file) {
      settings.branding.logo = req.file.secure_url || req.file.path;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Branding updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("UPDATE BRANDING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update branding",
    });
  }
};

/* =====================================
   UPDATE MODULES
===================================== */
exports.updateModules = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    settings.modules = {
      ...settings.modules.toObject(),
      ...req.body,
    };

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Modules updated successfully",
      data: settings.modules,
    });
  } catch (error) {
    console.error("UPDATE MODULES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update modules",
    });
  }
};

/* =====================================
   GET LEAD FORM SETTINGS
===================================== */
exports.getLeadFormSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      data: settings.leadForm || { customFields: [] },
    });
  } catch (error) {
    console.error("GET LEAD FORM SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lead form settings",
    });
  }
};

/* =====================================
   UPDATE LEAD FORM SETTINGS
===================================== */
exports.updateLeadFormSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const result = normalizeLeadFormFields(req.body?.customFields);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    settings.leadForm = {
      customFields: result.fields,
    };

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Lead form settings updated successfully",
      data: settings.leadForm,
    });
  } catch (error) {
    console.error("UPDATE LEAD FORM SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update lead form settings",
    });
  }
};
