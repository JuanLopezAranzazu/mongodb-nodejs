const express = require("express");
const roleRouter = express.Router();
// models
const Role = require("./../models/roleModel");

roleRouter.get("/", async (req, res, next) => {
  try {
    const roles = await Role.find({}).populate("users");
    res.json({ data: roles });
  } catch (error) {
    next(error);
  }
});

roleRouter.get("/:id", async (req, res, next) => {
  try {
    const { params } = req;
    const role = await Role.findById(params.id).populate("users");
    if (!role) {
      throw boom.notFound(`Role id #${params.id} not found`);
    }
    res.json({ data: role });
  } catch (error) {
    next(error);
  }
});

roleRouter.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const newRole = new Role(body);
    // create role
    await newRole.save();
    res.status(201).json({ data: "Role created successfully" });
  } catch (error) {
    next(error);
  }
});

roleRouter.put("/:id", async (req, res, next) => {
  try {
    const { body, params } = req;
    const role = await Role.findById(params.id);
    if (!role) {
      throw boom.notFound(`Role id #${params.id} not found`);
    }
    // update role
    await Role.findByIdAndUpdate(params.id, body);
    res.status(200).json({ data: "Role created successfully" });
  } catch (error) {
    next(error);
  }
});

roleRouter.delete("/:id", async (req, res, next) => {
  try {
    const { params } = req;
    const role = await Role.findById(params.id);
    if (!role) {
      throw boom.notFound(`Role id #${params.id} not found`);
    }
    // remove role
    await User.findByIdAndRemove(params.id);
    res.status(204).json({ data: "Role deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = roleRouter;
