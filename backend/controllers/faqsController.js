import faqsModel from "../models/faqsModel.js";
import slugify from "slugify";

export const createFaqController = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    if (!question || !answer || !category) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const faqs = await faqsModel.findOne({ question });
    if (faqs) {
      return res.status(400).send({
        success: false,
        message: "FAQ already exists",
      });
    }
    const faq = await new faqsModel({
      question,
      answer,
      category,
      slug: slugify(question),
    }).save();
    res.status(201).send({
      success: true,
      message: "New FAQ created",
      faq,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating FAQ",
    });
  }
};
export const updateFaqController = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const { slug } = req.params;
    const updatedFaq = await faqsModel.findOneAndUpdate(
      { slug }, // Using the slug to find the FAQ
      { question, answer, category, slug: slugify(question) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "FAQ updated successfully",
      updatedFaq,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating FAQ",
    });
  }
};

// export const updateFaqController = async (req, res) => {
//   try {
//     const { question, answer, category } = req.body;
//     const { slug } = req.params;
//     const updatedFaq = await faqsModel.findOneAndUpdate(
//       { slug },
//       { question, answer, category, slug: slugify(question) },
//       { new: true }
//     );A
//     res.status(200).send({
//       success: true,
//       message: "FAQ updated successfully",
//       updatedFaq,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error while updating FAQ",
//     });
//   }
// };

export const faqsController = async (req, res) => {
  try {
    const faqs = await faqsModel.find({});
    res.status(200).send({
      success: true,
      message: "All FAQs retrieved successfully",
      faqs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while retrieving FAQs",
    });
  }
};

export const singleFaqController = async (req, res) => {
  try {
    const faq = await faqsModel.findOne({ slug: req.params.slug });
    if (!faq) {
      return res.status(404).send({
        success: false,
        message: "FAQ not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Single FAQ retrieved successfully",
      faq,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while retrieving FAQ",
    });
  }
};

export const deleteFaqController = async (req, res) => {
  try {
    const { id } = req.params;
    await faqsModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting FAQ",
      error,
    });
  }
};
