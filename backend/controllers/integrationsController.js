import integrationModel from "../models/integrationModel.js";
import slugify from "slugify";
export const createIntegrationController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const integrationFeature = await integrationModel.findOne({ name });
    if (integrationFeature) {
      return res.status(200).send({
        success: false,
        message: "Integration Already Exisits",
      });
    }
    const Integration = await new integrationModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new Integration created",
      Integration,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errror in Category",
    });
  }
};

//update feature
export const updateIntegrationController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const Integration = await integrationModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: "Integration Updated Successfully",
      Integration,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating Integration",
    });
  }
};

// get all features
export const integrationController = async (req, res) => {
  try {
    const Integration = await integrationModel.find({});
    res.status(200).send({
      success: true,
      message: "All Integration List",
      Integration,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all Integration",
    });
  }
};

// single category
export const singleIntegrationController = async (req, res) => {
  try {
    const Integration = await integrationModel.findOne({
      slug: req.params.slug,
    });
    res.status(200).send({
      success: true,
      message: "Get SIngle Integration SUccessfully",
      Integration,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Integration",
    });
  }
};

//delete category
export const deleteIntegrationCOntroller = async (req, res) => {
  try {
    const { id } = req.params;
    await integrationModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Integration Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting Integration",
      error,
    });
  }
};
