const express = require("express");
const imageRouter = express.Router();
const { config } = require("./../config");
const cloudinary = require("cloudinary").v2;
// configuration
cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
});
// models
const Image = require("./../models/imageModel");
// multer
const uploadImage = require("../tools/uploadImage");

imageRouter.get("/", async (req, res, next) => {
  try {
    const images = await Image.find({});
    res.json({ data: images });
  } catch (error) {
    next(error);
  }
});

// upload image
imageRouter.post("/", uploadImage.single("image"), async (req, res, next) => {
  try {
    const { body } = req;
    console.log(body);
    const result = await cloudinary.uploader.upload(req.file.path);
    // create image
    const newImage = new Image({
      name: body.name,
      url: result.secure_url,
      cloudinary_id: result.public_id,
    });
    await newImage.save();
    res.status(201).json({ data: newImage });
  } catch (error) {
    next(error);
  }
});

// delete image
imageRouter.delete("/:id", async (req, res, next) => {
  try {
    const { params } = req;
    const image = await Image.findById(params.id);
    // delete image from cloudinary
    await cloudinary.uploader.destroy(image.cloudinary_id);
    // delete image from db
    await image.remove();
    res.status(204).json({ data: image });
  } catch (error) {
    next(error);
  }
});

module.exports = imageRouter;
