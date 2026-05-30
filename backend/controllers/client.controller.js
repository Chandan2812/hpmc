const Client = require("../models/client.model");

/* =====================================
   CREATE CLIENT(S)
====================================== */

exports.createClient = async (req, res) => {
  try {
    let { names } = req.body;

    // Check files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Convert single name to array
    if (typeof names === "string") {
      names = [names];
    }

    if (!names || !Array.isArray(names)) {
      return res.status(400).json({
        success: false,
        message: "Client name(s) required",
      });
    }

    if (names.length !== req.files.length) {
      return res.status(400).json({
        success: false,
        message: "Number of names and images must match",
      });
    }

    const clientsToInsert = [];

    for (let i = 0; i < req.files.length; i++) {
      const image = req.files[i].secure_url || req.files[i].path;

      if (!image) {
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
        });
      }

      clientsToInsert.push({
        name: names[i].trim(),
        image,
      });
    }

    const savedClients = await Client.insertMany(clientsToInsert);

    return res.status(201).json({
      success: true,
      message: "Client(s) created successfully",
      count: savedClients.length,
      data: savedClients,
    });
  } catch (error) {
    console.error("CREATE CLIENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create client(s)",
    });
  }
};

/* =====================================
   GET ALL CLIENTS
====================================== */
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error("GET CLIENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
    });
  }
};

/* =====================================
   UPDATE CLIENT
====================================== */
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (name) client.name = name.trim();
    if (image) client.image = image;

    await client.save();

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    console.error("UPDATE CLIENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update client",
    });
  }
};

/* =====================================
   DELETE CLIENT
====================================== */
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CLIENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete client",
    });
  }
};
