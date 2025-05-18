import featureModel from "../models/featureModel.js";
import slugify from "slugify";
export const createFeatureController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingFeature = await featureModel.findOne({ name });
    if (existingFeature) {
      return res.status(200).send({
        success: false,
        message: "Feature Already Exisits",
      });
    }
    const feature = await new featureModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new feature created",
      feature,
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
export const updateFeatureController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const feature = await featureModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: "feature Updated Successfully",
      feature,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating feature",
    });
  }
};

// get all features
export const featureController = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const skip = (page - 1) * limit;
    const total = await featureModel.countDocuments({});
    const features = await featureModel
      .find({})
      .skip(skip)
      .limit(Number(limit));

    res.status(200).send({
      success: true,
      message: "Features fetched successfully",
      features,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting features",
    });
  }
};

// single category
export const singleFeatureController = async (req, res) => {
  try {
    const feature = await featureModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle feature SUccessfully",
      feature,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single feature",
    });
  }
};

//delete category
export const deleteFeatureCOntroller = async (req, res) => {
  try {
    const { id } = req.params;
    await featureModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "feature Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting feature",
      error,
    });
  }
};
