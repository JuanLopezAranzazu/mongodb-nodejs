const express = require("express");
const userRouter = express.Router();
const boom = require("@hapi/boom");
// models
const User = require("./../models/userModel");
const Role = require("./../models/roleModel");

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("role");
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findById(params.id).populate("role");
    if (!user) {
      throw boom.notFound(`User id #${params.id} not found`);
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const newUser = new User(body);
    // create user
    const savedUser = await newUser.save();
    // push user id
    await Role.findByIdAndUpdate(body.role, {
      $push: {
        users: savedUser._id,
      },
    });
    res.status(201).json({ data: "User created successfully" });
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:id", async (req, res, next) => {
  try {
    const { body, params } = req;
    const user = await User.findById(params.id);
    if (!user) {
      throw boom.notFound(`User id #${params.id} not found`);
    }
    // remove user id
    await Role.findByIdAndUpdate(user.role, {
      $pull: {
        users: user.id,
      },
    });
    // update user
    await User.findByIdAndUpdate(params.id, body);
    // push user id
    await Role.findByIdAndUpdate(body.role, {
      $push: {
        users: params.id,
      },
    });
    res.status(200).json({ data: "User updated successfully" });
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id", async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findById(params.id);
    if (!user) {
      throw boom.notFound(`User id #${params.id} not found`);
    }
    // remove user id
    await Role.findByIdAndUpdate(user.role, { $pull: { users: user.id } });
    // remove user
    await User.findByIdAndRemove(params.id);
    res.status(204).json({ data: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
