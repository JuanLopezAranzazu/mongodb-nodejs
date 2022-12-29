const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const roleSchema = new Schema({
  name: { type: String, require: [true, "This field is required"] },
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
