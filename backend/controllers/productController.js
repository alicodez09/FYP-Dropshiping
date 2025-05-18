import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import userModel from "../models/userModel.js";

import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config();
// pages/api/chat.js
// pages/api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { message, history } = req.body;
      const apiKey = "AIzaSyBS9wth5aGE53Rr9FlN9qx-HyTYkOJHkDM"; // Use environment variable

      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API key not configured on the server.' });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const chat = model.startChat({
        history: history || [],
      });

      const result = await chat.sendMessage(message);
      const response = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(response, "response");

      if (response) {
        res.status(200).json({ response });
      } else {
        res.status(500).json({ error: 'Failed to get a response from the Gemini API.' });
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      res.status(500).json({ error: 'Error communicating with the Gemini API.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
export const createProductController = async (req, res) => {
  console.log(req.body, "body");
  try {


    const product = await productModel.create(req.body);

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};
//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// add review
export const createProductReviewController = async (req, res) => {
  const { rating, note } = req.body;
  const { productId } = req.params;
  const userId = req.user._id; // Assuming you have user authentication

  try {
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if the user has already reviewed the product
    const existingReview = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.note = note;
    } else {
      // Add new review
      product.reviews.push({ user: userId, rating, note });
    }

    await product.save();
    res.status(200).json({
      message: "Review updated successfully",
      review: { rating, note },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserProductReviewController = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id; // Assuming you have user authentication

  try {
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    res.status(200).json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
export const updateProductController = async (req, res) => {

  console.log(req.body)
  console.log(req.params)

  return
  try {

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating product",
      error,
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 5;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};
// find user by review details
export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// deleteReview review details
// export const deleteReview = async (req, res) => {
//   try {
//     const { productId, reviewId } = req.params;

//     // Find the product by ID
//     const product = await productModel.findById(productId);

//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     // Filter out the review to be deleted
//     product.reviews = product.reviews.filter(
//       (review) => review._id.toString() !== reviewId
//     );

//     // Save the updated product
//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: "Review deleted successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// };

export const deleteReview = async (req, res) => {
  try {
    const { base64Image } = req.body; // Assuming the Base64 string is sent in the request body

    if (base64Image) {
      // Remove the data URL part if present (optional step, depends on your Base64 string)
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

      // Decode Base64 string and create a buffer
      const buffer = Buffer.from(base64Data, "base64");

      // Define the file path
      const filePath = path.join(__dirname, "outputImage.png");

      // Write the buffer to an image file
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error("Failed to write image to file:", err);
          return res.status(500).json({ message: "Failed to save image" });
        }
        console.log("Image saved successfully as outputImage.png");
        // Respond with success
        res
          .status(200)
          .json({ message: "Review deleted and image saved successfully" });
      });
    } else {
      // No Base64 image provided
      res.status(200).json({ message: "Review deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
