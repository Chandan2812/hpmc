const axios = require("axios");

const cloudinaryToBrevoAttachment = async (file) => {
  const response = await axios.get(file.url, {
    responseType: "arraybuffer",
  });

  return {
    name: file.name,
    content: Buffer.from(response.data).toString("base64"),
  };
};

module.exports = cloudinaryToBrevoAttachment;
