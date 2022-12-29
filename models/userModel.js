const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  name: { type: String, required: [true, "Field name is required"] },
  gender: {
    type: String,
    validate: {
      validator: (gender) => gender === "male" || gender === "female",
      message: "Incorrect or missing gender",
    },
    required: [true, "Field gender is required"],
  },
  position: { type: String },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

userSchema.plugin(uniqueValidator);

const User = model("User", userSchema);

module.exports = User;
