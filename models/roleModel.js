const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const roleSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message: "The name must have more than 2 characters",
    },
    required: [true, "This field is required"],
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

roleSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

roleSchema.plugin(uniqueValidator);

const Role = model("Role", roleSchema);

module.exports = Role;
