import newsfeedModel from "../models/newsfeed.js";

export const Create = async (req, res) => {
  const result = await newsfeedModel.create(req.body);
  if (result) {
    res.status(201).send({
      success: true,
      message: "Newsfeed Created Successfully",
      data: result,
    });
  } else {
    res.status(400).send({
      success: false,
      message: "Something wents wrong while create newsfeed",
    });
  }
};

export const Get = async (req, res) => {
  const result = await newsfeedModel.find();
  if (result) {
    res.status(201).send({
      success: true,
      message: "Newsfeed fetch Successfully",
      data: result,
    });
  } else {
    res.status(400).send({
      success: false,
      message: "Something wents wrong while fetching newsfeed",
    });
  }
};
export const Update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedNewsfeed = await newsfeedModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedNewsfeed) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.status(200).json({ success: true, data: updatedNewsfeed });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const Delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteNewsfeed = await newsfeedModel.findByIdAndDelete(id);

    if (!deleteNewsfeed) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.status(200).json({ success: true, data: deleteNewsfeed });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
