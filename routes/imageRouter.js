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

imageRouter.get("/", async (req, res, next) => {
  try {
    const images = await Image.find({});
    res.json({ data: images });
  } catch (error) {
    next(error);
  }
});

imageRouter.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    console.log(body);
    await cloudinary.uploader.upload(
      "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
      { public_id: "olympic_flag" }
    );
    // generate url
    const url = cloudinary.url("olympic_flag", {
      width: 100,
      height: 150,
      Crop: "fill",
    });
    // create image
    const newImage = new Image({ name: "olympic_flag", url });
    await newImage.save();
    res.status(201).json({ data: "Image created successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = imageRouter;
