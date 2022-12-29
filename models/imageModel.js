const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const imageSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message: "The name must have more than 2 characters",
    },
    required: [true, "This field is required"],
  },
  url: { type: String },
});

imageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

imageSchema.plugin(uniqueValidator);

const Image = model("Image", imageSchema);

module.exports = Image;
