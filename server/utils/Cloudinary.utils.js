const { cloudinary } = require("../config/cloudinary");

// Lega → file (req.file), folder (string)
// Dega → { public_id, url }

exports.uploadToCloudinary = async (file, folder) => {
  const fileUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(fileUri, { folder });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

exports.deleteFromCloudinary = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
};
